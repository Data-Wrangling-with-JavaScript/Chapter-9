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
            .setIndex("Date") // We need to set an index so that we can reintegrate the moving average series.
            .withSeries("TempMovingAvg", dataFrame => { // Generate a moving average series.
                return dataFrame
                    .getSeries("AvgTemp") // The moving average is based on the 'AvgTemp' field.
                    .rollingWindow(30) // We are averaging over 30 days.
                    .asPairs() //TODO: This is kind of complicated. Is there a simpler way I can 'generate a moving average' directly into the dataframe?
                    .select(pair => {
                        var window = pair[1];
                        return [
                            window.getIndex().last(), // Return the last index from the 30 day period, this allows the new series to correctly line up with records in the dataframe.
                            window.average() // Compute the average of the 30 day period.
                        ];                
                    })
                    .asValues()

                    /* Would this work: 
                    .rollingWindow(30, window => {
                        return [
                            window.getIndex().last(),
                            window.average()
                        ];                
                    })
                    */
            })
            .where(row => row.Year === 2016);

        return renderDailyLineChart(dataFrame, "Date", "TempMovingAvg", "./output/moving-average-2016.png"); // Render the moving average to a line chart.
    })
    .catch(err => {
        console.error(err);
    });