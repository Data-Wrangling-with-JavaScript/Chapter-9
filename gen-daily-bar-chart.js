"use strict";

var dataForge = require('data-forge');
var c3ChartMaker = require('c3-chart-maker');

dataForge.readFile("./data/nyc-weather-2015-2016.csv")
    .parseCSV()
    .then(dataFrame => {
        dataFrame = dataFrame
            .parseInts(["Year", "Month"])
            .where(row => row.Year === 2016)
            .parseFloats(["MinTemp", "MaxTemp"])
            .generateSeries({
                Date: row => row.Year.toString() + '-' + row.Month + '-' + row.Day,
                AvgTemp: row => (row.MinTemp + row.MaxTemp) / 2,
            })
            .inflate()
            .bake();

        console.log(dataFrame.toString());

        var chartDef = {
            series: {
                "Date": "Date",
                "AvgTemp": "AvgTemp",
            },
            data: {
                x: "Date",
                type: 'bar',
            },
            axis: {
                x: {
                    type: 'timeseries',
                    format: '%y-%M-%d'
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

        return c3ChartMaker(dataFrame, chartDef, "./output/nyc-daily-temp.png");
    })
    .catch(err => {
        console.error(err);
    });