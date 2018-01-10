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
            .setIndex("Date");

            /*
        dataFrame.generateSeries(
            ) // <-- From rolling window, how?
        */

        var temperatureMovingAverage = dataFrame.getSeries("AvgTemp")
            .rollingWindow(30)
            .asPairs() //TODO: This is kind of complicated. Is there a simpler way I can 'generate a moving average' directly into the dataframe?
            .select(pair => {
                var window = pair[1];
                return [
                    window.getIndex().last(),
                    window.average()
                ];                
            })
            .asValues(); 

        dataFrame = dataFrame
            .withSeries("TempMovingAvg", temperatureMovingAverage)
            .where(row => row.Year > 2015);
        
        console.log(dataFrame
            .head(10)
            .resetIndex()
            .dropSeries(["MinTemp", "MaxTemp", "Month", "Day"])
            .toString()
        );

        var chartDef = {
            series: {
                "Temperature Moving average": "TempMovingAvg",
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

        return c3ChartMaker(dataFrame, chartDef, "./output/moving-average-2016.png");
    })
    .catch(err => {
        console.error(err);
    });