"use strict";

var dataForge = require('data-forge');
var c3ChartMaker = require('c3-chart-maker');

dataForge.readFile("./data/weather-stations.csv")
    .parseCSV()
    .then(dataFrame => {
        dataFrame = dataFrame
            .parseInts(["Year", "Month"])
            .where(row => row.Year === 2016)
            .parseFloats(["MinTemp", "MaxTemp"])
            .generateSeries({
                AvgTemp: row => (row.MinTemp + row.MaxTemp) / 2,
            })
            .groupBy(row => row.Month)
            .select(group => {
                return {
                    Month: group.first().Month,
                    MinTemp: group.select(row => row.MinTemp).min(),
                    MaxTemp: group.select(row => row.MaxTemp).max(),
                    AvgTemp: group.select(row => row.AvgTemp).average()
                };
            })
            .inflate()
            .bake();

        console.log(dataFrame.toString());

        var chartDef = {
            series: {
                "AvgTemp": "AvgTemp",
            },
            data: {
                type: 'bar',
            },
            axis: {
                x: {
                    type: 'category',
                    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
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

        return c3ChartMaker(dataFrame, chartDef, "./output/monthly-temp.png");
    })
    .catch(err => {
        console.error(err);
    });