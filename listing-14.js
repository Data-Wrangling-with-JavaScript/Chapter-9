"use strict";

const dataForge = require('data-forge');
const renderLineChart = require('./toolkit/charts.js').renderLineChart;
const average = require('./toolkit/statistics.js').average;
const linearRegression = require('./toolkit/time-series.js').linearRegression;

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
    .concat(new dataForge.DataFrame([ // Add in a stub record for forecasted year, we will soon populate this with a forecasted value.
        {
            Year: 2100
        }
    ]))
    .setIndex("Year"); // Index by year so we can merge in the forecasted time series.

const forecastSeries = linearRegression(dataFrame.getSeries("AvgTemp"), 1917, 2100); // Compute the linear regression for the temperature time series.
dataFrame = dataFrame // Merge the forecast into the dataframe.
    .withSeries({
        ForecastYear: new dataForge.Series({ // Need to provide this extra series as a new X axis in the C3 chart.
            values: [1917, 2100],
            index: [1917, 2100], // Must index by year to integrate into the dataframe!
        }),
        Forecast: forecastSeries,
    });

const outputChartFile = "./output/nyc-yearly-trend-with-forecast.png";
renderLineChart(dataFrame, ["Year", "ForecastYear"], ["AvgTemp", "Forecast"], outputChartFile)
    .catch(err => {
        console.error(err);
    });