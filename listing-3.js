"use strict";

const importCsvFile = require('./toolkit/importCsvFile');

const inputFilePath = "./data/nyc-monthly-weather-2016.csv";

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
    return sum(values) / values.length; // Divide the sum of values by the amount of values.
}

importCsvFile(inputFilePath)
    .then(data => {
        const monthlyRainfall = data.map(row => row.TotalRain); // Extract 'TotalRain' values.
        const averageDailyRainfall = average(monthlyRainfall); // Compute the average monthly rainfall for 2016.
        console.log("Average daily rainfall: " + averageDailyRainfall + "mm");
    })
    .catch(err => {
        console.error(err);
    });

