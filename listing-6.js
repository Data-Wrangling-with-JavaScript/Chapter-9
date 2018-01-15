"use strict";

const dataForge = require('data-forge');
const renderDailyLineChart = require('./toolkit/charts.js').renderDailyLineChart;

dataForge.readFile("./data/nyc-weather-2015-2016.csv")
    .parseCSV()
    .then(dataFrame => {
        dataFrame = dataFrame
            .parseFloats(["MinTemp", "MaxTemp"])
            .parseInts(["Month", "Year", "Day"])
            .generateSeries({
                Date: row => row.Year.toString() + '-' + row.Month + '-' + row.Day, // Create a formatted date for the chart.
                AvgTemp: row => (row.MinTemp + row.MaxTemp) / 2, // Compute average daily temperature.
            })
            .where(row => row.Year === 2016);

        return renderDailyLineChart(dataFrame, "Date", "AvgTemp", "./output/daily-trend-2016.png"); // Render the temperature time series to a line chart.
    })
    .catch(err => {
        console.error(err);
    });