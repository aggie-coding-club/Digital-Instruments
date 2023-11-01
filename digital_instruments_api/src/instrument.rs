use std::sync::atomic::{AtomicBool, Ordering};
use std::sync::{Arc, Mutex};
use std::time::Duration;

use atomic_float::AtomicF64;
use cpal::traits::{HostTrait, DeviceTrait, StreamTrait};
use wasm_bindgen::prelude::*;
use web_sys::console;


use cpal::{Stream, Sample, FromSample, SizedSample};

#[wasm_bindgen]
pub struct Instrument {
    volume: Arc<AtomicF64>,
    attack_seconds: f64,
    attack_amplitude: f64,
    decay_seconds: f64,
    sustain_amplitude: f64,
    release_seconds: f64,
    releasing: Arc<AtomicBool>,
    overtone_relative_amplitudes: Arc<Mutex<Vec<f64>>>,
    stream: Option<Stream>,
}

#[wasm_bindgen]
impl Instrument {
    /// Makes an instrument with the specified properties.
    ///
    /// # Arguments
    ///
    /// * `volume` - master volume of instrument
    /// * `attack_seconds` - duration in seconds of attack phase
    /// * `attack_amplitude` - amplitude at the end of the attack phase and the start of the decay phase
    /// if volume is at max (1.0). Must be <= 1.0
    /// * `decay_seconds` - duration in seconds of decay phase
    /// * `sustain_amplitude` - amplitude after the decay phase and during the sustain phase
    /// if volume is at max (1.0). Must be <= 1.0
    /// * `release_seconds` - duration in seconds of release phase
    ///
    /// # Returns
    ///
    /// Instrument object
    #[wasm_bindgen(constructor)]
    pub fn new(volume: f64, attack_seconds: f64, attack_amplitude:f64, decay_seconds: f64, sustain_amplitude: f64, release_seconds: f64) -> Self {
        Self {
            volume: Arc::new(volume.into()),
            attack_seconds: attack_seconds,
            attack_amplitude: attack_amplitude,
            decay_seconds: decay_seconds,
            sustain_amplitude: sustain_amplitude,
            release_seconds: release_seconds,
            releasing: Arc::new(AtomicBool::new(false)),
            overtone_relative_amplitudes: Arc::new(Mutex::new(Vec::<f64>::new())),
            stream: None,
        }
    }

    pub fn is_releasing(&self) -> bool {
        self.releasing.load(Ordering::Relaxed)
    }

    pub fn play_freq(&mut self, freq: f64) {
        let host = cpal::default_host();
        let device = host
            .default_output_device()
            .expect("failed to find a default output device");
        let config = device.default_output_config().unwrap();

        match config.sample_format() {
            cpal::SampleFormat::F32 => self.run::<f32>(&device, &config.into(), freq),
            cpal::SampleFormat::I16 => self.run::<i16>(&device, &config.into(), freq),
            cpal::SampleFormat::U16 => self.run::<u16>(&device, &config.into(), freq),
            _ => todo!(),
        };
    }

    pub fn play_note(&mut self, note_input: Option<i32>) {
        let note_input = note_input.unwrap_or(0) as f64;
        let freq = 440.0 * f64::powf(2.0, note_input / 12.0);

        self.play_freq(freq);
    }

    /// Plays a note in the specified octave.
    ///
    /// # Arguments
    ///
    /// * `octave` - An optional integer representing the octave to play the note in. Defaults to 4 if not provided.
    /// * `note` - An optional integer representing the note to play where 0 is A, 1 is A#, and so on. Defaults to 0 if not provided.
    ///
    /// # Returns
    ///
    /// A Handle object representing the note being played.
    pub fn play_octave_note(&mut self, octave: i32, note: i32) {
        self.play_note(
            Some(
                ((octave - 4) * 12) + note
            ));
    }

    pub fn free(&mut self) {
        let _ = self.stream.as_ref().unwrap().pause();
        self.stream = None;
    }

    pub fn release(&self) {
        self.releasing.store(true, Ordering::Relaxed);
    }

    pub fn play_note_string(&mut self, notestring: String) {
        let octave = notestring.chars().last().unwrap_or('4').to_digit(10).unwrap_or(4) as i32;
        let note = match notestring.chars().nth(0).unwrap_or('A') {
            'A' => 0,
            'B' => 2,
            'C' => 3,
            'D' => 5,
            'E' => 7,
            'F' => 8,
            'G' => 10,
            _ => 0,
        };

        let modifier = match notestring.chars().nth(1).unwrap_or(' ') {
            '#' => 1,
            'b' => -1,
            _ => 0,
        };

        self.play_octave_note(octave, note + modifier);
    }
    
    
    pub fn set_overtone_relative_amplitudes(&self, overtone_relative_amplitudes: Vec<f64>) {
        let mut relative_amplitudes = self.overtone_relative_amplitudes.lock().unwrap();
        *relative_amplitudes = overtone_relative_amplitudes;
    }

    pub fn set_volume(&self, volume: f64) {
        self.volume.store(volume, Ordering::Relaxed);
    }

    pub fn update_volume(&self, volume_change: f64) {
        let mut volume = self.volume.load(Ordering::Relaxed);
        volume += volume_change;
        if volume > 1.0 {
            volume = 1.0;
        } else if volume < 0.0 {
            volume = 0.0;
        }

        self.volume.store(volume, Ordering::Relaxed);
    }

    pub fn get_volume(&self) -> f64 {
        self.volume.load(Ordering::Relaxed)
    }

    fn run<T>(&mut self, device: &cpal::Device, config: &cpal::StreamConfig, freq: f64)
    where
        T: SizedSample + FromSample<f64>,
    {
        self.releasing.store(false, Ordering::Relaxed);
        let sample_rate = config.sample_rate.0 as f64;
        let channels = config.channels as usize;

        // Produce a sinusoid of maximum amplitude.
        let mut sample_clock = 0.0;
        let relative_amplitudes = self.overtone_relative_amplitudes.clone();
        let volume = self.volume.clone();
        let attack_seconds = self.attack_seconds;
        let attack_amplitude = self.attack_amplitude;
        let decay_seconds = self.decay_seconds;
        let sustain_amplitude = self.sustain_amplitude;
        let release_seconds = self.release_seconds;
        let mut release_start = 0.0;
        let is_releasing = self.releasing.clone();

        let mut next_value = move || {
            sample_clock += 1.0 / sample_rate;

            if release_start == 0.0 && is_releasing.load(Ordering::Relaxed) {
                release_start = sample_clock;
            }

            let mut amplitude_multiplier = sustain_amplitude;

            if sample_clock < attack_seconds {
                amplitude_multiplier = attack_amplitude * sample_clock / attack_seconds;
            } else if (sample_clock < attack_seconds + decay_seconds) && (sample_clock > attack_seconds) {
                amplitude_multiplier = (sample_clock - attack_seconds) / decay_seconds * (sustain_amplitude - attack_amplitude) + attack_amplitude;
            } else if release_start > 0.0 && (sample_clock - release_start) < release_seconds {
                amplitude_multiplier = (1.0 - (sample_clock - release_start) / release_seconds) * sustain_amplitude;
            } else if release_start > 0.0 {
                return 0.0;
            }

            let mut result = 0.0;
            let mut extra_amplitude = 0.0;
            for (i, amplitude) in relative_amplitudes.lock().unwrap().iter().enumerate()  {
                result += (sample_clock * freq * (i + 1) as f64 * 2.0 * 3.141592).sin() * amplitude;
                extra_amplitude += amplitude;
            }
            result /= extra_amplitude;
            result *= amplitude_multiplier;
            result *= volume.load(Ordering::Relaxed);
            result
        };
        
        let err_fn = |err| console::error_1(&format!("an error occurred on stream: {}", err).into());

        let stream = device
            .build_output_stream(
                config,
                move |data: &mut [T], _| write_data(data, channels, &mut next_value),
                err_fn,
                Some(Duration::from_secs(1)),
            )
            .unwrap();
        stream.play().unwrap();
        self.stream = Some(stream);
    }
}

fn write_data<T>(output: &mut [T], channels: usize, next_sample: &mut dyn FnMut() -> f64)
where
    T: Sample + FromSample<f64>,
{
    for frame in output.chunks_mut(channels) {
        let value = T::from_sample(next_sample());
        for sample in frame.iter_mut() {
            *sample = value;
        }
    }
}
