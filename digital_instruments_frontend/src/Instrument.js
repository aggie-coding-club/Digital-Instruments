import React, {Component} from 'react';
const instrument = await import('digital_instruments');

class Instrument extends Component {
    constructor(props) {
        super(props);
        this.handles = new Map();
        this.downBinds = new Map();
        this.upBinds = new Map();

        this.createBind('KeyA', 'A4', false);
        this.createBind('KeyS', 'A#4', false);
        this.createBind('KeyD', 'B4', false);
        this.createBind('KeyF', 'C4', false);
        this.createBind('KeyG', 'C#4', false);
        this.createBind('KeyH', 'D4', false);
        this.createBind('KeyJ', 'D#4', false);
        this.createBind('KeyK', 'E4', false);
        this.createBind('KeyL', 'F4', false);
        this.createBind('KeyZ', 'F#4', false);
        this.createBind('KeyX', 'G4', false);
        this.createBind('KeyC', 'G#4', false);
        this.createBind('KeyV', 'A5', false);
    }

    // A toggle bind remains active until the key is pressed a second time.
    // Default behavior is to remain active while the key is held down.
    // action is the key or thing done to activate the bind.
    createBind(action, note, toggle = false) {
        if(toggle) {
            this.downBinds.set(action, () => this.toggleBeep(action, note));
        } else {
            this.downBinds.set(action, () => {
                if(!this.handles.has(action)) {
                    this.toggleBeep(action, note);
                }
            });

            this.upBinds.set(action, () => this.toggleBeep(action, note));
        }
    }

    toggleBeep(action, note) {
        if(this.handles.has(action)) {
            this.handles.get(action).free();
            this.handles.delete(action);
        } else {
            this.handles.set(action, this.startBeep(note));
        }
    }

    startBeep = (note = "") => {
        // volume: f32,
        // attack_seconds: f32,
        // attack_amplitude: f32,
        // decay_seconds: f32,
        // sustain_amplitude: f32,
        // release_seconds: f32,
        let instr = new instrument.Instrument(1, 2, 1, 0, 0, 0);
        let overtone_relative_amplitudes = [1];
        instr.set_overtone_relative_amplitudes(overtone_relative_amplitudes);
        return instr.play_note_string(note);
    }

    _handleDocumentClick = (event) => {
        console.log(event);
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

    componentDidMount(){
        document.addEventListener("click", this._handleDocumentClick, false);
        document.addEventListener("keydown", this._handleKeyDown);
        document.addEventListener("keyup", this._handleKeyUp);
    }
    
    componentWillUnmount() {
        document.removeEventListener("click", this._handleDocumentClick, false);
        document.removeEventListener("keydown", this._handleKeyDown);
        document.removeEventListener("keyup", this._handleKeyUp);
    }

    render() {
        return (
            <div>
                <p>Press the A-L and Z-V keys to play notes.</p>
            </div>
        );
    }
} export default Instrument;