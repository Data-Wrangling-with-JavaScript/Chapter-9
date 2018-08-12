"use strict";

const average = require('./toolkit/statistics.js').average;

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

const averageMonthlyRainfall = average(monthlyRainfall); // Compute the average monthly rainfall for 2016.
console.log("Average monthly rainfall: " + averageMonthlyRainfall + "mm");
