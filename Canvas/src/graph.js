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
                    label: '# of Votes',
                    data: [30, 90, 60, 80, 20, 70, 50],
                }]
        }
    });
}
//# sourceMappingURL=graph.js.map