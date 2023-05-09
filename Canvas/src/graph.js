// import { Chart, Point } from 'chart.js'
// export function drawGraph(canvas: HTMLCanvasElement) {
//     const chart = new Chart(canvas, {
//         type: 'line',
//         data: {
//             labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
//             datasets: [{
//                 label: '# of Votes',
//                 data: [30, 90, 60, 80, 20, 70, 50],
//             }]
//         }
//     });    
// }
export function drawGraph(_canvas) {
    const chart = new Chart(_canvas, {
        type: 'line',
        data: {
            labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
            datasets: [{
                    label: 'rainfall',
                    data: [30, 90, 60, 80, 20, 70, 50],
                }]
        }
    });
}
export function drawYearAverageGraph(_canvas, _dataLabels, _data, _typeLabel) {
    const chart = new Chart(_canvas, {
        type: 'line',
        data: {
            labels: _dataLabels,
            datasets: [{
                    label: _typeLabel,
                    data: _data
                }]
        }
    });
}
//# sourceMappingURL=graph.js.map