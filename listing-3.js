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

//
// Compute the standard deviation of a set of values.
//
function std (values) {
    const avg = average(values); // Compute the average of the values.
    const squaredDiffsFromAvg = values // Compute the shared difference from the average for each value.
        .map(v => v - avg)
        .map(v => v * v);
    const avgDiff = average(squaredDiffsFromAvg); // Average the squared differences.
    return Math.sqrt(avgDiff); // Take the square root and we have our standard deviation.
}

const monthlyRainfallStdDeviation = std(monthlyRainfall); // Compute the standard deviation of monthly rainfall for 2016.
console.log("Daily rainfall standard deviation: " + monthlyRainfallStdDeviation + "mm");
