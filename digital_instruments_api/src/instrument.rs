use std::time::Duration;

use wasm_bindgen::prelude::*;
use web_sys::console;

use cpal::traits::{DeviceTrait, HostTrait, StreamTrait};
use cpal::{Stream, Sample, FromSample, SizedSample};

#[wasm_bindgen]
pub struct Handle(Stream);

#[wasm_bindgen]
pub struct Instrument {
    volume: f32,
    attack_seconds: f32,
    attack_amplitude: f32,
    decay_seconds: f32,
    sustain_amplitude: f32,
    release_seconds: f32,
    overtone_relative_amplitudes: Vec<f32>,
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
    pub fn new(volume: f32, attack_seconds: f32, attack_amplitude:f32, decay_seconds: f32, sustain_amplitude: f32, release_seconds: f32) -> Self {
        Self {
            volume: volume,
            attack_seconds: attack_seconds,
            attack_amplitude: attack_amplitude,
            decay_seconds: decay_seconds,
            sustain_amplitude: sustain_amplitude,
            release_seconds: release_seconds,
            overtone_relative_amplitudes: Vec::<f32>::new(),
        }
    }

    pub fn play_freq(&self, freq: f32) -> Handle {
        let host = cpal::default_host();
        let device = host
            .default_output_device()
            .expect("failed to find a default output device");
        let config = device.default_output_config().unwrap();

        Handle(match config.sample_format() {
            cpal::SampleFormat::F32 => self.run::<f32>(&device, &config.into(), freq),
            cpal::SampleFormat::I16 => self.run::<i16>(&device, &config.into(), freq),
            cpal::SampleFormat::U16 => self.run::<u16>(&device, &config.into(), freq),
            _ => todo!(),
        })
    }

    pub fn play_note(&self, note_input: Option<i32>) -> Handle {
        let host = cpal::default_host();
        let device = host
            .default_output_device()
            .expect("failed to find a default output device");
        let config = device.default_output_config().unwrap();

        let note_input = note_input.unwrap_or(0) as f32;
        let freq = 440.0 * f32::powf(2.0, note_input / 12.0);

        Handle(match config.sample_format() {
            cpal::SampleFormat::F32 => self.run::<f32>(&device, &config.into(), freq),
            cpal::SampleFormat::I16 => self.run::<i16>(&device, &config.into(), freq),
            cpal::SampleFormat::U16 => self.run::<u16>(&device, &config.into(), freq),
            _ => todo!(),
        })
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
    pub fn play_octave_note(&self, octave: i32, note: i32) -> Handle {
        return self.play_note(
            Some(
                ((octave - 4) * 12) + note
            ));
    }

    pub fn play_note_string(&self, notestring: String) -> Handle{
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
        return self.play_octave_note(octave, note + modifier);
    }
    
    
    pub fn set_overtone_relative_amplitudes(&mut self, overtone_relative_amplitudes: Vec<f32>) {
        self.overtone_relative_amplitudes = overtone_relative_amplitudes;
    }

    fn run<T>(&self, device: &cpal::Device, config: &cpal::StreamConfig, freq: f32) -> Stream
    where
        T: SizedSample + FromSample<f32>,
    {
        let sample_rate = config.sample_rate.0 as f32;
        let channels = config.channels as usize;

        let amplitude_multiplier = 1.0;

        // Produce a sinusoid of maximum amplitude.
        let mut sample_clock = 0f32;
        let relative_amplitudes = self.overtone_relative_amplitudes.clone();
        // let relative_amplitudes = &self.overtone_relative_amplitudes;
        let mut next_value = move || {
            // sample_clock = (sample_clock + 1.0) % sample_rate;
            sample_clock += 1.0 / sample_rate;

            let mut result = 0.0;
            let mut extra_amplitude = 0.0;
            for (i, amplitude) in relative_amplitudes.iter().enumerate()  {
                result += (sample_clock * freq * (i + 1) as f32 * 2.0 * 3.141592).sin() * amplitude;
                extra_amplitude += amplitude;
            }
            result /= extra_amplitude;
            result *= amplitude_multiplier;
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
        stream
    }
}

fn write_data<T>(output: &mut [T], channels: usize, next_sample: &mut dyn FnMut() -> f32)
where
    T: Sample + FromSample<f32>,
{
    for frame in output.chunks_mut(channels) {
        let value = T::from_sample(next_sample());
        for sample in frame.iter_mut() {
            *sample = value;
        }
    }
}
