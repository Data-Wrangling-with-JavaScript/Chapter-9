"use strict";

const importCsvFile = require('./toolkit/importCsvFile');

const inputFilePath = "./data/nyc-monthly-weather-2016.csv";

//
// Get the minimum value from an array of values.
//
function min (values) {
    return values.reduce((prev, cur) => Math.min(prev, cur), Number.MAX_VALUE); // Use the JavaScript reduce function to pick the minimum value from a set of values.
}

//
// Get the maximum value from an array of values.
//
function max (values) {
    return values.reduce((prev, cur) => Math.max(prev, cur), Number.MIN_VALUE); // Use the JavaScript reduce function to pick the maximum value from a set of values.
}

importCsvFile(inputFilePath) // Load input data.
    .then(data => {
        const minMonthlyTemperatures = data.map(row => row.MinTemp); // Extract 'MinTemp' values.
        const maxMonthlyTemperatures = data.map(row => row.MaxTemp); // Extract 'MaxTemp' values.
        const minYearlyTemp = min(minMonthlyTemperatures); // Find the minimum temperature for 2016.
        const maxYearlyTemp = max(maxMonthlyTemperatures); // Find the maximum temperature for 2016.
        console.log("Min: " + minYearlyTemp); 
        console.log("Max: " + maxYearlyTemp);
        console.log("Range: " + minYearlyTemp + " to " + maxYearlyTemp);
    })
    .catch(err => {
        console.error(err);
    });

