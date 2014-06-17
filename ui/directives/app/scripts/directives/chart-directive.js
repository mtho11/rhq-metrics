'use strict';


/**
 * @ngdoc directive
 * @name metricsStackedBarChart
 * @param {expression} metricsStackedBarChart
 */
angular.module('chartingApp')
    .directive('metricsStackedBarChart', function ($timeout) {
        function link(scope, element, attributes) {

            console.info("Draw Metrics Stacked Bar chart for title: " + attributes.rhqChartTitle);
            console.log("chart height: " + attributes.rhqChartHeight);
            var metricsData = angular.fromJson(attributes.rhqData),
                chartHeight = +attributes.rhqChartHeight || 250,
                tooltipTimeout = +attributes.rhqTooltipTimeout || 15000,
                timeLabel = attributes.rhqTimeLabel || "Time",
                dateLabel = attributes.rhqDateLabel || "Date",
                singleValueLabel = attributes.rhqSingleValueLabel || "Raw Value",
                noDataLabel = attributes.rhqNoDataLabel || "No Data",
                startLabel = attributes.rhqStartLabel || "Start",
                endLabel = attributes.rhqEndLabel || "End",
                durationLabel = attributes.rhqDurationLabel || "Duration",
                minLabel = attributes.rhqMinLabel || "Min",
                maxLabel = attributes.rhqMaxLabel || "Max",
                avgLabel = attributes.rhqAvgLabel || "Avg",
                chartHoverDateFormat = attributes.rhqChartHoverDateFormat || "%m/%d/%y",
                chartHoverTimeFormat = attributes.rhqChartHoverTimeFormat || "%I:%M:%S %p",
                buttonBarDateTimeFormat = attributes.rhqButtonbarDatetimeFormat || "MM/DD/YYYY h:mm a";
            console.log("Metrics Data -->");
            console.dir(metricsData);


            // Define the Stacked Bar Graph function using the module pattern
            var metricStackedBarGraph = function () {
                // privates
                var margin = {top: 10, right: 5, bottom: 5, left: 90},
                    margin2 = {top: 150, right: 5, bottom: 5, left: 90},
                    width = 750 - margin.left - margin.right,
                    adjustedChartHeight = chartHeight - 50,
                    height = adjustedChartHeight - margin.top - margin.bottom,
                    smallChartThresholdInPixels = 600,
                    titleHeight = 30, titleSpace = 10,
                    barOffset = 2,
                    chartData,
                    interpolation = "basis",
                    avgFiltered, avg, minFiltered, min, peakFiltered, peak,
                    oobMax,
                    lowBound,
                    newLow = 0,
                    highBound,
                    calcBarWidth,
                    yScale,
                    timeScale,
                    yAxis,
                    xAxis,
                    brush,
                    brushGroup,
                    timeScaleForBrush,
                    chart,
                    defs,
                    context,
                    svg;

                // adjust the min scale so blue low line is not in axis
                function determineLowBound(min) {
                    newLow = min;
                    if (newLow < 0) {
                        return 0;
                    }
                    else {
                        return newLow;
                    }
                }

                function getChartWidth() {
                    //return angular.element("#" + chartContext.chartHandle).width();
                    return 760;
                }

                function useSmallCharts() {
                    console.debug("getChartWidth: " + getChartWidth());
                    return  getChartWidth() <= smallChartThresholdInPixels;
                }


                function determineScale() {
                    var xTicks, xTickSubDivide, numberOfBarsForSmallGraph = 20;
                    if (metricsData.dataPoints.length > 0) {

                        // if window is too small server up small chart
                        if (useSmallCharts()) {
                            //console.log("Using Small Charts Profile for width: "+getChartWidth());
                            width = 250;
                            xTicks = 3;
                            xTickSubDivide = 2;
                            chartData = metricsData.dataPoints.slice(metricsData.dataPoints.length - numberOfBarsForSmallGraph, metricsData.dataPoints.length);
                        }
                        else {
                            //console.log("Using Large Charts Profile, width: "+ width);
                            //  we use the width already defined above
                            xTicks = 8;
                            xTickSubDivide = 5;
                            chartData = metricsData.dataPoints;
                        }

                        avgFiltered = metricsData.dataPoints.filter(function (d) {
                            if (d.nodata !== 'true') {
                                return d.value;
                            }
                        });
                        avg = d3.mean(avgFiltered.map(function (d) {
                            return d.value;
                        }));
                        peakFiltered = metricsData.dataPoints.filter(function (d) {
                            if (d.nodata !== 'true') {
                                return d.high;
                            }
                        });
                        peak = d3.max(peakFiltered.map(function (d) {
                            return d.high;
                        }));
                        minFiltered = metricsData.dataPoints.filter(function (d) {
                            if (d.nodata !== 'true') {
                                return d.low;
                            }
                        });
                        min = d3.min(minFiltered.map(function (d) {
                            return d.low;
                        }));
                        lowBound = determineLowBound(min);
                        highBound = peak + ((peak - min) * 0.1);
                        oobMax = d3.max(metricsData.dataPoints.map(function (d) {
                            if (typeof d.baselineMax === 'undefined') {
                                return 0;
                            }
                            else {
                                return +d.baselineMax;
                            }
                        }));
                        calcBarWidth = function () {
                            return (width / chartData.length - barOffset  );
                        };

                        yScale = d3.scale.linear()
                            .clamp(true)
                            .rangeRound([height, 0])
                            .domain([d3.min(metricsData.dataPoints, function (d) {
                                return d.low;
                            }), d3.max(metricsData.dataPoints, function (d) {
                                return d.high;
                            })]);

                        yAxis = d3.svg.axis()
                            .scale(yScale)
                            .tickSubdivide(1)
                            .ticks(5)
                            .tickSize(4, 4, 0)
                            .orient("left");


                        timeScale = d3.time.scale()
                            .range([0, width])
                            .domain(d3.extent(chartData, function (d) {
                                return d.timeStamp;
                            }));

                        timeScaleForBrush = d3.time.scale()
                            .range([0, width])
                            .domain(d3.extent(chartData, function (d) {
                                return d.timeStamp;
                            }));

                        xAxis = d3.svg.axis()
                            .scale(timeScale)
                            .ticks(xTicks)
                            .tickSubdivide(xTickSubDivide)
                            .tickSize(4, 4, 0)
                            .orient("bottom");

                        // create the actual chart group
                        chart = d3.select(element[0]).append("svg");

                        defs = chart.append("defs");
                        createSvgDefs(defs);


                        svg = chart.append("g")
                            .attr("width", width + margin.left + margin.right)
                            .attr("height", height + margin.top - titleHeight - titleSpace + margin.bottom)
                            .attr("transform", "translate(" + margin.left + "," + (+titleHeight + titleSpace + margin.top) + ")");

                        context = svg.append("g")
                            .attr("class", "context")
                            .attr("width", width + margin.left + margin.right)
                            .attr("height", 210)
                            .attr("transform", "translate(" + margin2.left + "," + (+titleHeight + titleSpace + margin.top + 90) + ")");

                        console.log("We started the chart");


                    }

                }

                function createSvgDefs(defs) {

                    defs.append("pattern")
                        .attr("id", "noDataStripes")
                        .attr("patternUnits", "userSpaceOnUse")
                        .attr("x", "0")
                        .attr("y", "0")
                        .attr("width", "6")
                        .attr("height", "3")
                        .append("path")
                        .attr("d", "M 0 0 6 0")
                        .attr("style", "stroke:#CCCCCC; fill:none;");

                    defs.append("pattern")
                        .attr("id", "unknownStripes")
                        .attr("patternUnits", "userSpaceOnUse")
                        .attr("x", "0")
                        .attr("y", "0")
                        .attr("width", "6")
                        .attr("height", "3")
                        .attr("style", "stroke:#2E9EC2; fill:none;")
                        .append("path").attr("d", "M 0 0 6 0");

                    defs.append("pattern")
                        .attr("id", "downStripes")
                        .attr("patternUnits", "userSpaceOnUse")
                        .attr("x", "0")
                        .attr("y", "0")
                        .attr("width", "6")
                        .attr("height", "3")
                        .attr("style", "stroke:#ff8a9a; fill:none;")
                        .append("path").attr("d", "M 0 0 6 0");

                }


                function showFullMetricBarHover(d) {

                    var timeFormatter = d3.time.format(chartHoverTimeFormat),
                        dateFormatter = d3.time.format(chartHoverDateFormat),
                        startDate = new Date(+d.timeStamp),
                        metricGraphTooltipDiv = d3.select("#metricGraphTooltip");

                    metricGraphTooltipDiv.style("left", +(d3.event.pageX) + 15 + "px")
                        .style("top", (d3.event.pageY) + "px");

                    metricGraphTooltipDiv.select("#metricGraphTooltipTimeLabel")
                        .text(timeLabel);
                    metricGraphTooltipDiv.select("#metricGraphTooltipTimeValue")
                        .text(timeFormatter(startDate));

                    metricGraphTooltipDiv.select("#metricGraphTooltipDateLabel")
                        .text(dateLabel);
                    metricGraphTooltipDiv.select("#metricGraphTooltipDateValue")
                        .text(dateFormatter(startDate));

                    metricGraphTooltipDiv.select("#metricGraphTooltipDurationLabel")
                        .text(periodLabel);
                    metricGraphTooltipDiv.select("#metricGraphTooltipDurationValue")
                        .text(d.barDuration);

                    metricGraphTooltipDiv.select("#metricGraphTooltipMaxLabel")
                        .text(maxLabel);
                    metricGraphTooltipDiv.select("#metricGraphTooltipMaxValue")
                        .text(d.high.toFixed(1));

                    metricGraphTooltipDiv.select("#metricGraphTooltipAvgLabel")
                        .text(avgLabel);
                    metricGraphTooltipDiv.select("#metricGraphTooltipAvgValue")
                        .text(d.value.toFixed(1));


                    metricGraphTooltipDiv.select("#metricGraphTooltipMinLabel")
                        .text(minLabel);
                    metricGraphTooltipDiv.select("#metricGraphTooltipMinValue")
                        .text(d.low.toFixed(1));


                    //Show the tooltip
                    angular.element('#metricGraphTooltip').show();
                    $timeout(function () {
                        angular.element('#metricGraphTooltip').hide();
                    }, tooltipTimeout);

                }

                function showNoDataBarHover(d) {
                    var timeFormatter = d3.time.format(chartHoverTimeFormat),
                        dateFormatter = d3.time.format(chartHoverDateFormat),
                        startDate = new Date(+d.timeStamp),
                        noDataTooltipDiv = d3.select("#noDataTooltip");

                    noDataTooltipDiv.style("left", +(d3.event.pageX) + 15 + "px")
                        .style("top", (d3.event.pageY) + "px");

                    noDataTooltipDiv.select("#noDataTooltipTimeLabel")
                        .text(timeLabel);
                    noDataTooltipDiv.select("#noDataTooltipTimeValue")
                        .text(timeFormatter(startDate));

                    noDataTooltipDiv.select("#noDataTooltipDateLabel")
                        .text(dateLabel);
                    noDataTooltipDiv.select("#noDataTooltipDateValue")
                        .text(dateFormatter(startDate));

                    noDataTooltipDiv.select("#noDataLabel")
                        .text(noDataLabel);

                    //Show the tooltip
                    angular.element('#noDataTooltip').show();
                    setTimeout(function () {
                        angular.element('#noDataTooltip').hide();
                    }, tooltipTimeout);

                }

                function createStackedBars() {

                    var pixelsOffHeight = 0;

                    // The gray bars at the bottom leading up
                    svg.selectAll("rect.leaderBar")
                        .data(chartData)
                        .enter().append("rect")
                        .attr("class", "leaderBar")
                        .attr("x", function (d) {
                            return timeScale(d.timeStamp);
                        })
                        .attr("y", function (d) {
                            if (d.down || d.unknown || d.nodata) {
                                return yScale(highBound);
                            }
                            else {
                                return yScale(d.low);
                            }
                        })
                        .attr("height", function (d) {
                            if (d.down || d.unknown || d.nodata) {
                                return height - yScale(highBound) - pixelsOffHeight;
                            }
                            else {
                                return height - yScale(d.low) - pixelsOffHeight;
                            }
                        })
                        .attr("width", function () {
                            return  calcBarWidth();
                        })

                        .attr("opacity", ".9")
                        .attr("fill", function (d) {
                            if (d.down || d.unknown || d.nodata) {
                                return  "url(#noDataStripes)";
                            }
                            else {
                                return  "#d3d3d6";
                            }
                        }).on("mouseover", function (d) {
                            if (d.down || d.unknown || d.nodata) {
                                showNoDataBarHover(d);
                            }
                            else {
                                if (+d.high === +d.low) {
                                    showSingleValueMetricBarHover(d);
                                } else {
                                    showFullMetricBarHover(d);
                                }
                            }
                        }).on("mouseout", function (d) {
                            if (d.down || d.unknown || d.nodata) {
                                angular.element('#noDataTooltip').hide();
                            } else {
                                if (+d.high === +d.low) {
                                    angular.element('#singleValueTooltip').hide();
                                } else {
                                    angular.element('#metricGraphTooltip').hide();
                                }
                            }
                        });


                    // upper portion representing avg to high
                    svg.selectAll("rect.high")
                        .data(chartData)
                        .enter().append("rect")
                        .attr("class", "high")
                        .attr("x", function (d) {
                            return timeScale(d.timeStamp);
                        })
                        .attr("y", function (d) {
                            return isNaN(d.high) ? yScale(lowBound) : yScale(d.high);
                        })
                        .attr("height", function (d) {
                            if (d.down || d.unknown || d.nodata) {
                                return 0;
                            }
                            else {
                                return  yScale(d.value) - yScale(d.high);
                            }
                        })
                        .attr("width", function () {
                            return  calcBarWidth();
                        })
                        .attr("data-rhq-value", function (d) {
                            return d.value;
                        })
                        .attr("opacity", 0.9)
                        .on("mouseover", function (d) {
                            showFullMetricBarHover(d);
                        }).on("mouseout", function (d) {
                            if (d.down || d.unknown || d.nodata) {
                                angular.element('#noDataTooltip').hide();
                            } else {
                                angular.element('#metricGraphTooltip').hide();
                            }
                        });


                    // lower portion representing avg to low
                    svg.selectAll("rect.low")
                        .data(chartData)
                        .enter().append("rect")
                        .attr("class", "low")
                        .attr("x", function (d) {
                            return timeScale(d.timeStamp);
                        })
                        .attr("y", function (d) {
                            return isNaN(d.value) ? height : yScale(d.value);
                        })
                        .attr("height", function (d) {
                            if (d.down || d.unknown || d.nodata) {
                                return 0;
                            }
                            else {
                                return  yScale(d.low) - yScale(d.value);
                            }
                        })
                        .attr("width", function () {
                            return  calcBarWidth();
                        })
                        .attr("opacity", 0.9)
                        .on("mouseover", function (d) {
                            showFullMetricBarHover(d);
                        }).on("mouseout", function (d) {
                            if (d.down || d.unknown || d.nodata) {
                                angular.element('#noDataTooltip').hide();
                            } else {
                                angular.element('#metricGraphTooltip').hide();
                            }
                        });

                    function showSingleValueMetricBarHover(d) {
                        var timeFormatter = d3.time.format(chartHoverTimeFormat),
                            dateFormatter = d3.time.format(chartHoverDateFormat),
                            startDate = new Date(+d.timeStamp),
                            singleValueGraphTooltipDiv = d3.select("#singleValueTooltip");

                        singleValueGraphTooltipDiv.style("left", +(d3.event.pageX) + 15 + "px")
                            .style("top", (d3.event.pageY) + "px");

                        singleValueGraphTooltipDiv.select("#singleValueTooltipTimeLabel")
                            .text(timeLabel);
                        singleValueGraphTooltipDiv.select("#singleValueTooltipTimeValue")
                            .text(timeFormatter(startDate));

                        singleValueGraphTooltipDiv.select("#singleValueTooltipDateLabel")
                            .text(dateLabel);
                        singleValueGraphTooltipDiv.select("#singleValueTooltipDateValue")
                            .text(dateFormatter(startDate));

                        singleValueGraphTooltipDiv.select("#singleValueTooltipValueLabel")
                            .text(singleValueLabel);
                        singleValueGraphTooltipDiv.select("#singleValueTooltipValue")
                            .text(d.value.toFixed(1));


                        //Show the tooltip
                        angular.element('#singleValueTooltip').show();
                        setTimeout(function () {
                            angular.element('#singleValueTooltip').hide();
                        }, tooltipTimeout);

                    }


                    // if high == low put a "cap" on the bar to show non-aggregated bar
                    svg.selectAll("rect.singleValue")
                        .data(chartData)
                        .enter().append("rect")
                        .attr("class", "singleValue")
                        .attr("x", function (d) {
                            return timeScale(d.timeStamp);
                        })
                        .attr("y", function (d) {
                            return isNaN(d.value) ? height : yScale(d.value) - 2;
                        })
                        .attr("height", function (d) {
                            if (d.down || d.unknown || d.nodata) {
                                return 0;
                            }
                            else {
                                if (d.low === d.high) {
                                    return  yScale(d.low) - yScale(d.value) + 2;
                                }
                                else {
                                    return  0;
                                }
                            }
                        })
                        .attr("width", function () {
                            return  calcBarWidth();
                        })
                        .attr("opacity", 0.9)
                        .attr("fill", function (d) {
                            if (d.low === d.high) {
                                return  "#50505a";
                            }
                            else {
                                return  "#70c4e2";
                            }
                        }).on("mouseover", function (d) {
                            console.log("*** Raw Value: " + d.value);
                            showSingleValueMetricBarHover(d);
                        }).on("mouseout", function () {
                            angular.element('#singleValueTooltip').hide();
                        });
                }

                function createYAxisGridLines() {
                    // create the y axis grid lines
                    svg.append("g").classed("grid y_grid", true)
                        .call(d3.svg.axis()
                            .scale(yScale)
                            .orient("left")
                            .ticks(10)
                            .tickSize(-width, 0, 0)
                            .tickFormat("")
                    );
                }

                function createXandYAxes() {
                    var xAxisGroup;

                    // xAxis.tickFormat(rhqCommon.getD3CustomTimeFormat(chartContext.chartXaxisTimeFormatHours, chartContext.chartXaxisTimeFormatHoursMinutes));

                    // create x-axis
                    xAxisGroup = svg.append("g")
                        .attr("class", "x axis")
                        .attr("transform", "translate(0," + height + ")")
                        .call(xAxis);

                    xAxisGroup.append("g")
                        .attr("class", "x brush")
                        .call(brush)
                        .selectAll("rect")
                        .attr("y", -6)
                        .attr("height", 30);

                    // create y-axis
                    svg.append("g")
                        .attr("class", "y axis")
                        .call(yAxis)
                        .append("text")
                        .attr("transform", "rotate(-90),translate( -70,-40)")
                        .attr("y", -30)
                        .style("text-anchor", "end")
                        .text(attributes.rhqYaxisUnits === "NONE" ? "" : attributes.rhqYaxisUnits);

                }

                function createAvgLines() {
                    var showBarAvgTrendline = true,
                        barAvgLine = d3.svg.line()
                            .interpolate("linear")
                            .defined(function (d) {
                                return !d.nodata;
                            })
                            .x(function (d) {
                                return timeScale(d.timeStamp) + (calcBarWidth() / 2);
                            })
                            .y(function (d) {
                                if (showBarAvgTrendline) {
                                    return yScale(d.value);
                                }
                                else {
                                    return NaN;
                                }
                            });

                    // Bar avg line
                    svg.append("path")
                        .datum(chartData)
                        .attr("class", "barAvgLine")
                        .attr("fill", "none")
                        .attr("stroke", "#2e376a")
                        .attr("stroke-width", "1.5")
                        .attr("stroke-opacity", ".7")
                        .attr("d", barAvgLine);

                }

                function createOOBLines() {
                    var unitsPercentMultiplier = attributes.rhqYaxisUnits === '%' ? 100 : 1,
                        minBaselineLine = d3.svg.line()
                            .interpolate(interpolation)
                            .x(function (d) {
                                return timeScale(d.timeStamp);
                            })
                            .y(function (d) {
                                return yScale(d.baselineMin * unitsPercentMultiplier);
                            }),
                        maxBaselineLine = d3.svg.line()
                            .interpolate(interpolation)
                            .x(function (d) {
                                return timeScale(d.timeStamp);
                            })
                            .y(function (d) {
                                return yScale(d.baselineMax * unitsPercentMultiplier);
                            });

                    // min baseline Line
                    svg.append("path")
                        .datum(chartData)
                        .attr("class", "minBaselineLine")
                        .attr("fill", "none")
                        .attr("stroke", "purple")
                        .attr("stroke-width", "1")
                        .attr("stroke-dasharray", "20,10,5,5,5,10")
                        .attr("stroke-opacity", ".9")
                        .attr("d", minBaselineLine);

                    // max baseline Line
                    svg.append("path")
                        .datum(chartData)
                        .attr("class", "maxBaselineLine")
                        .attr("fill", "none")
                        .attr("stroke", "orange")
                        .attr("stroke-width", "1")
                        .attr("stroke-dasharray", "20,10,5,5,5,10")
                        .attr("stroke-opacity", ".7")
                        .attr("d", maxBaselineLine);

                }

                function createXAxisBrush() {

                    brush = d3.svg.brush()
                        .x(timeScaleForBrush)
                        .on("brushstart", brushStart)
                        .on("brush", brushMove)
                        .on("brushend", brushEnd);

                    brushGroup = svg.append("g")
                        .attr("class", "brush")
                        .call(brush);

                    brushGroup.selectAll(".resize").append("path");

                    brushGroup.selectAll("rect")
                        .attr("height", height);

                    function brushStart() {
                        svg.classed("selecting", true);
                    }

                    function brushMove() {
                        var s = brush.extent();
                        updateDateRangeDisplay(moment(s[0]), moment(s[1]));
                    }

                    function brushEnd() {
                        var s = brush.extent();
                        var startTime = Math.round(s[0].getTime());
                        var endTime = Math.round(s[1].getTime());
                        svg.classed("selecting", !d3.event.target.empty());
                        // ignore selections less than 1 minute
                        if (endTime - startTime >= 60000) {
                            console.info("Refresh Graph with new Range");
                            updateDateRangeDisplay(moment(s[0]), moment(s[1]));
                        }
                    }

                    function updateDateRangeDisplay(startDate, endDate) {
                        var formattedDateRange = startDate.format(buttonBarDateTimeFormat) + '  -  ' + endDate.format(buttonBarDateTimeFormat);
                        var timeRange = endDate.from(startDate, true);
                        angular.element('.graphDateTimeRangeLabel').text(formattedDateRange + '(' + timeRange + ')');
                    }


                }


                return {
                    // Public API
                    draw: function () {
                        // Guard condition that can occur when a portlet has not been configured yet
                        if (metricsData.dataPoints.length > 0) {

                            determineScale();
                            //createHeader(attributes.rhqChartTitle);

                            createYAxisGridLines();
                            createXAxisBrush();
                            createStackedBars();
                            createXandYAxes();
                            createAvgLines();
                            if (oobMax > 0) {
                                console.debug("OOB Data Exists!");
                                createOOBLines();
                            }
                        }
                    }
                }; // end public closure
            }();

            //if (typeof metricsData.dataPoints !== 'undefined' && metricsData.dataPoints !== null && metricsData.dataPoints.length > 0) {
            metricStackedBarGraph.draw();
            //}
        }

        return {
            link: link,
            restrict: 'EA',
            replace: true,
            scope: { rhqData: '@',
                rhqChartHeight: '@',
                rhqYaxisUnits: '@',
                rhqButtonbarDatetimeFormat: '@',
                rhqTimeLabel: '@',
                rhqDateLabel: '@',
                rhqChartHoverDateFormat: '@',
                rhqChartHoverTimeFormat: '@',
                rhqSingleValueLabel: '@',
                rhqNoDataLabel: '@',
                rhqStartLabel: '@',
                rhqEndLabel: '@',
                rhqDurationLabel: '@',
                rhqMinLabel: '@',
                rhqMaxLabel: '@',
                rhqAvgLabel: '@',
                rhqTooltipTimeout: '@',
                rhqChartTitle: '@'}
        };
    });
