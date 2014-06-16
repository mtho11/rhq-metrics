'use strict';


/**
 * @ngdoc directive
 * @name rhqmStackedBarChart
 * @param {expression} rhqmStackedBarChart
 */
angular.module('chartingApp')
    .directive('rhqmStackedBarChart', function () {


        function link(scope, element, attributes) {
            console.debug("Draw Metrics Stacked Bar chart for title: " + attributes.chartTitle);

            var dataPoints,
                chartHeight = +attributes.chartHeight || 250,
                timeLabel = attributes.timeLabel || "Time",
                dateLabel = attributes.dateLabel || "Date",
                singleValueLabel = attributes.singleValueLabel || "Raw Value",
                noDataLabel = attributes.noDataLabel || "No Data",
                aggregateLabel = attributes.aggregateLabel || "Aggregate",
                startLabel = attributes.startLabel || "Start",
                endLabel = attributes.endLabel || "End",
                durationLabel = attributes.durationLabel || "Duration",
                minLabel = attributes.minLabel || "Min",
                maxLabel = attributes.maxLabel || "Max",
                avgLabel = attributes.avgLabel || "Avg",
                chartHoverDateFormat = attributes.chartHoverDateFormat || "%m/%d/%y",
                chartHoverTimeFormat = attributes.chartHoverTimeFormat || "%I:%M:%S %p",
                buttonBarDateTimeFormat = attributes.buttonbarDatetimeFormat || "MM/DD/YYYY h:mm a";

            // chart specific vars
            var margin = {top: 10, right: 5, bottom: 5, left: 90},
                margin2 = {top: 150, right: 5, bottom: 5, left: 90},
                width = 750 - margin.left - margin.right,
                adjustedChartHeight = chartHeight - 50,
                height = adjustedChartHeight - margin.top - margin.bottom,
                smallChartThresholdInPixels = 600,
                titleHeight = 30, titleSpace = 10,
                innerChartHeight = height + margin.top - titleHeight - titleSpace + margin.bottom,
                adjustedChartHeight2 = +titleHeight + titleSpace + margin.top,
                barOffset = 2,
                chartData,
                calcBarWidth,
                yScale,
                timeScale,
                yAxis,
                xAxis,
                tip,
                brush,
                brushGroup,
                timeScaleForBrush,
                chart,
                chartParent,
                context,
                svg,
                lowBound,
                newLow = 0,
                highBound,
                avg,
                peak,
                min;

//            if (attributes.data === "") {
//                console.warn("No Data");
//                return;
//            }

            dataPoints = attributes.data;

            console.log("dataPoints-->" + typeof dataPoints);
            console.dir(dataPoints);


            function getChartWidth() {
                //return angular.element("#" + chartContext.chartHandle).width();
                return 760;
            }

            function useSmallCharts() {
                return  getChartWidth() <= smallChartThresholdInPixels;
            }


            function oneTimeChartSetup() {
                console.debug("oneTimeChartSetup");
                // destroy any previous charts
                if (angular.isDefined(chart)) {
                    chartParent.selectAll('*').remove();
                }
                chartParent = d3.select(element[0]);
                chart = chartParent.append("svg");

                createSvgDefs(chart);

                tip = d3.tip()
                    .attr('class', 'd3-tip')
                    .offset([-10, 0])
                    .html(function (d) {
                        return buildHover(d);
                    });

                svg = chart.append("g")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", innerChartHeight)
                    .attr("transform", "translate(" + margin.left + "," + (adjustedChartHeight2) + ")");

                context = svg.append("g")
                    .attr("class", "context")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", chartHeight)
                    .attr("transform", "translate(" + margin2.left + "," + (adjustedChartHeight2 + 90) + ")");

                svg.call(tip);

            }


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

            function setupFilteredData(dataPoints) {
                console.log("SetupFilteredData");
                avg = d3.mean(dataPoints.map(function (d) {
                    return !d.empty ? d.avg : 0;
                }));

                peak = d3.max(dataPoints.map(function (d) {
                    return !d.empty ? d.max : 0;
                }));

                min = d3.min(dataPoints.map(function (d) {
                    return !d.empty ? d.min : 0;
                }));
                lowBound = determineLowBound(min);
                highBound = peak + ((peak - min) * 0.1);
                console.log("Highbound = " + highBound);
                console.log("peak = " + peak);

            }

            function determineScale(dataPoints) {
                var xTicks, xTickSubDivide, numberOfBarsForSmallGraph = 20;
                console.debug(" *** DetermineScale");
                console.debug("dataPoints type: " + typeof dataPoints);
                console.dir(dataPoints);
                console.debug("#dataPoints: " + dataPoints.length);

                if (dataPoints.length > 0) {

                    // if window is too small server up small chart
                    if (useSmallCharts()) {
                        //console.log("Using Small Charts Profile for width: "+getChartWidth());
                        width = 250;
                        xTicks = 3;
                        xTickSubDivide = 2;
                        chartData = dataPoints.slice(dataPoints.length - numberOfBarsForSmallGraph, dataPoints.length);
                    }
                    else {
                        //console.log("Using Large Charts Profile, width: "+ width);
                        //  we use the width already defined above
                        xTicks = 8;
                        xTickSubDivide = 5;
                        chartData = dataPoints;
                    }

                    setupFilteredData(dataPoints);

                    calcBarWidth = function () {
                        return (width / chartData.length - barOffset  );
                    };

                    yScale = d3.scale.linear()
                        .clamp(true)
                        .rangeRound([height, 0])
                        .domain([d3.min(dataPoints, function (d) {
                            return d.min;
                        }), d3.max(dataPoints, function (d) {
                            return d.max;
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
                            return d.timestamp;
                        }));

                    timeScaleForBrush = d3.time.scale()
                        .range([0, width])
                        .domain(d3.extent(chartData, function (d) {
                            return d.timestamp;
                        }));

                    xAxis = d3.svg.axis()
                        .scale(timeScale)
                        .ticks(xTicks)
                        .tickSubdivide(xTickSubDivide)
                        .tickSize(4, 4, 0)
                        .orient("bottom");

                }

            }

            function isEmptyDataBar(d) {
                return  d.empty;
            }

            function isRawMetric(d) {
                return  d.value;
            }


            function buildHover(d) {
                var hover,
                    formattedDateTime = moment(d.timestamp).format(buttonBarDateTimeFormat);

                if (isEmptyDataBar(d)) {
                    // nodata
                    hover = "<div class='chartHover'><small class='chartHoverLabel'>" + noDataLabel + "</small><hr/>" +
                        "<div><small><span class='chartHoverLabel'>Timestamp: </span><span class='chartHoverValue'>" + formattedDateTime + "</span></small></div></div>";
                } else {
                    if (isRawMetric(d)) {
                        // raw single value from raw table
                        hover = "<div class='chartHover'><div><small><span class='chartHoverLabel'>Timestamp: </span><span class='chartHoverValue'>" + formattedDateTime + "</span></small></div><hr/>" +
                            "<div><small><span class='chartHoverLabel'>" + singleValueLabel + "</span><span>: </span><span class='chartHoverValue'>" + d.value + "</span></small> </div></div> ";
                    } else {
                        // aggregate with min/avg/max
                        hover = "<div class='chartHover'><div><small><span class='chartHoverLabel'>Timestamp: </span><span class='chartHoverValue'>" + formattedDateTime + "</span></small></div><hr/>" +
                            "<div><small><span class='chartHoverLabel'>" + maxLabel + "</span><span>: </span><span class='chartHoverValue'>" + d.max + "</span></small> </div> "+
                            "<div><small><span class='chartHoverLabel'>" + avgLabel + "</span><span>: </span><span class='chartHoverValue'>" + d.avg + "</span></small> </div> " +
                            "<div><small><span class='chartHoverLabel'>" + minLabel + "</span><span>: </span><span class='chartHoverValue'>" + d.min + "</span></small> </div></div> ";
                    }
                }
                return hover;

            }

            function createHeader(titleName) {
                var title = chart.append("g").append("rect")
                    .attr("class", "title")
                    .attr("x", 30)
                    .attr("y", margin.top)
                    .attr("height", titleHeight)
                    .attr("width", width + 30 + margin.left)
                    .attr("fill", "none");

                chart.append("text")
                    .attr("class", "titleName")
                    .attr("x", 40)
                    .attr("y", 37)
                    .attr("font-size", "12")
                    .attr("font-weight", "bold")
                    .attr("text-anchor", "left")
                    .text(titleName)
                    .attr("fill", "#003168");

                return title;

            }

            function createSvgDefs(chart) {

                var defs = chart.append("defs");

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


            function createStackedBars(lowBound, highBound) {

                var pixelsOffHeight = 0;

                // The gray bars at the bottom leading up
                svg.selectAll("rect.leaderBar")
                    .data(chartData)
                    .enter().append("rect")
                    .attr("class", "leaderBar")
                    .attr("x", function (d) {
                        return timeScale(d.timestamp);
                    })
                    .attr("y", function (d) {
                        return 0;
//                        if (!isEmptyDataBar(d)) {
//                            console.log("d -->" + highBound);
//                            return yScale(highBound);
//                        }
//                        else {
//                            console.log("d ***" + d.min);
//                            return yScale(d.min);
//                        }
                    })
                    .attr("height", function (d) {
                        if (isEmptyDataBar(d)) {
                            return height - yScale(highBound) - pixelsOffHeight;
                        }
                        else {
                            return height - yScale(d.min) - pixelsOffHeight;
                        }
                    })
                    .attr("width", function () {
                        return  calcBarWidth();
                    })

                    .attr("opacity", ".9")
                    .attr("fill", function (d) {
                        if (isEmptyDataBar(d)) {
                            return  "url(#noDataStripes)";
                        }
                        else {
                            return  "#d3d3d6";
                        }
                    }).on("mouseover", function (d) {
                        tip.show(d);
                    }).on("mouseout", function (d) {
                        tip.hide();
                    });


                // upper portion representing avg to high
                svg.selectAll("rect.high")
                    .data(chartData)
                    .enter().append("rect")
                    .attr("class", "high")
                    .attr("x", function (d) {
                        return timeScale(d.timestamp);
                    })
                    .attr("y", function (d) {
                        return isNaN(d.max) ? yScale(lowBound) : yScale(d.max);
                    })
                    .attr("height", function (d) {
                        if (isEmptyDataBar(d)) {
                            return 0;
                        }
                        else {
                            return  yScale(d.value) - yScale(d.max);
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
                        tip.show(d);
                    }).on("mouseout", function () {
                        tip.hide();
                    });


                // lower portion representing avg to low
                svg.selectAll("rect.low")
                    .data(chartData)
                    .enter().append("rect")
                    .attr("class", "low")
                    .attr("x", function (d) {
                        return timeScale(d.timestamp);
                    })
                    .attr("y", function (d) {
                        return isNaN(d.value) ? height : yScale(d.value);
                    })
                    .attr("height", function (d) {
                        if (isEmptyDataBar(d)) {
                            return 0;
                        }
                        else {
                            return  yScale(d.min) - yScale(d.value);
                        }
                    })
                    .attr("width", function () {
                        return  calcBarWidth();
                    })
                    .attr("opacity", 0.9)
                    .on("mouseover", function (d) {
                        tip.show(d);
                    }).on("mouseout", function () {
                        tip.hide();
                    });

                // if high == low put a "cap" on the bar to show non-aggregated bar
                svg.selectAll("rect.singleValue")
                    .data(chartData)
                    .enter().append("rect")
                    .attr("class", "singleValue")
                    .attr("x", function (d) {
                        return timeScale(d.timestamp);
                    })
                    .attr("y", function (d) {
                        return isNaN(d.value) ? height : yScale(d.value) - 2;
                    })
                    .attr("height", function (d) {
                        if (isEmptyDataBar(d)) {
                            return 0;
                        }
                        else {
                            if (d.min === d.max) {
                                return  yScale(d.min) - yScale(d.value) + 2;
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
                        if (d.min === d.max) {
                            return  "#50505a";
                        }
                        else {
                            return  "#70c4e2";
                        }
                    }).on("mouseover", function (d) {
                        tip.show(d);
                    }).on("mouseout", function () {
                        tip.hide();
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

                svg.selectAll('g.axis').remove();

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
                    .text(attributes.yAxisUnits === "NONE" ? "" : attributes.yAxisUnits);

            }

            function createAvgLines() {
                var showBarAvgTrendline = true,
                    barAvgLine = d3.svg.line()
                        .interpolate("linear")
                        .defined(function (d) {
                            return !d.empty;
                        })
                        .x(function (d) {
                            return timeScale(d.timestamp) + (calcBarWidth() / 2);
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
                    //publishDateRangeChangeEvent(s[0], s[1]);
                }

                function brushEnd() {
                    var s = brush.extent();
                    var startTime = Math.round(s[0].getTime());
                    var endTime = Math.round(s[1].getTime());
                    svg.classed("selecting", !d3.event.target.empty());
                    // ignore selections less than 1 minute
                    if (endTime - startTime >= 60000) {
                        console.debug("Refresh Graph with new Range");
                        //publishDateRangeChangeEvent(startTime, endTime);
                    }
                }

                function publishDateRangeChangeEvent(startDateTime, endDateTime) {
                    var dateRangeChangedEvent = [startDateTime, endDateTime];
                    $emit('DateRangeChanged', dateRangeChangedEvent);
                    $broadcast('DateRangeChanged', dateRangeChangedEvent);
                }
            }

            scope.$watch('data', function (newValues) {
                console.debug("watcher for rhq chart Data fired");
                if (angular.isDefined(newValues)) {
                    var processedNewValues = angular.fromJson(newValues);
                    console.log("Watcher Values:"+newValues);
                    return scope.render(processedNewValues);
                }
            }, true);


            scope.render = function (dataPoints) {
                if (angular.isDefined(dataPoints)) {
                    oneTimeChartSetup();
                    console.debug(" ** Render for rhq data length of: " + dataPoints.length);
                    determineScale(dataPoints);
                    createHeader(attributes.chartTitle);
                    createYAxisGridLines();
                    createXAxisBrush();
                    createStackedBars(lowBound, highBound);
                    createXandYAxes();
                    createAvgLines();
                }
            };
        }

        return {
            link: link,
            restrict: 'EA',
            replace: true,
            scope: {
                data: '@',
                chartHeight: '@',
                yAxisUnits: '@',
                buttonbarDatetimeFormat: '@',
                timeLabel: '@',
                dateLabel: '@',
                chartHoverDateFormat: '@',
                chartHoverTimeFormat: '@',
                singleValueLabel: '@',
                noDataLabel: '@',
                aggregateLabel: '@',
                startLabel: '@',
                endLabel: '@',
                durationLabel: '@',
                minLabel: '@',
                maxLabel: '@',
                avgLabel: '@',
                chartTitle: '@'}
        };
    });
