var options = {
    // IMPORTANT - You need a chart of type "scatter"
    // in order to drag a line chart along the x axis
    type: "scatter",
    data: {
        datasets: [
            {
                label: "Instrument",
                data: [
                    {
                        x: 0, y: 0
                    },
                    {
                        x: 0.01, y: 1
                    },
                    {
                        x: 0.03, y: 0.5
                    },
                    {
                        x: 0.08, y: 0.5
                    },
                    {
                        x: 0.1, y: 0
                    }
                ],
                backgroundColor: "rgba(255, 99, 132, 1)",
                borderWidth: 2.5,
                fill: false,
                pointRadius: 10,
                pointHitRadius: 25,
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
                max: 1.0,
            },
            x: {
                beginAtZero: true,
                max: 0.1,
            }
        },
        plugins: {
            dragData: {
                showTooltip: true,
                dragX: true,
                onDrag: function (e, datasetIndex, index, value) {
                },
                onDragEnd: function (e, datasetIndex, index, value) {
                    console.log(chart.data.datasets[datasetIndex].data[index]);
                    console.log(e, datasetIndex, index, value);
                    let canvas = document.getElementById("chartcontainer");
                    canvas['data-last'] = value;
                    console.log(canvas);
                }
            },
        },
    },
};
const ctx = document.getElementById("chartcontainer").getContext("2d");
const chart = new Chart(ctx, options);
