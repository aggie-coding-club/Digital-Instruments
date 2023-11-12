import React, {Component} from 'react';
const instrument = await import('digital_instruments');

class Instrument extends Component {
    constructor(props) {
        super(props);
        this.instruments = new Map();
        this.downBinds = new Map();
        this.upBinds = new Map();

        const keyBinds = {
            'KeyQ': 'C3',
            'KeyW': 'C#3',
            'KeyE': 'D3',
            'KeyR': 'Eb3',
            'KeyT': 'E3',
            'KeyY': 'F3',
            'KeyU': 'F#3',
            'KeyI': 'G3',
            'KeyO': 'G#3',
            'KeyP': 'A3',
            'BracketLeft': 'Bb3',
            'BracketRight': 'B3',

            'KeyA': 'C4',
            'KeyS': 'C#4',
            'KeyD': 'D4',
            'KeyF': 'Eb4',
            'KeyG': 'E4',
            'KeyH': 'F4',
            'KeyJ': 'F#4',
            'KeyK': 'G4',
            'KeyL': 'G#4',
            'Semicolon': 'A4',
            'Quote': 'Bb4',
            'ShiftRight': 'B4',

            'KeyZ': 'C5',
            'KeyX': 'C#5',
            'KeyC': 'D5',
            'KeyV': 'Eb5',
            'KeyB': 'E5',
            'KeyN': 'F5',
            'KeyM': 'F#5',
            'Comma': 'G5',
            'Period': 'G#5',
            'Slash': 'A5',
        }
        this.keyBinds = keyBinds;

        for (const [key, value] of Object.entries(keyBinds)) {
            this.createBind(key, 'note', value);
        }

        this.createBind('MouseMoveY', 'volume');
    }

    // A toggle bind remains active until the key is pressed a second time.
    // Default behavior is to remain active while the key is held down.
    // action is the key or thing done to activate the bind.
    createBind(action, type, value = null) {
        if(this.keyBinds.hasOwnProperty(action)) {
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

    toggleBeep(action, note) {
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
        // volume: f32,
        // attack_seconds: f32,
        // attack_amplitude: f32,
        // decay_seconds: f32,
        // sustain_amplitude: f32,
        // release_seconds: f32,

        let volumeData = this._readVolumeGraph();
        let instr = new instrument.Instrument(1, volumeData[0], volumeData[1], volumeData[2], volumeData[3], volumeData[4]);
        let overtone_relative_amplitudes = [1.5, 0.3, 0.2, 0.1, 0.02];
        instr.set_overtone_relative_amplitudes(overtone_relative_amplitudes);
        instr.play_note_string(note);
        return instr;
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

    _handleMouseMove = (event) => {
        if(this.downBinds.has('MouseMoveX')) {
            this.downBinds.get('MouseMoveX')(event);
        }
        if(this.downBinds.has('MouseMoveY')) {
            this.downBinds.get('MouseMoveY')(event);
        }
    }

    _readVolumeGraph = () => {
        let volumeGraph = document.getElementById('volumeGraph');
        let volumeData = volumeGraph.volumeData;

        console.log(volumeData);
        return volumeData;
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