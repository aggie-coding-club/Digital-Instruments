import React, { useEffect } from "react";

function Graph() {
    useEffect(() => {
        let chartjs = document.createElement("script");
        chartjs.src =
            "https://cdnjs.cloudflare.com/ajax/libs/Chart.js/3.6.0/chart.min.js";
        chartjs.async = true;

        let chartjs_dragdata = document.createElement("script");
        chartjs_dragdata.src =
            "https://cdn.jsdelivr.net/npm/chartjs-plugin-dragdata@2.2.3/dist/chartjs-plugin-dragdata.min.js";
        chartjs_dragdata.async = true;

        let drawchart = document.createElement("script");
        drawchart.src = "/drawchart.js";
        drawchart.async = true;

        document.body.appendChild(chartjs);
        setTimeout(() => {
            document.body.appendChild(chartjs_dragdata);
            setTimeout(() => {
                document.body.appendChild(drawchart);
            }, 10);
        }, 10);

        return () => {
            document.body.removeChild(chartjs);
            document.body.removeChild(chartjs_dragdata);
            document.body.removeChild(drawchart);
        };
    }, []);

    return (
        <>
            <canvas id="chartcontainer"></canvas>
        </>
    );
}

export default Graph;
