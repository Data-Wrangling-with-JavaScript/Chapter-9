"use strict";

var dataForge = require('data-forge');
var c3ChartMaker = require('c3-chart-maker');

dataForge.readFile("./data/nyc-weather.csv")
    .parseCSV()
    .then(dataFrame => {
        dataFrame = dataFrame
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

        //TODO: Would be good to add a rolling average.

        var chartDef = {
            series: {
                //"Min temp": "MinTemp",
                //"Max temp": "MaxTemp",
                "Avg temp": "AvgTemp",
                "Year": "Year"
            },
            data: {
                "x": "Year",
            },
            axis: {
                y: {
                    min: 0,
                }
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

        return c3ChartMaker(dataFrame, chartDef, "./output/nyc-yearly-trend.png");
    })
    .catch(err => {
        console.error(err);
    });