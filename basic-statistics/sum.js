"use strict";

var importCsvFile = require('./toolkit/importCsvFile');

var inputFilePath = "./data/weather-stations-2016.csv";

//
// Get the sum of values.
//
function sum (values) {
    return values.reduce((prev, cur) => prev + cur, 0);
}

importCsvFile(inputFilePath)
    .then(data => {
        var dailyRainfall = data.map(row => row.Precipitation);
        var yearlyRainfall = sum(dailyRainfall);
        console.log("Total rainfall for the year: " + yearlyRainfall + "mm");
    })
    .catch(err => {
        console.error(err);
    });

