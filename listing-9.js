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

//
// Compute the sum of the set of values.
//
function sum (values) {
    return values.reduce((prev, cur) => prev + cur, 0);
}

//
// Compute the average of a set of values.
//
function average (values) {
    return sum(values) / values.length; // Divide the sum of values by the amount of values.
}

//
// Compute the standard deviation of a set of values.
//
function std (values) {
    const avg = average(values); // Compute the average of the values.
    const squaredDiffsFromAvg = values // Compute the shared difference from the average for each value.
        .map(v => v - avg)
        .map(v => v * v);
    const avgDiff = average(squaredDiffsFromAvg); // Average the squared differences.
    return Math.sqrt(avgDiff); // Take the square root and we have our standard deviation.
}

dataForge.readFile("./data/nyc-weather.csv")
    .parseCSV()
    .then(dataFrame => {
        dataFrame = summarizeByYear(dataFrame)
            .setIndex("Year") // We need to set an index so that we can reintegrate the moving average series.
            .withSeries("TempStdDev", dataFrame => { // Generate a moving average series.
                return dataFrame
                    .getSeries("AvgTemp") // The moving average is based on the 'AvgTemp' field.
                    .rollingWindow(20) // We are averaging over 20 years.
                    .asPairs() //TODO: This is kind of complicated. Is there a simpler way I can 'generate a moving average' directly into the dataframe?
                    .select(pair => {
                        var window = pair[1];
                        return [
                            window.getIndex().last(), // Return the last index from the 20 year period, this allows the new series to correctly line up with records in the dataframe.
                            std(window.toArray()) // Compute the standard deviation of the 20 year period.
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
            });

        return renderLineChart(dataFrame, ["Year"], ["TempStdDev"], "./output/nyc-yearly-rolling-std-dev.png")
    })
    .catch(err => {
        console.error(err);
    });
    