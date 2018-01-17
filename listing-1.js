"use strict";

var monthlyRainfall = [ // Keep things simple with some hard coded data.
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

//
// Compute the sum of the set of values.
//
function sum (values) {
    return values.reduce((prev, cur) => prev + cur, 0); // Use the JavaScript reduce function to compute the sum from a set of values.
}

const totalRainfall = sum(monthlyRainfall); // Compute the total sum of rainfall for 2016.
console.log("Total rainfall for the year: " + totalRainfall + "mm");