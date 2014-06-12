'use strict';


/**
 * @ngdoc directive
 * @name rhqmStackedBarChart
 * @param {expression} rhqmStackedBarChart
 */
angular.module('chartingApp')
    .directive('rhqmStackedBarChart', ['chartDataService', function (chartDataService) {
        var  tempData = [{"timestamp":1402500552827,"date":"2014-06-11T15:29:12.827Z","value":0,"avg":0,"low":0,"high":0,"empty":true},{"timestamp":1402501032827,"date":"2014-06-11T15:37:12.827Z","value":0,"avg":0,"low":0,"high":0,"empty":true},{"timestamp":1402501512827,"date":"2014-06-11T15:45:12.827Z","value":0,"avg":0,"low":0,"high":0,"empty":true},{"timestamp":1402501992827,"date":"2014-06-11T15:53:12.827Z","value":0,"avg":0,"low":0,"high":0,"empty":true},{"timestamp":1402502472827,"date":"2014-06-11T16:01:12.827Z","value":0,"avg":0,"low":0,"high":0,"empty":true},{"timestamp":1402502952827,"date":"2014-06-11T16:09:12.827Z","value":0,"avg":0,"low":0,"high":0,"empty":true},{"timestamp":1402503432827,"date":"2014-06-11T16:17:12.827Z","value":0,"avg":0,"low":0,"high":0,"empty":true},{"timestamp":1402503912827,"date":"2014-06-11T16:25:12.827Z","value":0,"avg":0,"low":0,"high":0,"empty":true},{"timestamp":1402504392827,"date":"2014-06-11T16:33:12.827Z","value":0,"avg":0,"low":0,"high":0,"empty":true},{"timestamp":1402504872827,"date":"2014-06-11T16:41:12.827Z","value":0,"avg":0,"low":0,"high":0,"empty":true},{"timestamp":1402505352827,"date":"2014-06-11T16:49:12.827Z","value":0,"avg":0,"low":0,"high":0,"empty":true},{"timestamp":1402505832827,"date":"2014-06-11T16:57:12.827Z","value":0,"avg":0,"low":0,"high":0,"empty":true},{"timestamp":1402506312827,"date":"2014-06-11T17:05:12.827Z","value":0,"avg":0,"low":0,"high":0,"empty":true},{"timestamp":1402506792827,"date":"2014-06-11T17:13:12.827Z","value":0,"avg":0,"low":0,"high":0,"empty":true},{"timestamp":1402507272827,"date":"2014-06-11T17:21:12.827Z","value":0,"avg":0,"low":0,"high":0,"empty":true},{"timestamp":1402507752827,"date":"2014-06-11T17:29:12.827Z","value":0,"avg":0,"low":0,"high":0,"empty":true},{"timestamp":1402508232827,"date":"2014-06-11T17:37:12.827Z","value":0,"avg":0,"low":0,"high":0,"empty":true},{"timestamp":1402508712827,"date":"2014-06-11T17:45:12.827Z","value":0,"avg":0,"low":0,"high":0,"empty":true},{"timestamp":1402509192827,"date":"2014-06-11T17:53:12.827Z","value":0,"avg":0,"low":0,"high":0,"empty":true},{"timestamp":1402509672827,"date":"2014-06-11T18:01:12.827Z","value":0,"avg":18,"low":0,"high":0,"empty":false},{"timestamp":1402510152827,"date":"2014-06-11T18:09:12.827Z","value":0,"avg":0,"low":0,"high":0,"empty":true},{"timestamp":1402510632827,"date":"2014-06-11T18:17:12.827Z","value":0,"avg":0,"low":0,"high":0,"empty":true},{"timestamp":1402511112827,"date":"2014-06-11T18:25:12.827Z","value":0,"avg":0,"low":0,"high":0,"empty":true},{"timestamp":1402511592827,"date":"2014-06-11T18:33:12.827Z","value":0,"avg":0,"low":0,"high":0,"empty":true},{"timestamp":1402512072827,"date":"2014-06-11T18:41:12.827Z","value":0,"avg":0,"low":0,"high":0,"empty":true},{"timestamp":1402512552827,"date":"2014-06-11T18:49:12.827Z","value":0,"avg":0,"low":0,"high":0,"empty":true},{"timestamp":1402513032827,"date":"2014-06-11T18:57:12.827Z","value":0,"avg":0,"low":0,"high":0,"empty":true},{"timestamp":1402513512827,"date":"2014-06-11T19:05:12.827Z","value":0,"avg":12,"low":0,"high":0,"empty":false},{"timestamp":1402513992827,"date":"2014-06-11T19:13:12.827Z","value":0,"avg":0,"low":0,"high":0,"empty":true},{"timestamp":1402514472827,"date":"2014-06-11T19:21:12.827Z","value":0,"avg":0,"low":0,"high":0,"empty":true},{"timestamp":1402514952827,"date":"2014-06-11T19:29:12.827Z","value":0,"avg":0,"low":0,"high":0,"empty":true},{"timestamp":1402515432827,"date":"2014-06-11T19:37:12.827Z","value":0,"avg":0,"low":0,"high":0,"empty":true},{"timestamp":1402515912827,"date":"2014-06-11T19:45:12.827Z","value":0,"avg":0,"low":0,"high":0,"empty":true},{"timestamp":1402516392827,"date":"2014-06-11T19:53:12.827Z","value":0,"avg":0,"low":0,"high":0,"empty":true},{"timestamp":1402516872827,"date":"2014-06-11T20:01:12.827Z","value":0,"avg":0,"low":0,"high":0,"empty":true},{"timestamp":1402517352827,"date":"2014-06-11T20:09:12.827Z","value":0,"avg":0,"low":0,"high":0,"empty":true},{"timestamp":1402517832827,"date":"2014-06-11T20:17:12.827Z","value":0,"avg":0,"low":0,"high":0,"empty":true},{"timestamp":1402518312827,"date":"2014-06-11T20:25:12.827Z","value":0,"avg":14,"low":0,"high":0,"empty":false},{"timestamp":1402518792827,"date":"2014-06-11T20:33:12.827Z","value":0,"avg":0,"low":0,"high":0,"empty":true},{"timestamp":1402519272827,"date":"2014-06-11T20:41:12.827Z","value":0,"avg":0,"low":0,"high":0,"empty":true},{"timestamp":1402519752827,"date":"2014-06-11T20:49:12.827Z","value":0,"avg":0,"low":0,"high":0,"empty":true},{"timestamp":1402520232827,"date":"2014-06-11T20:57:12.827Z","value":0,"avg":0,"low":0,"high":0,"empty":true},{"timestamp":1402520712827,"date":"2014-06-11T21:05:12.827Z","value":0,"avg":0,"low":0,"high":0,"empty":true},{"timestamp":1402521192827,"date":"2014-06-11T21:13:12.827Z","value":0,"avg":0,"low":0,"high":0,"empty":true},{"timestamp":1402521672827,"date":"2014-06-11T21:21:12.827Z","value":0,"avg":0,"low":0,"high":0,"empty":true},{"timestamp":1402522152827,"date":"2014-06-11T21:29:12.827Z","value":0,"avg":0,"low":0,"high":0,"empty":true},{"timestamp":1402522632827,"date":"2014-06-11T21:37:12.827Z","value":0,"avg":0,"low":0,"high":0,"empty":true},{"timestamp":1402523112827,"date":"2014-06-11T21:45:12.827Z","value":0,"avg":0,"low":0,"high":0,"empty":true},{"timestamp":1402523592827,"date":"2014-06-11T21:53:12.827Z","value":0,"avg":0,"low":0,"high":0,"empty":true},{"timestamp":1402524072827,"date":"2014-06-11T22:01:12.827Z","value":0,"avg":0,"low":0,"high":0,"empty":true},{"timestamp":1402524552827,"date":"2014-06-11T22:09:12.827Z","value":0,"avg":0,"low":0,"high":0,"empty":true},{"timestamp":1402525032827,"date":"2014-06-11T22:17:12.827Z","value":0,"avg":0,"low":0,"high":0,"empty":true},{"timestamp":1402525512827,"date":"2014-06-11T22:25:12.827Z","value":0,"avg":0,"low":0,"high":0,"empty":true},{"timestamp":1402525992827,"date":"2014-06-11T22:33:12.827Z","value":0,"avg":0,"low":0,"high":0,"empty":true},{"timestamp":1402526472827,"date":"2014-06-11T22:41:12.827Z","value":0,"avg":0,"low":0,"high":0,"empty":true},{"timestamp":1402526952827,"date":"2014-06-11T22:49:12.827Z","value":0,"avg":0,"low":0,"high":0,"empty":true},{"timestamp":1402527432827,"date":"2014-06-11T22:57:12.827Z","value":0,"avg":0,"low":0,"high":0,"empty":true},{"timestamp":1402527912827,"date":"2014-06-11T23:05:12.827Z","value":0,"avg":0,"low":0,"high":0,"empty":true},{"timestamp":1402528392827,"date":"2014-06-11T23:13:12.827Z","value":0,"avg":0,"low":0,"high":0,"empty":true},{"timestamp":1402528872827,"date":"2014-06-11T23:21:12.827Z","value":0,"avg":0,"low":0,"high":0,"empty":true}]

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
                context,
                svg;

//            if (attributes.data === "") {
//                console.warn("No Data");
//                return;
//            }

            //dataPoints = attributes.data;
            dataPoints = tempData;

            console.log("dataPoints-->"+typeof dataPoints);
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
                // create the actual chart group
                chart = d3.select(element[0]).append("svg");

                createSvgDefs(chart);

                tip = d3.tip()
                    .attr('class', 'd3-tip')
                    .offset([-10, 0])
                    .html(function (d) {
                        return buildHover(d);
                    });


                svg = chart.append("g")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top - titleHeight - titleSpace + margin.bottom)
                    .attr("transform", "translate(" + margin.left + "," + (+titleHeight + titleSpace + margin.top) + ")");

                context = svg.append("g")
                    .attr("class", "context")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", chartHeight)
                    .attr("transform", "translate(" + margin2.left + "," + (+titleHeight + titleSpace + margin.top + 90) + ")");

                svg.call(tip);

            }

            function determineScale(dataPoints) {
                var xTicks, xTickSubDivide, numberOfBarsForSmallGraph = 20;
                console.debug(" *** DetermineScale");
                console.debug("dataPoints type: "+ typeof dataPoints);
                console.dir(dataPoints);
                console.debug("#dataPoints: "+ dataPoints.length);

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

                    chartDataService.setupFilteredData(dataPoints);

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
                return  d.empty ;
            }

            function isRawMetric(d) {
                return  d.value ;
            }

            function buildHover(d) {
                var hover,
                    formattedDateTime = moment(d.timestamp).format(buttonBarDateTimeFormat);

                if (isEmptyDataBar(d)) {
                    // nodata
                    hover = "<small>" + noDataLabel + "</small><hr/>" +
                        '<div><small><span style="color: #d3d3d3;">timestamp: </span>' + '<span>' + formattedDateTime + '</span>' + '</small></div>';
                } else {
                    if (+d.max === +d.min) {
                        // raw single value from raw table
                        hover = '<div><small><span style="color: #d3d3d3;">timestamp: </span>' + '<span>' + formattedDateTime + '</span>' + '</small></div><hr/>' +
                            '<div><small><span style="color: #d3d3d3;">' + singleValueLabel + '</span><span>: </span><span>' + d.value + '</span></small> </div> ';
                    } else {
                        //@todo: finish aggregates once in C*
                        // aggregate with min/avg/max
                        hover = "<strong>Aggregate:</strong>";
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
                        if (!isEmptyDataBar(d)) {
                            console.log("d -->" + highBound);
                            return yScale(highBound);
                        }
                        else {
                            console.log("d ***" + d.min);
                            return yScale(d.min);
                        }
                    })
                    .attr("height", function (d) {
                        if (!isEmptyDataBar(d)) {
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

            oneTimeChartSetup();
            determineScale(dataPoints);
            createHeader(attributes.chartTitle);
            createYAxisGridLines();
            createXAxisBrush();
            createStackedBars(chartDataService.getLowBound(), chartDataService.getHighBound());
            createXandYAxes();
            createAvgLines();


            scope.render = function (dataPoints) {
                console.debug(" ** Render for rhq data length of: "+dataPoints.length);
                determineScale(dataPoints);
                createStackedBars(chartDataService.getLowBound(), chartDataService.getHighBound());
            };

            scope.$watch(attributes.data, function () {
                console.debug("watcher for rhq chart Data fired");
                //scope.render(scope.data);
                scope.render(tempData);
            }, true);

//            scope.$watchCollection(attributes.data, function (values) {
//                console.debug("watcher for rhq Data fired for #: "+values.length);
//                dataPoints = values;
//                scope.render(scope.data);
//            } );
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
    }]);
