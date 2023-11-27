import React, {Component} from 'react';
import {NextUIProvider} from "@nextui-org/react";
import './App.css';
import InstrumentCards from './InstrumentCards';


class App extends Component {
  render() {

    return (
      <NextUIProvider>
        <p className='font-mono text-4xl flex items-center justify-center p-5'>Digital Instruments</p>
        <InstrumentCards name="Instrument Name" description="This is the description"/>
      </NextUIProvider>
    );
  }
}
export default App;