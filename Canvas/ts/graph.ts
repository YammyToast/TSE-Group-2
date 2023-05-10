


export function drawYearAverageGraph(_canvas: HTMLCanvasElement, _dataLabels: number[] | string[], _data: number[], _typeLabel: string) {
    const chart: Chart = new Chart(_canvas, {
        type: 'line',
        data: {
            labels: _dataLabels,
            datasets: [{
                label: _typeLabel,
                data: _data,
                borderColor: '#FAB162'
            }]
        },
        options: {
            responsive: true,
            aspectRatio: 4
        }

    })
}
