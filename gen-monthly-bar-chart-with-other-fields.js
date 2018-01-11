"use strict";

var dataForge = require('data-forge');
var c3ChartMaker = require('c3-chart-maker');

dataForge.readFile("./data/nyc-weather-2015-2016.csv")
    .parseCSV()
    .then(dataFrame => {
        dataFrame = dataFrame
            .parseInts(["Year", "Month"])
            .where(row => row.Year === 2016)
            .parseFloats(["MinTemp", "MaxTemp", "Precipitation", "Snowfall"])
            .generateSeries({
                AvgTemp: row => (row.MinTemp + row.MaxTemp) / 2,
            })
            .groupBy(row => row.Month)
            .select(group => {
                return {
                    Month: group.first().Month,
                    MinTemp: group.select(row => row.MinTemp).min(),
                    MaxTemp: group.select(row => row.MaxTemp).max(),
                    AvgTemp: group.select(row => row.AvgTemp).average(),
                    TotalRain: group.select(row => row.Precipitation).sum(),
                    TotalSnow: group.select(row => row.Snowfall).sum(),
                };
            })
            .inflate()
            .bake();

        console.log(dataFrame.toString());

        var chartDef = {
            series: {
                "Average temperature": "AvgTemp",
                "Total rain": "TotalRain",
                "Total snow": "TotalSnow",
            },
            data: {
                type: 'bar',
                axes: {
                    "Total rain": 'y2',
                    "Total snow": 'y2'
                }
            },
            axis: {
                x: {
                    type: 'category',
                    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
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

        return c3ChartMaker(dataFrame, chartDef, "./output/nyc-monthly-temp-with-other-fields.png");
    })
    .catch(err => {
        console.error(err);
    });