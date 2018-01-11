"use strict";

const dataForge = require('data-forge');
const c3ChartMaker = require('c3-chart-maker');
const assert = require('chai').assert;

function prepData (dataFrame) {
    return dataFrame
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
}

Promise.all([
        dataForge.readFile("./data/la-weather-2015-2016.csv").parseCSV(),
        dataForge.readFile("./data/nyc-weather-2015-2016.csv").parseCSV()
    ])
    .then(dataFrames => {
        let laWeather = dataFrames[0];
        let nycWeather = dataFrames[1];

        laWeather = prepData(laWeather);
        nycWeather = prepData(nycWeather);

        const combinedWeather = laWeather.zip(nycWeather, (laRow, nycRow) => {
                assert(laRow.Month === nycRow.Month);

                console.log(laRow);

                return {
                    Month: laRow.Month,
                    TempLA: laRow.AvgTemp,
                    TempNYC: nycRow.AvgTemp,
                };
            })
            .bake();

        const chartDef = {
            series: {
                "Temperature LA": "TempLA",
                "Temperature NYC": "TempNYC",
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

        return c3ChartMaker(combinedWeather, chartDef, "./output/monthly-temp-comparison.png");
    })
    .catch(err => {
        console.error(err);
    });