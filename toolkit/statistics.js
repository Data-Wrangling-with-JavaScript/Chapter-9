"use strict";

//
// Various statistics functions.
//

//
// Compute the sum of the set of values.
//
function sum (values) {
    return values.reduce((prev, cur) => prev + cur, 0); // Use the JavaScript reduce function to compute the sum from a set of values.
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
        .map(v => Math.pow(v - avg, 2));
    const avgDiff = average(squaredDiffsFromAvg); // Average the squared differences.
    return Math.sqrt(avgDiff); // Take the square root and we have our standard deviation.
}

module.exports = {
    sum: sum,
    average: average,
    std: std,
};