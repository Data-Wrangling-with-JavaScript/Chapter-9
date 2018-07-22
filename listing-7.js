"use strict";

const dataForge = require('data-forge');
const renderMonthlyBarChart = require('./toolkit/charts.js').renderMonthlyBarChart; // Let's assume we already create functions to render charts, I'll show you how to do this in chapters 10 and 11.
const average = require('./toolkit/statistics.js').average; // Reuse the average function we created earlier.

const dataFrame = dataForge
    .readFileSync("./data/nyc-weather.csv") // I'm using syncrhonous file reading to make the code easier to read, in practice you will probably need to use the async version.
    .parseCSV()
    .parseInts("Year") // Parse the Year column.
    .where(row => row.Year === 2016) // Extract records only for 2016.
    .parseFloats(["MinTemp", "MaxTemp"]) // Parse more columns we are interested in.
    .generateSeries({ // Generate average daily temperature.
        AvgTemp: row => (row.MinTemp + row.MaxTemp) / 2,
    })
    .parseInts("Month") // Parse the Month column.
    .groupBy(row => row.Month) // Group our data by month.
    .select(group => { // For each month group generate a new record that summarizes the month.
        return {
            Month: group.first().Month,
            MinTemp: group.deflate(row => row.MinTemp).min(), // Extract 'MinTemp' values for the month and get the minimum.
            MaxTemp: group.deflate(row => row.MaxTemp).max(), // Extract 'MaxTemp' values for the month and get the maximum.
            AvgTemp: average(group.deflate(row => row.AvgTemp).toArray()) // Compute the average temperature for the month.
        };
    })
    .inflate(); // Convert back to a DataFrame, because groupBy returns a series.

console.log(dataFrame.toString()); // Print our data to the console to double check it.

renderMonthlyBarChart(dataFrame, "AvgTemp", "./output/nyc-monthly-weather.png") // Render the NYC monthly weather chart.
    .catch(err => { // Chart rendering is asynchronous.
        console.error(err);
    });