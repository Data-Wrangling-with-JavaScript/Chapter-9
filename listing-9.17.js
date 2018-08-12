"use strict";

const dataForge = require('data-forge');
const simpleStatistics = require('simple-statistics');

let dataFrame = dataForge.readFileSync("./data/nyc-weather.csv") // Load and parse weather data.
    .parseCSV()
    .parseInts(["Year", "Month", "Day"])
    .where(row => row.Year >= 2013) // Filter out all records before 2013.
    .parseFloats("Precipitation")
    .generateSeries({
        Date: row => new Date(row.Year, row.Month-1, row.Day), // Generate a data from year, month and day columns.
    })
    .setIndex("Date"); // Index by date so that we can merge our data.

const umbrellaSalesData = dataForge.readFileSync("./data/nyc-umbrella-sales.csv") // Load and parse umbrella sales data.
    .parseCSV()
    .parseDates("Date", "DD/MM/YYYY")
    .parseFloats("Sales")
    .setIndex("Date"); // Index by date so that we can merge our data.
    
dataFrame = dataFrame
    .withSeries("UmbrellaSales", umbrellaSalesData.getSeries("Sales")) // Merge umbrella sales into the dataframe. This ensures that our dates line up.
    .where(row => row.Precipitation !== undefined 
        && row.UmbrellaSales !== undefined); // Drop rows with missing values. Rows in the CSV file may not line up.
    

const x = dataFrame.getSeries("Precipitation").toArray(); // Extract x values for the correlation coefficient.
const y = dataFrame.getSeries("UmbrellaSales").toArray(); // Extract y values for the correlation coefficient.
const correlationCoefficient = simpleStatistics.sampleCorrelation(x, y); // Compute  the correlation coefficient.
console.log(correlationCoefficient); // Print to console to see the result.