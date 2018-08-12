"use strict";

const dataForge = require('data-forge');
const renderBarChart = require('./toolkit/charts.js').renderBarChart;

//
// Our function to create a distribution from a series and render a histogram from it.
//
function createDistribution (series, chartFileName) {
    const bucketed = series.bucket(20); // Sort the series into 20 evenly spaced buckets (or bins).
    const frequencyTable = bucketed
        .deflate(r => r.Mid) // Extract the mid-point of each bin to a new series.
        .detectValues() // Determine the frequency of values in the new series.
        .orderBy(row => row.Value); // Order by ascending bin value, this is the correct order for rendering the histogram.
    console.log(frequencyTable.toString()); // Print to console so we can double check.

    const categories = frequencyTable
        .deflate(r => r.Value.toFixed(2)) // Format x axis labels for display in the histogram.
        .toArray();
    
    return renderBarChart("Frequency", frequencyTable, categories, chartFileName); // Render the histogram.
};

function isWinter (monthNo) { // Determine if the requested month is a winter month.
    return monthNo === 1 ||
        monthNo === 2 ||
        monthNo === 12;
};

const dataFrame = dataForge.readFileSync("./data/nyc-weather.csv")
    .parseCSV()
    .parseInts("Month")
    .parseFloats(["MinTemp", "MaxTemp"])
    .generateSeries({
        AvgTemp: row => (row.MinTemp + row.MaxTemp) / 2
    });

const winterTemperatures = dataFrame
    .where(row => isWinter(row.Month)) // To create the full distribution, simply omit this filter.
    .getSeries("AvgTemp");

createDistribution(winterTemperatures, "./output/nyc-winter-temperature-distribution.png")
    .catch(err => {
        console.error(err);
    });