import React from "react";
import {Card, CardFooter, CardBody, Image, CardHeader, Button} from "@nextui-org/react";
import {getInstrumentLibrary, addUpdateCallback, setCurrentInstrument, removeInstrument} from "./InstrumentLibrary";
import {Delete, Plus} from 'react-iconly'
import InstrumentMaker from "./InstrumentMaker";
import Instrument from "./Instrument";

const list = getInstrumentLibrary().list;

class InstrumentCards extends React.Component {
    constructor() {
        super();
        this.updateCallback = this.updateCallback.bind(this);
        this.state = {makerVisibility: 'invisible'}
    }

    updateCallback() {
        this.setState({makerVisibility: 'invisible'})
        this.forceUpdate();
    }

    componentDidMount() {
        addUpdateCallback(this.updateCallback);
    }
    render() {
        let instrumentEnabled = this.state.makerVisibility === 'invisible';
        return (
            <div>
            <Instrument enabled={instrumentEnabled}></Instrument>
            <div className="gap-2 grid grid-cols-2 sm:grid-cols-4">
            {Object.values(list).map((item, index) => (
                <Card shadow="sm" key={index}>
                <CardHeader className="text-large justify-between">
                <b>{item.title}</b>
                    <Button className="bg-transparent hover:bg-red-500" onClick={() => removeInstrument(item.title)}>
                    <Delete></Delete>
                    </Button>
                </CardHeader>
                <CardBody className="overflow-visible p-0">
                    <Button className="h-80" onClick={() => {
                        setCurrentInstrument(item);
                    }}>
                        <Image
                        shadow="sm"
                        radius="lg"
                        width="100%"
                        alt={item.title}
                        className="w-full object-cover h-[240px]"
                        src={item.img}
                        />
                    </Button>
                </CardBody>
                <CardFooter className="text-small justify-between">
                    <p className="text-default-500">{item.description}</p>
                </CardFooter>
                </Card>
            ))}
            <Card shadow="sm" isPressable onPress={() => {
                    // setCurrentInstrument(item);
                }}>
                <CardBody className="overflow-visible p-0" onClick={() => this.setState({makerVisibility: 'visible'})}>
                    <Plus className="flex-1 w-2/3 mx-auto p-4 text-lg bg-white h-full"></Plus>
                </CardBody>
            </Card>
            <div className={'fixed top-0 mx-auto inset-x-0 h-full z-10 max-w-5xl ' + this.state.makerVisibility}><InstrumentMaker></InstrumentMaker></div>
            </div>
            </div>
        )
    }
} export default InstrumentCards;