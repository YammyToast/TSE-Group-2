export function drawYearAverageGraph(_canvas, _dataLabels, _data, _typeLabel) {
    const chart = new Chart(_canvas, {
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
    });
}
//# sourceMappingURL=graph.js.map