"use strict";

var dataForge = require('data-forge');

function bucket (series, numCategories) { //TODO: Move this function to dataforge.
    var min = series.min();
    var max = series.max();
    var range = max - min;
    var width = range / (numCategories-1);
    return series
        .select(v => {
            var bucket = Math.floor((v - min) / width);
            var bucketMin = (bucket * width) + min;
            return {
                Value: v,
                Bucket: bucket,
                Min: bucketMin,
                Mid: bucketMin + (width*0.5),
                Max: bucketMin + width,
            };
        })
        .inflate()
        .bake();
};


dataForge.readFile("./data/weather-stations-2016.csv")
    .parseCSV()
    .then(dataFrame => {
        var temperatures = dataFrame
            .parseFloats(["MinTemp", "MaxTemp"])
            .deflate(r => (r.MinTemp + r.MaxTemp) / 2);
        var bucketed = bucket(temperatures, 10);
        var frequencyTable = bucketed
            .deflate(r => r.Mid)
            .detectValues()
            .orderBy(row => row.Value);
        console.log(frequencyTable.toString());
    })
    .catch(err => {
        console.error(err);
    });