"use strict";

var dataForge = require('data-forge');
var c3ChartMaker = require('c3-chart-maker');

function prepData (dataFrame) {
    return dataFrame
        .parseInts(["Year"])
        .parseFloats(["MinTemp", "MaxTemp"])
        .generateSeries({
            AvgTemp: row => (row.MinTemp + row.MaxTemp) / 2,
        })
        .groupBy(row => row.Year)
        .select(group => {
            return {
                Year: group.first().Year,
                MinTemp: group.select(row => row.MinTemp).min(),
                MaxTemp: group.select(row => row.MaxTemp).max(),
                AvgTemp: group.select(row => row.AvgTemp).average()
            };
        })
        .inflate()
        .bake();
};

Promise.all([
        dataForge.readFile("./data/la-weather.csv").parseCSV(),
        dataForge.readFile("./data/nyc-weather.csv").parseCSV()
    ])
    .then(dataFrames => {
        let laWeather = dataFrames[0];
        let nycWeather = dataFrames[1];

        laWeather = prepData(laWeather);
        nycWeather = prepData(nycWeather);

        var combinedWeather = laWeather
            .setIndex("Year")
            .renameSeries({
                AvgTemp: "TempLA",
            })
            .withSeries({
                TempNYC: nycWeather
                    .setIndex("Year")
                    .getSeries("AvgTemp")
            })
            .bake();

        var chartDef = {
            series: {
                "Temperature LA": "TempLA",
                "Temperature NYC": "TempNYC",
            },
            data: {
                "x": "Year",
            },
            grid: {
                x: {
                    show: true
                },
                y: {
                    show: true
                }
            },
            point: {
                show: false   
            }
        };

        return c3ChartMaker(combinedWeather, chartDef, "./output/yearly-trend-comparison.png");
    })
    .catch(err => {
        console.error(err);
    });