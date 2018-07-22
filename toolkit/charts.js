"use strict";

const c3ChartMaker = require('c3-chart-maker');

//
// Render a simple line chart.
//
function renderLineChart (dataFrame, xAxisFieldNames, yAxisFieldNames, renderedChartFilePath) {
    const series = {};
    const xs = {};
    
    for (let fieldName of xAxisFieldNames) {
        series[fieldName] = fieldName;
    }
    
    let xIndex = 0;
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
// Render a generic bar chart.
//
function renderBarChart (fieldName, dataFrame, categories, chartFileName) {

    const series = {};
    series[fieldName] = fieldName;

    const chartDef = {
        size: {
            height: 600,
            width: 1000,
        },            
        series: series,
        data: {
            type: "bar",
        },
        axis: {
            x: {
                type: "category",
                categories: categories,
                tick: {
                    culling: false,
                },
            },
        },
        bar: {
            width: {
                ratio: 0.9
            }
        }
    };

    return c3ChartMaker(
        dataFrame, 
        chartDef, 
        chartFileName
    );
}

//
// Render a simple monthly bar chart.
//
function renderMonthlyBarChart (dataFrame, fieldName, renderedChartFilePath) {
    const series = {};
    series[fieldName] = fieldName;

    const chartDef = {
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
    renderLineChart: renderLineChart,
    renderBarChart: renderBarChart,
    renderMonthlyBarChart: renderMonthlyBarChart
};