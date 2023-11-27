let InstrumentLibrary = {
    currentInstrument: "None",
    instruments: {
      "Demo Instrument": {
          "title": "Demo Instrument",
          "img": "https://digitalinstruments.app/instruments.jpg",
          "description": "This instrument can play notes with the middle row of your keyboard.",
          "instrumentSound": {
              "overtoneRelativeAmplitudes": [
                  0.5,
                  1,
                  0.5,
                  0.5,
                  0.5
              ],
              "amplitudeValues": [
                  1,
                  0.01,
                  1,
                  0.0446,
                  0.5768,
                  0.030700000000000005
              ]
          },
          "binds": [
              {
                  "action": "KeyA",
                  "type": "note",
                  "value": "F2"
              },
              {
                  "action": "KeyS",
                  "type": "note",
                  "value": "F#2"
              },
              {
                  "action": "KeyD",
                  "type": "note",
                  "value": "G2"
              },
              {
                  "action": "KeyF",
                  "type": "note",
                  "value": "G#2"
              },
              {
                  "action": "KeyG",
                  "type": "note",
                  "value": "A2"
              },
              {
                  "action": "KeyH",
                  "type": "note",
                  "value": "A#2"
              },
              {
                  "action": "KeyJ",
                  "type": "note",
                  "value": "B2"
              },
              {
                  "action": "KeyK",
                  "type": "note",
                  "value": "C3"
              },
              {
                  "action": "KeyL",
                  "type": "note",
                  "value": "C#3"
              }
          ]
      }
  }
};

let updateCallbacks = [];

let first = true;

function runUpdateCallbacks() {
  updateCallbacks.forEach(callback => callback());
}

function loadFromStorage() {
  let stored = localStorage.getItem('InstrumentLibrary');
  if(stored) {
    InstrumentLibrary = JSON.parse(stored);
    runUpdateCallbacks();
  }
}

function addInstrument(instrument) {
  InstrumentLibrary.instruments[instrument.title] = instrument;
  localStorage.setItem('InstrumentLibrary', JSON.stringify(InstrumentLibrary));
  runUpdateCallbacks();
}

function removeInstrument(name) {
  delete InstrumentLibrary.instruments[name];
  if(name === InstrumentLibrary.currentInstrument) {
    InstrumentLibrary.currentInstrument = 'None';
  }
  localStorage.setItem('InstrumentLibrary', JSON.stringify(InstrumentLibrary));
  runUpdateCallbacks();
}

function addUpdateCallback(c) {
  updateCallbacks.push(c);
}

function setCurrentInstrument(i) {
  InstrumentLibrary.currentInstrument = i;
  runUpdateCallbacks();
}

function getInstrumentLibrary() {
  if(first) {
    loadFromStorage();
    first = false;
  }

  return InstrumentLibrary;
}

function getCurrentInstrument() {
  return InstrumentLibrary.instruments[InstrumentLibrary.currentInstrument];
}

export {
  getInstrumentLibrary,
  addInstrument,
  addUpdateCallback,
  setCurrentInstrument,
  removeInstrument,
  getCurrentInstrument,
}