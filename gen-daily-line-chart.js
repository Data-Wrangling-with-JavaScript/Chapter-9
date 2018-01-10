"use strict";

var dataForge = require('data-forge');
var c3ChartMaker = require('c3-chart-maker');

dataForge.readFile("./data/weather-stations-2016.csv")
    .parseCSV()
    .then(dataFrame => {
        dataFrame = dataFrame
            .parseFloats(["MinTemp", "MaxTemp"])
            .parseInts(["Month", "Year", "Day"])
            .generateSeries({
                Date: row => row.Year.toString() + '-' + row.Month + '-' + row.Day,
                AvgTemp: row => (row.MinTemp + row.MaxTemp) / 2,
            })
            .bake();

        var chartDef = {
            series: {
                "Temp": "AvgTemp",
                "Date": "Date"
            },
            data: {
                "x": "Date"
            },
            axis: {
                x: {
                    type: 'timeseries',
                    tick: {
                        format: '%Y-%m-%d'
                    }
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

        return c3ChartMaker(dataFrame, chartDef, "./output/daily-trend-2016.png");
    })
    .catch(err => {
        console.error(err);
    });