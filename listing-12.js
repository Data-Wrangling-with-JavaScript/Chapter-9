"use strict";

const dataForge = require('data-forge');
const renderLineChart = require('./toolkit/charts.js').renderLineChart;
const average = require('./toolkit/statistics.js').average;
const rollingAverage = require('./toolkit/time-series.js').rollingAverage;

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

dataFrame = summarizeByYear(dataFrame)
    .setIndex("Year") // We need to set an index so that we can reintegrate the moving average series.
    .withSeries("TempMovingAvg", dataFrame => { // Generate a moving average series.
        const temperatureSeries = dataFrame.getSeries("AvgTemp"); // Extract the time series form the dataframe.
        return rollingAverage(temperatureSeries, 20) // Compute 20 year rolling average of temperature.
    });

const outputChartFile = "./output/nyc-yearly-rolling-average.png";
renderLineChart(dataFrame, ["Year"], ["TempMovingAvg"], outputChartFile) // Render the chart.
    .catch(err => {
        console.error(err);
    });
    