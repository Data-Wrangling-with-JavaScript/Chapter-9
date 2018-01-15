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
    return sum(values) / values.length;
}

function std (values) {
    const avg = average(values); // Compute the average of the values.
    const squaredDiffsFromAvg = values // Compute the shared difference from the average for each value.
        .map(v => v - avg)
        .map(v => v * v);
    const avgDiff = average(squaredDiffsFromAvg); // Average the squared differences.
    return Math.sqrt(avgDiff); // Take the square root and we have our standard deviation.
}

importCsvFile(inputFilePath)
    .then(data => {
        const monthlyRainfall = data.map(row => row.TotalRain); // Extract 'TotalRain' values.
        const monthlyRainfallStdDeviation = std(monthlyRainfall); // Compute the standard deviation of monthly rainfall for 2016.
        console.log("Daily rainfall standard deviation: " + monthlyRainfallStdDeviation + "mm");
    })
    .catch(err => {
        console.error(err);
    });

