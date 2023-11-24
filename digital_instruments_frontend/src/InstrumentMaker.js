import React from "react";
import {Slider, Button, Card} from "@nextui-org/react";
import FunctionGraph from "./FunctionGraph";
import {Input} from "@nextui-org/react";
import {addInstrument} from './InstrumentLibrary';

class InstrumentMaker extends React.Component {
    constructor() {
        super()

        this.state = {multipliers: [0.5, 0.5], name: 'Instrument'};
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
        }

        addInstrument(instrument);
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
                        radius="full" className="bg-gradient-to-tr from-pink-500 to-yellow-500 text-white shadow-lg"
                        onClick={() => this.addMultiplier()}
                        >
                        Add Amplitude
                        </Button>
                    </div>
                    <div><FunctionGraph multipliers={this.state.multipliers}/></div>
                </div>
                </div>
                <Button
                radius="full" className="bg-gradient-to-tr from-pink-500 to-yellow-500 text-white shadow-lg bottom-0 mt-auto"
                onClick={() => this.createInstrument()}
                >
                Create Instrument
                </Button>
            </Card>
          );
    }
} export default InstrumentMaker;