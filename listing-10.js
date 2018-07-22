"use strict";

const dataForge = require('data-forge');
const renderLineChart = require('./toolkit/charts.js').renderLineChart;
const average = require('./toolkit/statistics.js').average;

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
                AvgTemp: average(group.select(row => row.AvgTemp).toArray())
            };
        })
        .inflate(); // Convert to a dataframe, because groupBy returns a series.
};

let dataFrame = dataForge.readFileSync("./data/nyc-weather.csv")
    .parseCSV();

dataFrame = summarizeByYear(dataFrame); // Group and sumarize the data by year.

const outputChartFile = "./output/nyc-yearly-trend.png";
renderLineChart(dataFrame, ["Year"], ["AvgTemp"], outputChartFile) // Render a line chart of yearly average temperature.
    .catch(err => {
        console.error(err);
    });