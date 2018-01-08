"use strict";

var importCsvFile = require('./toolkit/importCsvFile');

var inputFilePath = "./data/weather-stations-2016.csv";

//
// Get the sum of values.
//
function sum (values) {
    return values.reduce((prev, cur) => prev + cur, 0);
}

//
// Get the average of values.
//
function average (values) {
    return sum(values) / values.length;
}

function std (values) {
    var avg = average(values);
    var squaredDiffsFromAvg = values
        .map(v => v - avg)
        .map(v => v * v);
    var avgDiff = average(squaredDiffsFromAvg);
    return Math.sqrt(avgDiff);
}

importCsvFile(inputFilePath)
    .then(data => {
        var dailyRainfall = data.map(row => row.Precipitation);
        var dailyRainfallStdDeviation = std(dailyRainfall);
        console.log("Daily rainfall standard deviation: " + dailyRainfallStdDeviation + "mm");
    })
    .catch(err => {
        console.error(err);
    });

