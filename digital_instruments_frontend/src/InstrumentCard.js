import React from "react";
import {Card, CardFooter, CardBody, Image} from "@nextui-org/react";
import InstrumentLibrary from "./InstrumentLibrary";
import Instrument from "./Instrument";

const list = InstrumentLibrary.list;

class InstrumentCard extends React.Component {
    render() {
        return (
            <div className="gap-2 grid grid-cols-2 sm:grid-cols-4">
            {Object.values(list).map((item, index) => (
                <Card shadow="sm" key={index} isPressable onPress={() => {
                    InstrumentLibrary.currentInstrument = item;
                    console.log(`Changed instrument to ${InstrumentLibrary.currentInstrument}`);
                }}>
                <CardBody className="overflow-visible p-0">
                    <Image
                    shadow="sm"
                    radius="lg"
                    width="100%"
                    alt={item.title}
                    className="w-full object-cover h-[240px]"
                    src={item.img}
                    />
                </CardBody>
                <CardFooter className="text-small justify-between">
                    <b>{item.title}</b>
                    <p className="text-default-500">{item.description}</p>
                </CardFooter>
                </Card>
            ))}
            </div>
        )
    }
} export default InstrumentCard;