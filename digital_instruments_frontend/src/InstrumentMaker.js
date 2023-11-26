import React from "react";
import {Slider, Button, Card, Select, SelectItem} from "@nextui-org/react";
import FunctionGraph from "./FunctionGraph";
import {Input} from "@nextui-org/react";
import {addInstrument} from './InstrumentLibrary';

class InstrumentMaker extends React.Component {
    constructor() {
        super()

        this.state = {multipliers: [0.5, 0.5], keyBinds: []};
    }

    setMultiplier(index, value) {
        let multipliers = this.state.multipliers;
        multipliers[index] = value;
        this.setState({...this.state, multipliers: multipliers});
    }

    addMultiplier() {
        this.setMultiplier(this.state.multipliers.length, 0.5);
    }

    createInstrument() {
        let instrument =  {
            title: this.state.name,
            img: this.state.imageUrl,
            description: this.state.description,
            instrumentSound: {
                overtoneRelativeAmplitudes: this.state.multipliers,
                amplitudeValues: [1, 0.01, 1, 0.02, 0.3, 0.2],
            },
            binds: this.state.keyBinds,
        }

        addInstrument(instrument);
    }

    addKeybind = () => {
        let keyBinds = this.state.keyBinds;
        keyBinds.push({action: '', type: '', value: ''});
        this.setState({...this.state, keyBinds: keyBinds});
    }

    setNote = (bindIndex, note) => {
        let keyBinds = this.state.keyBinds;
        keyBinds[bindIndex].value = note;
        this.setState({...this.state, keyBinds: keyBinds});
    }

    setKey = (bindIndex, key) => {
        let keyBinds = this.state.keyBinds;
        keyBinds[bindIndex].action = key;
        this.setState({...this.state, keyBinds: keyBinds});
    }

    setType = (bindIndex, type) => {
        let keyBinds = this.state.keyBinds;
        keyBinds[bindIndex].type = type;
        this.setState({...this.state, keyBinds: keyBinds});
    }

    render() {
        return (
            <Card className="h-full flex flex-col">
                <div className="overflow-y-scroll">
                    <Input className="p-1" placeholder="Instrument Name" onChange={(e) => this.setState({...this.state, name: e.target.value})}></Input>
                    <Input className="p-1" placeholder="Description" onChange={(e) => this.setState({...this.state, description: e.target.value})}></Input>
                    <Input className="p-1" placeholder="Image URL" onChange={(e) => this.setState({...this.state, imageUrl: e.target.value})}></Input>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            {this.state.multipliers.map((multiplier, index) => {
                                return (<Slider 
                                label={"Amplitude " + index}
                                step={0.01} 
                                maxValue={1} 
                                minValue={0} 
                                defaultValue={0.5}
                                key={index}
                                onChange={value => this.setMultiplier(index, value)}
                            />);
                            })}
                            <Button
                            className="shadow-lg"
                            onClick={() => this.addMultiplier()}
                            >
                            Add Amplitude
                            </Button>
                        </div>
                        <div><FunctionGraph multipliers={this.state.multipliers}/></div>
                    </div>
                    <div>
                    <div>
                    {this.state.keyBinds.map((bind, index) => {
                        let keys = ["KeyA", "KeyB", "KeyC", "KeyD", "KeyE", "KeyF", "KeyG", "KeyH", "KeyI", "KeyJ", "KeyK",
                            "KeyL", "KeyM", "KeyN", "KeyO", "KeyP", "KeyQ", "KeyR", "KeyS", "KeyT", "KeyU", "KeyV", "KeyW",
                            "KeyX", "KeyY", "KeyZ", "Digit0", "Digit1", "Digit2", "Digit3", "Digit4", "Digit5", "Digit6", "Digit7",
                            "Digit8", "Digit9"]
                        let notes = ['A2', 'A#2', 'B2', 'C2', 'C#2', 'D2', 'D#2', 'E2', 'F2', 'F#2', 'G2', 'G#2',
                                     'A3', 'A#3', 'B3', 'C3', 'C#3', 'D3', 'D#3', 'E3', 'F3', 'F#3', 'G3', 'G#3',
                                     'A4', 'A#4', 'B4', 'C4', 'C#4', 'D4', 'D#4', 'E4', 'F4', 'F#4', 'G4', 'G#4'];

                        
                        notes = notes.map(note => {
                            return {
                                label: note,
                                value: note,
                                description: 'Just another note.'
                            }
                        });
                        return (
                        <div key={index} className="content-start">
                        <Select className="w-32" label='Key' placeholder="Select a Key" onChange={e => this.setKey(index, e.target.value)}>
                            {keys.map(code => (<SelectItem key={code}>{code}</SelectItem>))}
                        </Select>
                        <Select className="w-64" label='Bind Type' placeholder="Select a Type" onChange={e => this.setType(index, e.target.value)}>
                            <SelectItem key="note">Play Note</SelectItem>
                            <SelectItem key="toggleNote">Toggle Note</SelectItem>
                        </Select>
                        <Select className="w-32" items={notes} label='Note' placeholder="Select a Note" onChange={e => this.setNote(index, e.target.value)}>
                            {(note) => <SelectItem key={note.value}>{note.label}</SelectItem>}
                        </Select>
                        </div>
                        )
                    })}
                    </div>
                        <Button onClick={this.addKeybind}>Add Keybind</Button>
                    </div>
                </div>
                <Button
                className="bg-blue-500 text-white shadow-lg bottom-0 mt-auto"
                onClick={() => this.createInstrument()}
                >
                Create Instrument
                </Button>
                <Button
                className="bg-red-500 text-white shadow-lg bottom-0 mt-auto"
                onClick={() => this.props.exitCallback()}
                >
                Cancel
                </Button>
            </Card>
          );
    }
} export default InstrumentMaker;