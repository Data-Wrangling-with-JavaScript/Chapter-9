"use strict";

const dataForge = require('data-forge');
const renderMonthlyBarChart = require('./toolkit/charts.js').renderMonthlyBarChart;

dataForge.readFile("./data/nyc-weather-2015-2016.csv")
    .parseCSV()
    .then(dataFrame => {
        console.log(dataFrame
            .parseInts(["Year", "Month"]) // Parse columns we are interested.
            .where(row => row.Year === 2016) // Extract records only for 2016.
            .head(30)
            .toString()); //fio:

        dataFrame = dataFrame
            .parseInts(["Year", "Month"]) // Parse columns we are interested.
            .where(row => row.Year === 2016) // Extract records only for 2016.
            .parseFloats(["MinTemp", "MaxTemp"]) // Parse more columns we are interested in.
            .generateSeries({ // Generate average daily temperature.
                AvgTemp: row => (row.MinTemp + row.MaxTemp) / 2,
            })
            .groupBy(row => row.Month) // Group our data by month.
            .select(group => { // For each month group generate a new record that summarizes the month.
                return {
                    Month: group.first().Month,
                    MinTemp: group.select(row => row.MinTemp).min(), // Extract 'MinTemp' values for the month.
                    MaxTemp: group.select(row => row.MaxTemp).max(), // Extract 'MaxTemp' values for the month.
                    AvgTemp: group.select(row => row.AvgTemp).average() // Compute the average temperature for the month.
                };
            })
            .inflate(); // Convert back to a DataFrame, because groupBy returns a series.

        console.log(dataFrame.toString()); // Print our data to the console to double check it.

        return renderMonthlyBarChart(dataFrame, "AvgTemp", "./output/nyc-monthly-weather.png"); // Render the NYC monthly weather chart.
    })
    .catch(err => {
        console.error(err);
    });