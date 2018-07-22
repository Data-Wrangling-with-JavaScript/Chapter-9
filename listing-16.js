"use strict";

const dataForge = require('data-forge');
const renderLineChart = require('./toolkit/charts.js').renderLineChart;
const statistics = require('./toolkit/statistics.js');
const average = statistics.average;
const std = statistics.std;

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

//
// Standardize a data set for comparison against other data sets.
//
function standardize (dataFrame, seriesName) {
    const series = dataFrame.getSeries(seriesName);
    const values = series.toArray();
    const avg = average(values);
    const standardDeviation = std(values);
    const standardizedSeries = series.select(value => (value - avg) / standardDeviation); // Transform the series so that each value is 'standard deviations from the mean'.
    return dataFrame.withSeries(seriesName, standardizedSeries);
};

let nycWeather = dataForge.readFileSync("./data/nyc-weather.csv").parseCSV();
let laWeather = dataForge.readFileSync("./data/la-weather.csv").parseCSV();

nycWeather = summarizeByYear(nycWeather)
            .setIndex("Year");
laWeather = summarizeByYear(laWeather)
            .setIndex("Year");

nycWeather = standardize(nycWeather, "AvgTemp"); // Standardize NYC temperature data.
laWeather = standardize(laWeather, "AvgTemp"); // Standardize LA temperature data.

const combinedWeather = laWeather
    .renameSeries({
        AvgTemp: "TempLA",
    })
    .withSeries({
        TempNYC: nycWeather
            .setIndex("Year")
            .getSeries("AvgTemp")
    });

const outputChartFile = "output/standardised-yearly-comparision.png";
renderLineChart(combinedWeather, ["Year", "Year"], ["TempLA", "TempNYC"], outputChartFile) // Render the chart so we can compare standardized data series.
    .catch(err => {
        console.error(err);
    });