import React from "react";
import {Slider, Button, Card, Select, SelectItem, Divider} from "@nextui-org/react";
import FunctionGraph from "./FunctionGraph";
import VolumeGraph from "./VolumeGraph";
import {Input} from "@nextui-org/react";
import {addInstrument} from './InstrumentLibrary';
import {Delete} from 'react-iconly'

class InstrumentMaker extends React.Component {
    constructor() {
        super()

        this.state = {multipliers: [0.5, 0.5], keyBinds: [], name: "", description: "", imageUrl: ""};
    }

    setMultiplier(index, value) {
        let multipliers = this.state.multipliers;
        multipliers[index] = value;
        this.setState({...this.state, multipliers: multipliers});
    }

    addMultiplier() {
        this.setMultiplier(this.state.multipliers.length, 0.5);
    }

    removeMultiplier() {
        let multipliers = this.state.multipliers;
        if(multipliers.length === 1) return;
        multipliers.pop();
        this.setState({...this.state, multipliers: multipliers});
    }

    createInstrument() {
        let amplitudeValues = document.getElementById('volumeGraph').amplitudeValues;

        let instrument =  {
            title: this.state.name,
            img: this.state.imageUrl,
            description: this.state.description,
            instrumentSound: {
                overtoneRelativeAmplitudes: this.state.multipliers,
                amplitudeValues: [1, ...amplitudeValues],
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

    removeKeybind = (index) => {
        let keyBinds = this.state.keyBinds;
        keyBinds.splice(index, 1);
        this.setState({...this.state, keyBinds: keyBinds});
    }

    setValue = (bindIndex, note) => {
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
        if(type === 'volume') {
            keyBinds[bindIndex].value = 1;
        } else if(type === 'frequency') {
            keyBinds[bindIndex].value = 0;
        }
        this.setState({...this.state, keyBinds: keyBinds});
    }

    buildKeyListener(index) {
        return (e) => {
            let keyBinds = this.state.keyBinds;
            keyBinds[index].action = e.code;
            this.setState({...this.state, keyBinds: keyBinds});
        }
    }

    addKeyListener = (index) => {
        document.addEventListener('keydown', this.buildKeyListener(index), {once: true});
    }

    render() {
        let notes = ['A1', 'A#1', 'B1', 'C2', 'C#2', 'D2', 'D#2', 'E2', 'F2', 'F#2', 'G2', 'G#2',
        'A2', 'A#2', 'B2', 'C3', 'C#3', 'D3', 'D#3', 'E3', 'F3', 'F#3', 'G3', 'G#3',
        'A3', 'A#3', 'B3', 'C4', 'C#4', 'D4', 'D#4', 'E4', 'F4', 'F#4', 'G4', 'G#4',
        'A4', 'A#4', 'B4', 'C5', 'C#5', 'D5', 'D#5', 'E5', 'F5', 'F#5', 'G5', 'G#5',
        'A5', 'A#5', 'B5', 'C6', 'C#6', 'D6', 'D#6', 'E6', 'F6', 'F#6', 'G6', 'G#6'];
        return (
            <Card className="h-full flex flex-col">
                <div className="overflow-y-scroll p-4">
                <h2 className="text-center text-xl m-4">Instrument Information</h2>
                    <Input className="p-1" placeholder="Instrument Name" onChange={(e) => this.setState({...this.state, name: e.target.value})}></Input>
                    <Input className="p-1" placeholder="Description" onChange={(e) => this.setState({...this.state, description: e.target.value})}></Input>
                    <Input className="p-1" placeholder="Image URL" onChange={(e) => this.setState({...this.state, imageUrl: e.target.value})}></Input>
                    <Divider/>
                    <h2 className="text-center text-xl m-4">Sound Waveform</h2>
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
                            <Button
                            className="shadow-lg"
                            onClick={() => this.removeMultiplier()}
                            >
                            Remove Amplitude
                            </Button>
                        </div>
                        <div><FunctionGraph multipliers={this.state.multipliers}/></div>
                    </div>
                    <Divider/>
                    <h2 className="text-center text-xl mt-4">Volume Graph</h2>
                    <div className="text-center">
                        <VolumeGraph/>
                    </div>
                    <Divider/>
                    <div>
                        <h2 className="text-center text-xl m-4">Keybinds</h2>
                        {this.state.keyBinds.map((bind, index) => {
                            let type = this.state.keyBinds[index].type;
                            let action = this.state.keyBinds[index].action;
                            let showNoteSelector = type === 'note' || type === 'toggleNote' ? '': 'hidden';
                            let showVolumeSlider = type === 'volume' ? '': 'hidden';
                            let showFrequencySlider = type === 'frequency' ? '': 'hidden';
                            return (
                            <div key={index} className="content-start flex items-stretch">
                            <Button className="h-14" onClick={() => {this.addKeyListener(index)}}>{action === '' ? 'Click and Press Key' : action}</Button>
                            <Select className="w-64" label='Bind Type' placeholder="Select a Type" onChange={e => this.setType(index, e.target.value)}>
                                <SelectItem key="note">Play Note</SelectItem>
                                <SelectItem key="toggleNote">Toggle Note</SelectItem>
                                <SelectItem key="volume">Set Volume</SelectItem>
                                <SelectItem key="frequency">Bend Frequency</SelectItem>
                            </Select>
                            <Select className={"w-32 " + showNoteSelector} label='Note' placeholder="Select a Note" onChange={e => this.setValue(index, e.target.value)}>
                                {notes.map(note => <SelectItem key={note}>{note}</SelectItem>)}
                            </Select>
                            <Slider 
                                label="Frequency Bend"
                                className={'w-48 ' + showFrequencySlider}
                                color="warning"
                                getValue={(value) => {
                                    let sign = value >= 0 ? '+' : '-';
                                    return `${sign} ${Math.abs(value)}x`
                                }}
                                step={0.01} 
                                maxValue={0.2} 
                                minValue={-0.2} 
                                formatOptions={{signDisplay: 'always'}}
                                defaultValue={0}
                                onChange={value => this.setValue(index, value)}
                                fillOffset={0}
                            />
                            <Slider 
                                label="Volume"
                                className={'w-48 ' + showVolumeSlider}
                                step={0.01} 
                                maxValue={1} 
                                minValue={0} 
                                defaultValue={1}
                                onChange={value => this.setValue(index, value)}
                            />
                            <Button className="hover:bg-red-500 h-14" onClick={() => this.removeKeybind(index)}><Delete></Delete></Button>
                            </div>
                            )
                        })}
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