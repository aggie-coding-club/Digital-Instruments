import React from "react";
import {Slider, Button} from "@nextui-org/react";
import FunctionGraph from "./FunctionGraph";

class InstrumentMaker extends React.Component {
    constructor() {
        super()

        this.state = {multipliers: [0.5]};
    }

    setMultiplier(index, value) {
        let multipliers = this.state.multipliers;
        multipliers[index] = value;
        this.setState({...this.state, multipliers: multipliers});
    }

    addMultiplier() {
        this.setMultiplier(this.state.multipliers.length, 0.5);
    }

    render() {
        return (
            <div>
            {this.state.multipliers.map((multiplier, index) => {
                return (<Slider 
                label={"Amplitude " + index}
                
  
  
                step={0.01} 
                maxValue={1} 
                minValue={0} 
                defaultValue={0.5}
                key={index}
                className="max-w-md"
                onChange={value => this.setMultiplier(index, value)}
              />);
            })}
            <Button
            radius="full" className="bg-gradient-to-tr from-pink-500 to-yellow-500 text-white shadow-lg"
            onClick={() => this.addMultiplier()}
            >
            New
            </Button>
            <FunctionGraph multipliers={this.state.multipliers}/>
            </div>
          );
    }
} export default InstrumentMaker;