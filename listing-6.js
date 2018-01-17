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

function createDistribution (series, chartFileName) {
    const bucketed = bucket(series, 20);
    const frequencyTable = bucketed
        .deflate(r => r.Mid)
        .detectValues()
        .orderBy(row => row.Value);
    console.log(frequencyTable.toString());

    const categories = frequencyTable
        .deflate(r => r.Value.toFixed(2)) // Format the categories as we want them displayed on the chart.
        .toArray();
    
    return renderBarChart("Frequency", frequencyTable, categories, chartFileName);
};

function isWinter (monthNo) {
    return monthNo === 1 ||
        monthNo === 2 ||
        monthNo === 12;
};

function isSummer (monthNo) {
    return monthNo === 6 ||
        monthNo === 7 ||
        monthNo === 8;
};

dataForge.readFile("./data/nyc-weather.csv")
    .parseCSV()
    .then(dataFrame => {
        dataFrame = dataFrame
            .parseInts("Month")
            .parseFloats(["MinTemp", "MaxTemp"])
            .generateSeries({
                AvgTemp: row => (row.MinTemp + row.MaxTemp) / 2
            })
            .bake();
        
        console.log("Temperature distribution:");
        const temperatures = dataFrame
            .getSeries("AvgTemp")
            .bake();
        createDistribution(temperatures, "./output/nyc-temperature-distribution.png");

        console.log("Winter temperature distribution:");
        const winterTemperatures = dataFrame
            .where(row => isWinter(row.Month))
            .getSeries("AvgTemp")
            .bake();
        createDistribution(winterTemperatures, "./output/nyc-winter-temperature-distribution.png");

        console.log("Summer temperature distribution:");
        const summerTemperatures = dataFrame
            .where(row => isSummer(row.Month))
            .getSeries("AvgTemp")
            .bake();
        createDistribution(summerTemperatures, "./output/nyc-summer-temperaturedistribution.png");
    })
    .catch(err => {
        console.error(err);
    });