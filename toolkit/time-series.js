"use strict";

//
// Various toolkit function for time series operations.
//

const statistics = require('./statistics.js');
const average = statistics.average;
const std = statistics.std;
const simpleStatistics = require('simple-statistics');
const dataForge = require('data-forge');

function rollingAverage (series, period) { // Compute the rolling average for a time series.
    return series
        .rollingWindow(period, window => { // Select the period of the average.
            return [
                window.getIndex().last(), // Return the last index from the period, this allows the new series to correctly line up with records in the dataframe.
                average(window.toArray()) // Compute the average for the time period.
            ];                
        });
};

function linearRegression (series, forecastIndexA, forecastIndexB) { // Compute a linear regression for a series and use it to produce a forecast.
    const regressionInput = series.toPairs(); // Extract index/value pairs of data.
    const regression = simpleStatistics.linearRegression(regressionInput); // Create the linear regression.
    const forecaster = simpleStatistics.linearRegressionLine(regression); // Create a forecaster that can predict future values for us.

    return new dataForge.Series({
        values: [forecaster(forecastIndexA), forecaster(forecastIndexB)],
        index: [forecastIndexA, forecastIndexB],
    });
};

function difference (seriesA, seriesB) { // Compute the divergence between two series.
    return seriesA.zip(seriesB, (valueA, valueB) => valueA - valueB);
};

module.exports = {
    rollingAverage: rollingAverage,
    linearRegression: linearRegression,
    difference: difference,
};