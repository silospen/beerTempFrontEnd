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

    function populateGraph(temperatureEventsString) {
        var temperatureEventsSplit = temperatureEventsString.split('\n');
        var tempDataSeries = {};
        var elementData = [];
        var firstSensor;
        var currentTime = Date.now() / 1000;
        var hoursToLookback = $('#lookback').val() * 24 * 3600;
        for (var i = 0; i < temperatureEventsSplit.length; i++) {
            if (temperatureEventsSplit[i] === "") continue;
            var jsonTemperatureEvent = JSON.parse(temperatureEventsSplit[i]);
            if (jsonTemperatureEvent['time'] < currentTime - hoursToLookback) continue;
            var sensorId = jsonTemperatureEvent['sensorId'];
            if (firstSensor === undef) firstSensor = sensorId;
            if (tempDataSeries[sensorId] === undef) tempDataSeries[sensorId] = {'label': sensorId, 'data': []};
            tempDataSeries[sensorId]['data'].push([jsonTemperatureEvent['time'] * 1000, jsonTemperatureEvent['temp']]);
            if (sensorId == firstSensor) elementData.push([jsonTemperatureEvent['time'] * 1000, jsonTemperatureEvent['active']]);
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
                markings: startAndEndForGrid(elementData),
                hoverable: true
            },
            legend: {show: false},
            tooltip: true
        });
    }

    function getGraphDataAndPlot() {
        $.ajax({
            url: '/log.json',
            cache: false,
            type: 'GET',
            dataType: 'text',
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

    $('#lookbackForm').submit(processForm);
    getGraphDataAndPlot();

})(jQuery);