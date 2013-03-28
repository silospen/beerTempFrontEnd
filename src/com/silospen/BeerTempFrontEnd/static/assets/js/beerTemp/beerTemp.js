(function ($, undef) {

    function startAndEndForGrid(elementDataSeries) {
        var markings = [];
        var currentStartTime;
        for (var j = 0; j < elementDataSeries['data'].length; j++) {
            if (elementDataSeries['data'][j][1] && j != elementDataSeries['data'].length - 1) {
                if (!currentStartTime)currentStartTime = elementDataSeries['data'][j][0];
            } else {
                if (currentStartTime) {
                    //noinspection JSUnusedAssignment
                    markings.push({
                        color: "#fee",
                        xaxis: {
                            from: currentStartTime,
                            to: elementDataSeries['data'][j][0]
                        }
                    });
                    currentStartTime = undef;
                }
            }
        }
        return markings;
    }

    function populateGraph(temperatureEvents) {
        var tempDataSeries = {};
        var elementDataSeries = {'yaxis': 2, 'label': 'Heater', 'data': []};
        var firstSensor;
        for (var i = 0; i < temperatureEvents.length; i++) {
            var sensorId = temperatureEvents[i]['sensorId'];
            if (firstSensor === undef) firstSensor = sensorId;
            if (tempDataSeries[sensorId] === undef) tempDataSeries[sensorId] = {'label': sensorId, 'data': []};
            tempDataSeries[sensorId]['data'].push([temperatureEvents[i]['time'] * 1000, temperatureEvents[i]['temp']]);
            if (sensorId == firstSensor) elementDataSeries['data'].push([temperatureEvents[i]['time'] * 1000, temperatureEvents[i]['active']]);
        }

        var plottableData = [];
        for (var series in tempDataSeries) {
            if (tempDataSeries.hasOwnProperty(series)) {
                plottableData.push(tempDataSeries[series]);
            }
        }

        $.plot("#graph", plottableData, {
            xaxis: { mode: "time", timeformat: "%m/%d %H:%M" },
            yaxes: [
                { position: 'left' },
                { position: 'right', minTickSize: 1, max: 1 }
            ],
            grid: {
                markings: startAndEndForGrid(elementDataSeries)
            }
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
        setTimeout(function () {
            getGraphDataAndPlot()
        }, 20000);
    }

    getGraphDataAndPlot();

})(jQuery);