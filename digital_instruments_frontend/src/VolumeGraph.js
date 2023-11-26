import React, { useEffect } from "react";

function VolumeGraph(props) {
    useEffect(() => {
        let chartjs = document.createElement("script");
        chartjs.src =
            "https://cdnjs.cloudflare.com/ajax/libs/Chart.js/3.6.0/chart.min.js";
        chartjs.async = false;
        chartjs.id = "chartjs-script";

        let chartjsDrag = document.createElement("script");
        chartjsDrag.src =
            "https://cdn.jsdelivr.net/npm/chartjs-plugin-dragdata@2.2.3/dist/chartjs-plugin-dragdata.min.js";
        chartjsDrag.async = false;
        chartjsDrag.id = "chartjs-drag-script";

        let volumeGraph = document.createElement("script");
        volumeGraph.src = "/volumeGraph.js";
        volumeGraph.async = false;
        volumeGraph.id = "volumeGraph-script";

        if (
            !document.body.contains(document.getElementById("chartjs-script"))
        ) {
            document.body.appendChild(chartjs);
            setTimeout(() => {
                if (
                    !document.body.contains(
                        document.getElementById("chartjs-drag-script")
                    )
                ) {
                    document.body.appendChild(chartjsDrag);
                }
                setTimeout(() => {
                    if (
                        !document.body.contains(
                            document.getElementById("volumeGraph-script")
                        )
                    ) {
                        document.body.appendChild(volumeGraph);
                    }
                }, 10);
            }, 10);
        }

        return () => {
        };
    }, []);

    return <canvas id="volumeGraph"></canvas>;
}

export default VolumeGraph;
