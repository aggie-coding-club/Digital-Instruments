import React, { useEffect } from "react";

function VolumeGraph() {
    useEffect(() => {
        let chartjs = document.createElement("script");
        chartjs.src =
            "https://cdnjs.cloudflare.com/ajax/libs/Chart.js/3.6.0/chart.min.js";
        chartjs.async = true;

        let chartjsDrag = document.createElement("script");
        chartjsDrag.src =
            "https://cdn.jsdelivr.net/npm/chartjs-plugin-dragdata@2.2.3/dist/chartjs-plugin-dragdata.min.js";
        chartjsDrag.async = true;

        let volumeChart = document.createElement("script");
        volumeChart.src = "/volumeChart.js";
        volumeChart.async = true;

        document.body.appendChild(chartjs);
        // need delay because the script tags somehow cant be loaded at the same time (?)
        setTimeout(() => {
            document.body.appendChild(chartjsDrag);
            setTimeout(() => {
                document.body.appendChild(volumeChart);
            }, 10);
        }, 10);

        return () => {
            document.body.removeChild(chartjs);
            document.body.removeChild(chartjsDrag);
            document.body.removeChild(volumeChart);
        };
    }, []);

    return (
        <>
            <canvas id="volumeGraph"></canvas>
        </>
    );
}

export default VolumeGraph;
