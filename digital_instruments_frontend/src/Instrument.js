import React, {Component} from 'react';
import {getInstrumentLibrary} from './InstrumentLibrary';
const instrument = await import('digital_instruments');

class Instrument extends Component {
    constructor(props) {
        super(props);
        this.instruments = new Map();
        this.downBinds = new Map();
        this.upBinds = new Map();
        this.lastInstrument = null;

        this.createBind('KeyA', 'note', 'A3');
        this.createBind('KeyS', 'note', 'A#3');
        this.createBind('KeyD', 'note', 'B3');
        this.createBind('KeyF', 'note', 'C3');
        this.createBind('KeyG', 'note', 'C#3');
        this.createBind('KeyH', 'note', 'D3');
        this.createBind('KeyJ', 'note', 'D#3');
        this.createBind('KeyK', 'note', 'E3');
        this.createBind('KeyL', 'note', 'F3');
        this.createBind('KeyZ', 'note', 'F#3');
        this.createBind('KeyX', 'note', 'G3');
        this.createBind('KeyC', 'note', 'G#3');
        this.createBind('KeyV', 'note', 'A4');
        this.createBind('MouseMoveY', 'volume');
    }

    // A toggle bind remains active until the key is pressed a second time.
    // Default behavior is to remain active while the key is held down.
    // action is the key or thing done to activate the bind.
    createBind(action, type, value = null) {
        if(action.startsWith('Key')) {
            if(type === 'toggleNote') {
                this.downBinds.set(action, () => this.toggleBeep(action, value));
            } else if(type === 'note') {
                this.downBinds.set(action, () => {
                    if(!this.instruments.has(action) || this.instruments.get(action).is_releasing()) {
                        this.toggleBeep(action, value);
                    }
                });
                this.upBinds.set(action, () => this.toggleBeep(action, value));
            } else {
                alert('Type \'' + type + '\' is not supported.')
            }
        } else if(action === 'MouseMoveY') {
            if(type === 'volume') {
                this.downBinds.set(action, (event) => {
                    for(let i of this.instruments.values()) {
                        i.update_volume(event.movementY / 1000);
                    }
                });
            }
        }
    }

    updateInstruments() {
        let current = getInstrumentLibrary().currentInstrument;
        if(current !== this.lastInstrument) {
            this.instruments.forEach((value, key) => {
                let instrument = value;
                instrument.release();
            });
            this.instruments.clear();
        }
        this.lastInstrument = current;
    }

    toggleBeep(action, note) {
        this.updateInstruments();
        if(this.instruments.has(action)) {
            let instrument = this.instruments.get(action);
            if(instrument.is_releasing()) {
                instrument.play_note_string(note);
            } else {
                this.instruments.get(action).release();
            }            
        } else {
            this.instruments.set(action, this.startBeep(note));
        }
    }

    startBeep = (note = "") => {
        this.updateInstruments();
        // volume: f32,
        // attack_seconds: f32,
        // attack_amplitude: f32,
        // decay_seconds: f32,
        // sustain_amplitude: f32,
        // release_seconds: f32,
        let instr = new instrument.Instrument(1, 0.01, 1, 0.02, 0.3, 0.2);
        let overtone_relative_amplitudes = getInstrumentLibrary().currentInstrument.instrumentSound.overtoneRelativeAmplitudes;
        instr.set_overtone_relative_amplitudes(overtone_relative_amplitudes);
        if(getInstrumentLibrary().currentInstrument.title !== "None"){
            instr.play_note_string(note);
        }
        return instr;
    }

    _handleDocumentClick = (event) => {
    }

    _handleKeyDown = (event) => {
        // If the event is not case sensitive, it should use the code
        if(this.downBinds.has(event.code)) {
            this.downBinds.get(event.code)();
        }

        //If the event is case sensitive, the key should be used
        if(this.downBinds.has(event.key)) {
            this.downBinds.get(event.key)();
        }
    }

    _handleKeyUp = (event) => {
        // If the event is not case sensitive, it should use the code
        if(this.upBinds.has(event.code)) {
            this.upBinds.get(event.code)();
        }

        //If the event is case sensitive, the key should be used
        if(this.upBinds.has(event.key)) {
            this.upBinds.get(event.key)();
        }
    }

    _handleMouseMove = (event) => {
        if(this.downBinds.has('MouseMoveX')) {
            this.downBinds.get('MouseMoveX')(event);
        }
        if(this.downBinds.has('MouseMoveY')) {
            this.downBinds.get('MouseMoveY')(event);
        }
    }

    componentDidMount(){
        document.addEventListener("click", this._handleDocumentClick, false);
        document.addEventListener("keydown", this._handleKeyDown);
        document.addEventListener("keyup", this._handleKeyUp);
        document.addEventListener("mousemove", this._handleMouseMove);
    }
    
    componentWillUnmount() {
        document.removeEventListener("click", this._handleDocumentClick, false);
        document.removeEventListener("keydown", this._handleKeyDown);
        document.removeEventListener("keyup", this._handleKeyUp);
        document.removeEventListener("mousemove", this._handleMouseMove);
    }

    render() {
        return (
            <div>
                <p>Press the A-L and Z-V keys to play notes.</p>
            </div>
        );
    }
} export default Instrument;