"use strict";

var importCsvFile = require('./toolkit/importCsvFile');

var inputFilePath = "./data/weather-stations-2016.csv";

//
// Get the minimum value from an array of values.
//
function min (values) {
    return values.reduce((prev, cur) => Math.min(prev, cur), Number.MAX_VALUE);
}

//
// Get the maximum value from an array of values.
//
function max (values) {
    return values.reduce((prev, cur) => Math.max(prev, cur), Number.MIN_VALUE);
}

importCsvFile(inputFilePath)
    .then(data => {
        var minDailyTemperatures = data.map(row => row.MinTemp);
        var maxDailyTemperatures = data.map(row => row.MaxTemp);
        var minYearlyTemp = min(minDailyTemperatures);
        var maxYearlyTemp = max(maxDailyTemperatures);
        console.log("Min: " + minYearlyTemp);
        console.log("Max: " + maxYearlyTemp);
        console.log("Range: " + minYearlyTemp + " to " + maxYearlyTemp);
    })
    .catch(err => {
        console.error(err);
    });

