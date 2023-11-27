let InstrumentLibrary = {
    currentInstrument: "None",
    instruments: {}
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