const MIN_X = 0;
const MAX_X = 0.25;
const MIN_Y = 0;
const MAX_Y = 1;
const SUSTAIN_MARGIN = 0.01;

// https://github.com/chrispahm/chartjs-plugin-dragdata
var options = {
    data: {
        datasets: [
            {
                type: "scatter",
                label: "Attack/Decay data",
                data: [
                    {
                        x: MIN_X,
                        y: MIN_Y,
                    },
                    {
                        x: 0.01,
                        y: MAX_Y,
                    },
                    {
                        x: 0.03,
                        y: 0.5,
                    },
                ],
                backgroundColor: "rgba(255, 99, 132, 1)",
                borderWidth: 2.5,
                fill: false,
                pointRadius: 7.5,
                hoverRadius: 10,
                pointHitRadius: 25,
                showLine: true,
            },
            {
                type: "scatter",
                label: "Release data",
                data: [
                    {
                        x: 0.08,
                        y: 0.5,
                    },
                    {
                        x: MAX_X,
                        y: MIN_X,
                    },
                ],
                backgroundColor: "rgba(255, 99, 132, 1)",
                borderWidth: 2.5,
                fill: false,
                pointRadius: 7.5,
                hoverRadius: 10,
                pointHitRadius: 25,
                showLine: true,
            },
            {
                type: "scatter",
                label: "Sustain line",
                data: [
                    {
                        x: 0.03,
                        y: 0.5,
                    },
                    {
                        x: 0.08,
                        y: 0.5,
                    },
                ],
                backgroundColor: "rgba(255, 99, 132, 1)",
                borderWidth: 5,
                borderDash: [10, 10],
                pointRadius: 0,
                hoverRadius: 0,
                dragData: false,
                showLine: true,
            },
        ],
    },
    options: {
        layout: {
            padding: {
                left: 20,
                right: 20,
                top: 20,
                bottom: 10,
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                max: MAX_Y + 0.012,
            },
            x: {
                beginAtZero: true,
                max: MAX_X + 0.0006,
            },
        },
        plugins: {
            tooltip: {
                enabled: false,
            },
            title: {
                display: true,
                text: "Volume graph",
                font: {
                    size: 20,
                },
            },
            subtitle: {
                display: true,
                text: "Drag the points around to set the volume graph of each note",
            },
            legend: {
                display: false,
            },
            dragData: {
                showTooltip: true,
                dragX: true,
                onDragStart: function (e, datasetIndex, index, value) {
                    // first point not draggable
                    if (datasetIndex === 0 && index === 0) {
                        return false;
                    }
                    // last point not draggable
                    if (
                        datasetIndex === 1 &&
                        index ===
                            chart.data.datasets[datasetIndex].data.length - 1
                    ) {
                        return false;
                    }
                    // sustain line not draggable
                    if (datasetIndex === 2) {
                        return false;
                    }
                },
                onDrag: function (e, datasetIndex, index, value) {
                    // first point not draggable
                    if (datasetIndex === 0 && index === 0) {
                        return false;
                    }
                    // last point not draggable
                    if (
                        datasetIndex === 1 &&
                        index ===
                            chart.data.datasets[datasetIndex].data.length - 1
                    ) {
                        return false;
                    }
                    // sustain line not draggable
                    if (datasetIndex === 2) {
                        return false;
                    }

                    // fix max and min values
                    if (value.x < MIN_X) {
                        value.x = MIN_X;
                    }
                    if (value.x > MAX_X) {
                        value.x = MAX_X;
                    }
                    if (value.y < MIN_Y) {
                        value.y = MIN_Y;
                    }
                    if (value.y > MAX_Y) {
                        value.y = MAX_Y;
                    }

                    // prevent crossing previous point
                    if (
                        index > 0 &&
                        value.x <
                            chart.data.datasets[datasetIndex].data[index - 1].x
                    ) {
                        value.x =
                            chart.data.datasets[datasetIndex].data[index - 1].x;
                    }

                    // prevent crossing next point
                    if (
                        index <
                            chart.data.datasets[datasetIndex].data.length - 1 &&
                        value.x >
                            chart.data.datasets[datasetIndex].data[index + 1].x
                    ) {
                        value.x =
                            chart.data.datasets[datasetIndex].data[index + 1].x;
                    }

                    // fix sustain points
                    if (datasetIndex === 0 && index === 2) {
                        let releasePoint = chart.data.datasets[1].data[0];
                        releasePoint.y = value.y;
                    } else if (datasetIndex === 1 && index === 0) {
                        let attackPoint = chart.data.datasets[0].data[2];
                        attackPoint.y = value.y;
                    }

                    // prevent crossing sustain line
                    if (
                        datasetIndex === 0 &&
                        index === 2 &&
                        value.x >
                            chart.data.datasets[1].data[0].x - SUSTAIN_MARGIN
                    ) {
                        value.x =
                            chart.data.datasets[1].data[0].x - SUSTAIN_MARGIN;
                    }

                    if (
                        datasetIndex === 1 &&
                        index === 0 &&
                        value.x <
                            chart.data.datasets[0].data[2].x + SUSTAIN_MARGIN
                    ) {
                        value.x =
                            chart.data.datasets[0].data[2].x + SUSTAIN_MARGIN;
                    }

                    // fix sustain line, must be after everything else
                    let sustainStartPoint = chart.data.datasets[2].data[0];
                    let sustainEndPoint = chart.data.datasets[2].data[1];
                    sustainStartPoint.x = chart.data.datasets[0].data[2].x;
                    sustainStartPoint.y = chart.data.datasets[0].data[2].y;

                    sustainEndPoint.x = chart.data.datasets[1].data[0].x;
                    sustainEndPoint.y = chart.data.datasets[1].data[0].y;
                },
                onDragEnd: function (e, datasetIndex, index, value) {
                    let canvas = document.getElementById("volumeGraph");

                    let attackSeconds = chart.data.datasets[0].data[1].x;
                    let attackAmplitude = chart.data.datasets[0].data[1].y;
                    let decaySeconds =
                        chart.data.datasets[0].data[2].x - attackSeconds;
                    let sustainAmplitude = chart.data.datasets[0].data[2].y;
                    let releaseSeconds =
                        chart.data.datasets[1].data[1].x -
                        chart.data.datasets[1].data[0].x;

                    canvas["volumeData"] = [
                        attackSeconds,
                        attackAmplitude,
                        decaySeconds,
                        sustainAmplitude,
                        releaseSeconds,
                    ];
                },
            },
        },
    },
};
const canvas = document.getElementById("volumeGraph");
canvas["volumeData"] = [0.01, 1, 0.02, 0.3, 0.2];
const ctx = document.getElementById("volumeGraph").getContext("2d");

const chart = new Chart(ctx, options);
