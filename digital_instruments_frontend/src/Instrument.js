import React, {Component} from 'react';
const instrument = await import('digital_instruments');

class Instrument extends Component {
    constructor(props) {
        super(props);
        this.handles = new Map();
        this.downBinds = new Map();
        this.upBinds = new Map();

        this.createBind('KeyA', 0, false);
        this.createBind('KeyS', 1, false);
        this.createBind('KeyD', 2, false);
        this.createBind('KeyF', 3, false);
        this.createBind('KeyG', 4, false);
        this.createBind('KeyH', 5, false);
        this.createBind('KeyJ', 6, false);
        this.createBind('KeyK', 7, false);
        this.createBind('KeyL', 8, false);
        this.createBind('KeyZ', 9, false);
        this.createBind('KeyX', 10, false);
        this.createBind('KeyC', 11, false);
        this.createBind('KeyV', 12, false);
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

    startBeep = (note = 0) => {
        return instrument.play_note(note); // plays A4 (440Hz)
        // integer step is one step
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