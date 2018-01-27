"use strict";

const std = require('./toolkit/statistics.js').std;

const monthlyRainfall = [ // Keep things simple with some hard coded data.
    112.1,
    112,
    29.8,
    41.1,
    95.4,
    66,
    178.3,
    50.2,
    71,
    105.4,
    137.5,
    73.4
];

const monthlyRainfallStdDeviation = std(monthlyRainfall); // Compute the standard deviation of monthly rainfall for 2016.
console.log("Monthly rainfall standard deviation: " + monthlyRainfallStdDeviation + "mm");
