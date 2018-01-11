"use strict";

var dataForge = require('data-forge');
var c3ChartMaker = require('c3-chart-maker');

dataForge.readFile("./data/nyc-weather-2015-2016.csv")
    .parseCSV()
    .then(dataFrame => {
        dataFrame = dataFrame
            .parseInts(["Year", "Month", "Day"])
            .where(row => row.Year === 2016)
            .where(row => row.Month === 1)
            .parseFloats(["MinTemp", "MaxTemp", "Precipitation", "Snowfall"])
            .generateSeries({
                Date: row => row.Year.toString() + '-' + row.Month + '-' + row.Day,
                AvgTemp: row => (row.MinTemp + row.MaxTemp) / 2,
            })
            .bake();

        console.log(dataFrame.toString());

        var chartDef = {
            series: {
                "Date": "Date",
                "Average temperature": "AvgTemp",
                "Rain": "Precipitation",
                "Snow": "Snowfall",
            },
            data: {
                x: "Date",
                type: 'bar',
                axes: {
                    "Rain": 'y2',
                    "Snow": 'y2'
                }
            },
            axis: {
                x: {
                    type: 'timeseries',
                    format: '%y-%M-%d'
                },
                y2: {
                    show: true
                }
            },
            grid: {
                x: {
                    show: true
                },
                y: {
                    show: true
                },
                y2: {
                    show: true
                }
            },
            point: {
                show: false   
            }
        };

        return c3ChartMaker(dataFrame, chartDef, "./output/nyc-daily-jan.png");
    })
    .catch(err => {
        console.error(err);
    });