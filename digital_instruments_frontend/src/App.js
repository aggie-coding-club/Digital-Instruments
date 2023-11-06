import React, {Component} from 'react';
import {NextUIProvider} from "@nextui-org/react";
import './App.css';
import Instrument from './Instrument';
import InstrumentCard from './InstrumentCard';
import Graph from './Graph';

class App extends Component {
  render() {

    return (
      <NextUIProvider>
        <Graph/>
        <Instrument/>
        <InstrumentCard name="Instrument Name" description="This is the description"/>
      </NextUIProvider>
    );
  }
}
export default App;