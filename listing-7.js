"use strict";

const dataForge = require('data-forge');
const renderLineChart = require('./toolkit/charts.js').renderLineChart;

//
// Summarize our data by year.
//
function summarizeByYear (dataFrame) {
    return dataFrame
        .parseInts(["Year"])
        .parseFloats(["MinTemp", "MaxTemp"])
        .generateSeries({
            AvgTemp: row => (row.MinTemp + row.MaxTemp) / 2, // Generate daily average temperature.
        })
        .groupBy(row => row.Year) // Group by year and summarize.
        .select(group => {
            return {
                Year: group.first().Year,
                AvgTemp: group.select(row => row.AvgTemp).average()
            };
        })
        .inflate(); // Convert to a dataframe, because groupBy returns a series.
};

dataForge.readFile("./data/nyc-weather.csv")
    .parseCSV()
    .then(dataFrame => {
        dataFrame = summarizeByYear(dataFrame);

        return renderLineChart(dataFrame, ["Year"], ["AvgTemp"], "./output/nyc-year-trend.png")
    })
    .catch(err => {
        console.error(err);
    });