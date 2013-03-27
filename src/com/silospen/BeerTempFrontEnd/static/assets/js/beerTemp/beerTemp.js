(function ($, undef) {

    function populateGraph(temperatureEvents) {

        var tempDataSeries = {};
        var elementDataSeries = {'yaxis': 2, 'label': 'Heater', 'data': []};
        for (var i = 0; i < temperatureEvents.length; i++) {
            var sensorId = temperatureEvents[i]['sensorId'];
            if (tempDataSeries[sensorId] === undef) {
                tempDataSeries[sensorId] = {'label': sensorId, 'data': []};
            }
            tempDataSeries[sensorId]['data'].push([temperatureEvents[i]['time'] * 1000, temperatureEvents[i]['temp']]);
            elementDataSeries['data'].push([temperatureEvents[i]['time'] * 1000, temperatureEvents[i]['active']]);
        }

        var plottableData = [];
        for (var series in tempDataSeries) {
            if (tempDataSeries.hasOwnProperty(series)) {
                plottableData.push(tempDataSeries[series]);
            }
        }
        plottableData.push(elementDataSeries);

        $.plot("#graph", plottableData, {
            xaxis: { mode: "time", timeformat: "%m/%d %H:%M" },
            yaxes: [
                { position: 'left' },
                { position: 'right', minTickSize: 1, max: 1 }
            ]
        });
    }

    function getGraphDataAndPlot() {
        $.ajax({
            url: '/beerTemp',
            cache: false,
            type: 'GET',
            dataType: 'json',
            success: populateGraph
        });
    }

    getGraphDataAndPlot();

})(jQuery);