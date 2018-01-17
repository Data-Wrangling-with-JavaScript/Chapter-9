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
    return values.reduce((prev, cur) => prev + cur, 0);
}

//
// Compute the average of a set of values.
//
function average (values) {
    return sum(values) / values.length; // Divide the sum of values by the amount of values.
}

const averageMonthlyRainfall = average(monthlyRainfall); // Compute the average monthly rainfall for 2016.
console.log("Average monthly rainfall: " + averageMonthlyRainfall + "mm");
