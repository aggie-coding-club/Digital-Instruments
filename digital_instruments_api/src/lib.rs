use std::time::Duration;

use wasm_bindgen::prelude::*;
use web_sys::console;

// This is like the `main` function, except for JavaScript.
#[wasm_bindgen(start)]
pub fn main_js() -> Result<(), JsValue> {
    // This provides better error messages in debug mode.
    // It's disabled in release mode so it doesn't bloat up the file size.
    #[cfg(debug_assertions)]
    console_error_panic_hook::set_once();

    Ok(())
}

use cpal::traits::{DeviceTrait, HostTrait, StreamTrait};
use cpal::{Stream, Sample, FromSample, SizedSample};

#[wasm_bindgen]
pub struct Handle(Stream);

#[wasm_bindgen]
pub fn beep(freq_input: Option<f32>) -> Handle {
    let freq = freq_input.unwrap_or(440.0);
    let host = cpal::default_host();
    let device = host
        .default_output_device()
        .expect("failed to find a default output device");
    let config = device.default_output_config().unwrap();

    Handle(match config.sample_format() {
        cpal::SampleFormat::F32 => run::<f32>(&device, &config.into(), freq),
        cpal::SampleFormat::I16 => run::<i16>(&device, &config.into(), freq),
        cpal::SampleFormat::U16 => run::<u16>(&device, &config.into(), freq),
        _ => todo!(),
    })
}

#[wasm_bindgen]
pub fn play_note(note_input: Option<i32>) -> Handle {
    // console::log_1(&format!("note_input: {:?}", note_input).into());
    let host = cpal::default_host();
    let device = host
        .default_output_device()
        .expect("failed to find a default output device");
    let config = device.default_output_config().unwrap();

    let freq = 440.0 * f32::powf(2.0, note_input.unwrap_or(0) as f32 / 12.0);

    Handle(match config.sample_format() {
        cpal::SampleFormat::F32 => run::<f32>(&device, &config.into(), freq),
        cpal::SampleFormat::I16 => run::<i16>(&device, &config.into(), freq),
        cpal::SampleFormat::U16 => run::<u16>(&device, &config.into(), freq),
        _ => todo!(),
    })
}

#[wasm_bindgen]
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
pub fn play_octave_note(octave: i32, note: i32) -> Handle {
    return play_note(
        Some(
            ((octave - 4) * 12) + note
        ));
}

#[wasm_bindgen]
/// Plays a note passed in as a string
///
/// # Arguments
///
/// * `note` - A string representing the note to play where "A4" is 0, "A#4" is 1, etc.
/// and so on. Defaults to 0 if not provided.
///
/// # Returns
/// 
/// A Handle object representing the note being played.
pub fn play_note_string(notestring: String) -> Handle{
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
    return play_octave_note(octave, note + modifier);
}

fn run<T>(device: &cpal::Device, config: &cpal::StreamConfig, freq: f32) -> Stream
where
    T: SizedSample + FromSample<f32>,
{
    let sample_rate = config.sample_rate.0 as f32;
    let channels = config.channels as usize;

    // Produce a sinusoid of maximum amplitude.
    let mut sample_clock = 0f32;
    let mut next_value = move || {
        sample_clock = (sample_clock + 1.0) % sample_rate;
        (sample_clock * freq * 2.0 * 3.141592 / sample_rate).sin()
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