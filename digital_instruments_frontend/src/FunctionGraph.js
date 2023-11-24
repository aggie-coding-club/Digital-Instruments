import React from 'react';


class FunctionGraph extends React.Component {
    constructor(props) {
        super(props)
        this.canvas = React.createRef();
    }

    getPoint(x) {
        let multipliers = this.props.multipliers;
        let y = 0;
        for (let i = 0; i < multipliers.length; i++) {
            y += multipliers[i] * Math.sin(x * (i + 1));
        }
        return -y * (this.canvas.current.height / 2) / multipliers.reduce((a, b) => a + b);
    }

    updateGraph() {
        let ctx = this.canvas.current.getContext("2d");
        ctx.lineWidth = 1;
        let h = this.canvas.current.height;    
        let w = this.canvas.current.width;
        let ch = h / 2; 
        ctx.clearRect(0, 0, w, h);


        for(let x = 0; x < w; x += 0.01) {
            ctx.beginPath();
            let realX = x * 2 * Math.PI / w;
            let realNextX = (x + 0.01) * 2 * Math.PI / w;
            ctx.moveTo(x, this.getPoint(realX) + ch);
            ctx.lineTo(x + 0.1, this.getPoint(realNextX) + ch);
            ctx.stroke();
        }
    }

    componentDidMount() {
        this.updateGraph();
    }

    componentDidUpdate() {
        this.updateGraph();
    }

    render() {
        return (
            <canvas width={500} height={500} style={{'width': '100%'}} ref={this.canvas}/>
            );
    }
} export default FunctionGraph;