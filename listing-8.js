"use strict";

const dataForge = require('data-forge');
const simpleStatistics = require('simple-statistics');
const renderLineChart = require('./toolkit/charts.js').renderLineChart;

dataForge.readFile("./data/nyc-weather.csv")
    .parseCSV()
    .then(dataFrame => {
        dataFrame = dataFrame
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
            .concat(new dataForge.Series([ // Add in a stub record for forecasted year, we will soon populate this with a forecasted value.
                {
                    Year: 2100
                }
            ]))
            .inflate(); // Convert to a dataframe, because groupBy returns a series.

        const regressionInput = dataFrame // Generate input to the linear regression.
            .where(row => row.AvgTemp !== undefined)
            .deflate(row => [row.Year, row.AvgTemp]) // This data is formatted as an array of x,y values.
            .toArray();

        const regression = simpleStatistics.linearRegression(regressionInput); // Create the linear regression.
        const forecaster = simpleStatistics.linearRegressionLine(regression); // Create a forecaster that can predict future values for us.

        dataFrame = dataFrame.withSeries({
                ForecastYear: new dataForge.Series({ // Create a separate series for the X axis of the forecast.
                    values: [
                        1917,
                        2100
                    ],
                    index: [
                        1917,
                        2100
                    ]
                }),
                Forecast: new dataForge.Series({ // Create a series for the forecast values.
                    values: [
                        forecaster(1917), // Forecast for 1917 and 2100.
                        forecaster(2100)
                    ],
                    index: [
                        1917,
                        2100
                    ]
                })
            });
            
        return renderLineChart(dataFrame, ["Year", "ForecastYear"], ["AvgTemp", "Forecast"], "./output/nyc-year-trend-with-forecast.png")
    })
    .catch(err => {
        console.error(err);
    });