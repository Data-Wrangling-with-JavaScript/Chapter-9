"use strict";

var dataForge = require('data-forge');

dataForge.readFile("./data/weather-stations-2016.csv")
    .parseCSV()
    .then(dataFrame => {
        var sumarized = dataFrame
            .parseFloats(["MinTemp", "MaxTemp", "Month"])
            .groupBy(row => row.Month)
            .select(group => {
                var first = group.first();
                var minDailyTemperatures = group.select(row => row.MinTemp);
                var maxDailyTemperatures = group.select(row => row.MaxTemp);
                var avgDailyTemperatures = group.select(row => (row.MinTemp + row.MaxTemp) / 2);
                return {
                    Year: first.Year,
                    Month: first.Month,
                    MinTemp: minDailyTemperatures.min(),
                    MaxTemp: maxDailyTemperatures.max(),
                    AvgTemp: avgDailyTemperatures.average(),
                    //TempStdDeviation: avgDailyTemperatures.std(), //TODO: add this to DF!!
                };
            })
            .inflate(); 
        console.log(sumarized.toString());
    })
    .catch(err => {
        console.error(err);
    });