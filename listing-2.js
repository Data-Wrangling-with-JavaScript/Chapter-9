"use strict";

const importCsvFile = require('./toolkit/importCsvFile');

const inputFilePath = "./data/nyc-monthly-weather-2016.csv";

//
// Get the sum of values.
//
function sum (values) {
    return values.reduce((prev, cur) => prev + cur, 0); // Use the JavaScript reduce function to compute the sum from a set of values.
}

importCsvFile(inputFilePath)
    .then(data => {
        const monthlyRainfall = data.map(row => row.TotalRain); // Extract 'TotalRain' values.
        const yearlyRainfall = sum(monthlyRainfall); // Compute the total sum of rainfall for 2016.
        console.log("Total rainfall for the year: " + yearlyRainfall + "mm");
    })
    .catch(err => {
        console.error(err);
    });

