"use strict";

const dataForge = require('data-forge');
const renderBarChart = require('./toolkit/charts.js').renderBarChart;

function bucket (series, numCategories) { //TODO: Move this function to dataforge.
    const min = series.min();
    const max = series.max();
    const range = max - min;
    const width = range / (numCategories-1);
    return series
        .select(v => {
            const bucket = Math.floor((v - min) / width);
            const bucketMin = (bucket * width) + min;
            return {
                Value: v,
                Bucket: bucket,
                Min: bucketMin,
                Mid: bucketMin + (width*0.5),
                Max: bucketMin + width,
            };
        })
        .inflate()
        .bake();
};

//
// Our function to create a distribution from a series and render a histogram from it.
//
function createDistribution (series, chartFileName) {
    const bucketed = bucket(series, 20); // Sort the series into 20 evenly spaced buckets (or bins).
    console.log(bucketed
        .tail(100)
        .orderBy(row => row.Value)
        .toString()
    ); //fio:
    const frequencyTable = bucketed
        .deflate(r => r.Mid) // Extract the mid-point of each bin to a new series.
        .detectValues() // Determine the frequency of values in the new series.
        .orderBy(row => row.Value); // Order by ascending bin value, this is the correct order for rendering the histogram.
    //console.log(frequencyTable.toString()); // Print to console so we can double check.

    frequencyTable // Output to CSV file so we can double check.
        .transformSeries({
            Value: v => v.toFixed(2),
            Frequency: v => v.toFixed(2),
        })
        .asCSV()
        .writeFileSync("./output/frequency-table.csv");

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

console.log("Winter temperature distribution:");
const winterTemperatures = dataFrame
    //todo:.where(row => isWinter(row.Month)) // To create the full distribution, simply omit this filter.
    .getSeries("AvgTemp");

    //fio:
console.log('average: ' + winterTemperatures.average());
const stats = require('./toolkit/statistics');
console.log('std: ' + stats.std(winterTemperatures.toArray()));

createDistribution(winterTemperatures, "./output/nyc-winter-temperature-distribution.png")
    .catch(err => {
        console.error(err);
    });