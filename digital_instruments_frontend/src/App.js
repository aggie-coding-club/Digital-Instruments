import React, {Component} from 'react';
import {NextUIProvider} from "@nextui-org/react";
import './App.css';
import InstrumentCards from './InstrumentCards';


class App extends Component {
  render() {
    return (
      <NextUIProvider>
        <InstrumentCards name="Instrument Name" description="This is the description"/>
      </NextUIProvider>
    );
  }
}
export default App;