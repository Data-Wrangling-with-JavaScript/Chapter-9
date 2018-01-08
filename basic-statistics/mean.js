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

importCsvFile(inputFilePath)
    .then(data => {
        var dailyRainfall = data.map(row => row.Precipitation);
        var averageDailyRainfall = average(dailyRainfall);
        console.log("Average daily rainfall: " + averageDailyRainfall + "mm");
    })
    .catch(err => {
        console.error(err);
    });

