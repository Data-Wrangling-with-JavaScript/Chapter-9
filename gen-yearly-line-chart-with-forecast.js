"use strict";

const dataForge = require('data-forge');
const c3ChartMaker = require('c3-chart-maker');
const simpleStatistics = require('simple-statistics');

dataForge.readFile("./data/nyc-weather.csv")
    .parseCSV()
    .then(dataFrame => {
        dataFrame = dataFrame
            .parseInts(["Year"])
            .where(row => row.Year >= 1917)
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
            .concat(new dataForge.Series([
                {
                    Year: 2100 // Stub record for forecasted year.
                }

            ])) //todo: be nice if withSeries could handle this!!
            .inflate()
            .setIndex("Year")
            .bake();

        const regressionInput = dataFrame
            .where(row => row.AvgTemp !== undefined)
            .deflate(row => [row.Year, row.AvgTemp])
            .toArray();

        const regression = simpleStatistics.linearRegression(regressionInput);
        const forecaster = simpleStatistics.linearRegressionLine(regression);

        dataFrame = dataFrame.withSeries({
                ForecastYear: new dataForge.Series({ //todo: Workaround for C3 issue???!
                    values: [
                        1917,
                        2100
                    ],
                    index: [
                        1917,
                        2100
                    ]
                }),
                Forecast: new dataForge.Series({
                    values: [
                        forecaster(1917),
                        forecaster(2100)
                    ],
                    index: [
                        1917,
                        2100
                    ]
                })
            })
            .bake();

        console.log(dataFrame.toString());

        //TODO: Would be good to add a rolling average.

        const chartDef = {
            series: {
                //"Min temp": "MinTemp",
                //"Max temp": "MaxTemp",
                "Avg temp": "AvgTemp",
                "Forecasted temp": "Forecast",
                "x1": "Year",
                "x2": "ForecastYear",
            },
            data: {
                xs: { // NO EASY WAY TO DRAW A TREND LINE ON C3, JUST A SEPARATE SERIES AND X AXIS.
                    "Avg temp": "x1",
                    "Forecasted temp": "x2",
                }
            },
            axis: {
                y: {
                    //fio: min: 0,
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

        return c3ChartMaker(dataFrame, chartDef, "./output/nyc-yearly-trend-with-forecast.png");
    })
    .catch(err => {
        console.error(err);
    });