import React, {Component} from 'react';
import {getInstrumentLibrary, addUpdateCallback, getCurrentInstrument} from './InstrumentLibrary';
const instrument = await import('digital_instruments');

class Instrument extends Component {
    constructor(props) {
        super(props);
        this.instruments = new Map();
        this.downBinds = new Map();
        this.upBinds = new Map();
        this.updateInstruments();
        this.updateCallback = this.updateCallback.bind(this);
        addUpdateCallback(this.updateCallback);
    }

    updateCallback() {
        this.updateInstruments();
    }

    // A toggle bind remains active until the key is pressed a second time.
    // Default behavior is to remain active while the key is held down.
    // action is the key or thing done to activate the bind.
    createBind(bind) {
        let action = bind.action;
        let type = bind.type;
        let value = bind.value;
        if(action === 'MouseMoveY' || action === 'MouseMoveX') {
            let movementType = 'movementX';
            if(action === 'MouseMoveY') {
                movementType = 'movementY'
            }
            if(type === 'volume') {
                this.downBinds.set(action, (event) => {
                    for(let i of this.instruments.values()) {
                        i.update_volume(event[movementType] / 1000);
                    }
                });
            } else if(type === 'frequency') {
                this.downBinds.set(action, (event) => {
                    for(let i of this.instruments.values()) {
                        i.update_frequency_bend(-1, 1, event[movementType] / 1000);
                    }
                });
            }
        } else {
            this.instruments.set(action, this.buildCurrentInstrument());
            if(type === 'toggleNote') {
                this.downBinds.set(action, () => this.toggleBeep(action, value));
            } else if(type === 'note') {
                this.downBinds.set(action, () => {

                    if(this.instruments.get(action).is_releasing() || !this.instruments.get(action).has_started()) {
                        this.toggleBeep(action, value);
                    }
                });
                this.upBinds.set(action, () => this.toggleBeep(action, value));
            } else if(type === 'volume') {
                this.downBinds.set(action, (event) => {
                    for(let i of this.instruments.values()) {
                        i.set_volume(value);
                    }
                });
            } else if(type === 'frequency') {
                this.downBinds.set(action, (event) => {
                    for(let i of this.instruments.values()) {
                        i.set_frequency_bend(value);
                    }
                });
            } else {
                alert('Keybind type \'' + type + '\' is not supported. Make sure all your keybinds are set properly!')
            }
        }
    }

    updateInstruments() {
        this.instruments.forEach((instrument, key) => {
            instrument.release();
        });
        this.instruments.clear();
        this.upBinds.clear();
        this.downBinds.clear();
        if(getInstrumentLibrary().currentInstrument === 'None') return;
        let current = getCurrentInstrument();
        for(let bind of current.binds) {
            this.createBind(bind);
        }
    }

    toggleBeep(action, note) {
        let instrument = this.instruments.get(action);
        if(instrument.is_releasing() || !instrument.has_started()) {
            instrument.play_note_string(note);
        } else {
            this.instruments.get(action).release();
        }            
    }

    buildCurrentInstrument() {
        let [volume, attackSeconds, attackAmplitude, decaySeconds, sustainAmplitude, releaseSeconds] = getCurrentInstrument().instrumentSound.amplitudeValues;
        let instr = new instrument.Instrument(volume, attackSeconds, attackAmplitude, decaySeconds, sustainAmplitude, releaseSeconds);
        let overtone_relative_amplitudes = getCurrentInstrument().instrumentSound.overtoneRelativeAmplitudes;
        instr.set_overtone_relative_amplitudes(overtone_relative_amplitudes);
        return instr;
    }

    startBeep = (note = "") => {
        // volume: f32,
        // attack_seconds: f32,
        // attack_amplitude: f32,
        // decay_seconds: f32,
        // sustain_amplitude: f32,
        // release_seconds: f32,
        let instr = this.buildCurrentInstrument();
        if(getInstrumentLibrary().currentInstrument !== "None"){
            instr.play_note_string(note);
        }
        return instr;
    }

    _handleDocumentClick = (event) => {
        if(this.props.enabled === false) return;
    }

    _handleKeyDown = (event) => {
        if(this.props.enabled === false) return;
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
        if(this.props.enabled === false) return;
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
        if(this.props.enabled === false) return;
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
            </div>
        );
    }
} export default Instrument;