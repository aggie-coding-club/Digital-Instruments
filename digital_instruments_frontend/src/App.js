import React, {Component} from 'react';
import {NextUIProvider} from "@nextui-org/react";
import './App.css';
import Instrument from './Instrument';
import InstrumentCard from './InstrumentCard';
import InstrumentMaker from './InstrumentMaker';


class App extends Component {
  render() {
    return (
      <NextUIProvider>
        <Instrument/>
        <InstrumentCard name="Instrument Name" description="This is the description"/>
        <InstrumentMaker></InstrumentMaker>
      </NextUIProvider>
    );
  }
}
export default App;