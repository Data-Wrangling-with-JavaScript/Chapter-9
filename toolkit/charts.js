"use strict";

const c3ChartMaker = require('c3-chart-maker');

// 
// Render a simple daily line chart.
//
function renderDailyLineChart (dataFrame, xAxisFieldName, yAxisFieldName, renderedChartFilePath) {
    var series = {};
    series[xAxisFieldName] = xAxisFieldName;
    series[yAxisFieldName] = yAxisFieldName;
    var chartDef = {
        series: series,
        data: {
            "x": xAxisFieldName
        },
        axis: {
            x: {
                type: "timeseries",
                tick: {
                    format: "%Y-%m-%d"
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
        },
        transition: {
            duration: 0
        }
    };

    return c3ChartMaker(dataFrame, chartDef, renderedChartFilePath);
};

//
// Render a simple line chart.
//
function renderLineChart (dataFrame, xAxisFieldNames, yAxisFieldNames, renderedChartFilePath) {
    var series = {};
    var xs = {};
    
    for (let fieldName of xAxisFieldNames) {
        series[fieldName] = fieldName;
    }
    
    var xIndex = 0;
    for (let fieldName of yAxisFieldNames) {
        series[fieldName] = fieldName;
        xs[fieldName] = xAxisFieldNames[xIndex++];
    }

    const chartDef = {
        series: series,
        data: {
            xs: xs
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
        },
        transition: {
            duration: 0
        }
    };

    return c3ChartMaker(dataFrame, chartDef, renderedChartFilePath);
};

//
// Render a simple monthly bar chart.
//
function renderMonthlyBarChart (dataFrame, fieldName, renderedChartFilePath) {
    var series = {};
    series[fieldName] = fieldName;

    var chartDef = {
        series: series,
        data: {
            type: "bar",
        },
        axis: {
            x: {
                type: "category",
                categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
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
        },
        transition: {
            duration: 0
        }
    };

    return c3ChartMaker(dataFrame, chartDef, renderedChartFilePath);
};


module.exports = {
    renderDailyLineChart: renderDailyLineChart,
    renderLineChart: renderLineChart,
    renderMonthlyBarChart: renderMonthlyBarChart
};