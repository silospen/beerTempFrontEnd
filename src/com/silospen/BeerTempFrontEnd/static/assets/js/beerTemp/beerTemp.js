(function ($, undef) {


    function startAndEndForGrid(elementDataSeries) {
        var markings = [];
        var currentStartTime = undef;
        for (var j = 0; j < elementDataSeries.length; j++) {
            if (elementDataSeries[j][1] && j != elementDataSeries.length - 1) {
                if (!currentStartTime)currentStartTime = elementDataSeries[j][0];
            } else {
                if (currentStartTime) {
                    markings.push({
                        color: "#fee",
                        xaxis: {
                            from: currentStartTime,
                            to: elementDataSeries[j][0]
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
        var elementData = [];
        var firstSensor;
        var currentTime = Date.now()/1000;
        var hoursToLookback = $('#lookback').val() * 24 * 3600;
        for (var i = 0; i < temperatureEvents.length; i++) {
            if (temperatureEvents[i]['time'] < currentTime - hoursToLookback) continue;
            var sensorId = temperatureEvents[i]['sensorId'];
            if (firstSensor === undef) firstSensor = sensorId;
            if (tempDataSeries[sensorId] === undef) tempDataSeries[sensorId] = {'label': sensorId, 'data': []};
            tempDataSeries[sensorId]['data'].push([temperatureEvents[i]['time'] * 1000, temperatureEvents[i]['temp']]);
            if (sensorId == firstSensor) elementData.push([temperatureEvents[i]['time'] * 1000, temperatureEvents[i]['active']]);
        }

        var plottableData = [];
        for (var series in tempDataSeries) {
            if (tempDataSeries.hasOwnProperty(series)) {
                plottableData.push(tempDataSeries[series]);
            }
        }

        $.plot("#graph", plottableData, {
            xaxis: { mode: "time", timeformat: "%m/%d %H:%M" },
            grid: {
                markings: startAndEndForGrid(elementData)
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


    function processForm(e) {
        if (e.preventDefault) e.preventDefault();
        getGraphDataAndPlot();
    }

    var form = document.getElementById('lookbackForm');
    if (form.attachEvent) {
        form.attachEvent("submit", processForm);
    } else {
        form.addEventListener("submit", processForm);
    }

    getGraphDataAndPlot();

})(jQuery);