"use strict";

const sum = require('./toolkit/statistics.js').sum;

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

const totalRainfall = sum(monthlyRainfall); // Compute the total sum of rainfall for 2016.
console.log("Total rainfall for the year: " + totalRainfall + "mm");