let InstrumentLibrary = {
    currentInstrument: "Piano",
    instruments: {
        Piano: {
          title: "Piano",
          img: "https://th.bing.com/th/id/OIP.Cy7-Xf2U_h5Eqrdodq-3iAHaHa?pid=ImgDet&rs=1",
          description: "This plays notes like an instrument",
          instrumentSound: {
            overtoneRelativeAmplitudes: [16,1,1,1,1,1,1,1],
            amplitudeValues: [1, 0.01, 1, 0.02, 0.3, 0.2],
          },
          binds:[
            {
              action: 'MouseMoveX',
              type: 'frequency',
            },
            {
              action: 'KeyA',
              type: 'note',
              value: 'C3',
            },
            {
              action: 'KeyS',
              type: 'note',
              value: 'C#3',
            },
          ],
        },
    },
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