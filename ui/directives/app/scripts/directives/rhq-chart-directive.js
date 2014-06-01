'use strict';


/**
 * @ngdoc directive
 * @name metricsStackedBarChart
 * @param {expression} metricsStackedBarChart
 */
angular.module('chartingApp')
    .directive('metricsStackedBarChart', function (chartDataService) {

        function link(scope, element, attributes) {
            console.info("Draw Metrics Stacked Bar chart for title: " + attributes.rhqChartTitle);
            //
            var metricsData,
                chartHeight = +attributes.rhqChartHeight || 250,
                timeLabel = attributes.rhqTimeLabel || "Time",
                dateLabel = attributes.rhqDateLabel || "Date",
                singleValueLabel = attributes.rhqSingleValueLabel || "Raw Value",
                noDataLabel = attributes.rhqNoDataLabel || "No Data",
                aggregateLabel = attributes.rhqAggregateLabel || "Aggregate",
                startLabel = attributes.rhqStartLabel || "Start",
                endLabel = attributes.rhqEndLabel || "End",
                durationLabel = attributes.rhqDurationLabel || "Duration",
                minLabel = attributes.rhqMinLabel || "Min",
                maxLabel = attributes.rhqMaxLabel || "Max",
                avgLabel = attributes.rhqAvgLabel || "Avg",
                chartHoverDateFormat = attributes.rhqChartHoverDateFormat || "%m/%d/%y",
                chartHoverTimeFormat = attributes.rhqChartHoverTimeFormat || "%I:%M:%S %p",
                buttonBarDateTimeFormat = attributes.rhqButtonbarDatetimeFormat || "MM/DD/YYYY h:mm a";

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
                oobMax,
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

            if (attributes.rhqData === "") {
                console.warn("No Data");
                return;
            }

            metricsData = attributes.rhqData;
            console.log("Metrics Data -->");
            console.dir(metricsData);

            function getChartWidth() {
                //return angular.element("#" + chartContext.chartHandle).width();
                return 760;
            }

            function useSmallCharts() {
                return  getChartWidth() <= smallChartThresholdInPixels;
            }


            function oneTimeChartSetup() {
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

                    chartDataService.setupFilteredData(metricsData);

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

            function isNotDataBar(d) {
                return d.down || d.unknown || d.nodata;
            }

            function buildHover(d) {
                var hover,
                    formattedDateTime = moment(d.timestamp).format(buttonBarDateTimeFormat);

                if (isNotDataBar(d)) {
                    // nodata
                    hover = "<small>" + noDataLabel + "</small><hr/>" +
                        '<div><small><span style="color: #d3d3d3;">timestamp: </span>' + '<span>' + formattedDateTime + '</span>' + '</small></div>';
                } else {
                    if (+d.high === +d.low) {
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


            function createStackedBars() {

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
                        if (isNotDataBar(d)) {
                            console.warn("d -->" + chartDataService.getHighBound());
                            return yScale(chartDataService.getHighBound());
                        }
                        else {
                            console.warn("d ***" + d.low);
                            return yScale(d.low);
                        }
                    })
                    .attr("height", function (d) {
                        if (isNotDataBar(d)) {
                            return height - yScale(chartDataService.getHighBound()) - pixelsOffHeight;
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
                        if (isNotDataBar(d)) {
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
                        return isNaN(d.high) ? yScale(chartDataService.getLowBound()) : yScale(d.high);
                    })
                    .attr("height", function (d) {
                        if (isNotDataBar(d)) {
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
                        tip.show(d);
                    }).on("mouseout", function (d) {
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
                        if (isNotDataBar(d)) {
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
                        tip.show(d);
                    }).on("mouseout", function (d) {
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
                        if (isNotDataBar(d)) {
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


            function updateDateRangeDisplay(startDate, endDate) {
                var formattedDateRange = startDate.format(buttonBarDateTimeFormat) + '  -  ' + endDate.format(buttonBarDateTimeFormat);
                var timeRange = endDate.from(startDate, true);
                angular.element('.graphDateTimeRangeLabel').text(formattedDateRange + '  (' + timeRange + ')');
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
                        console.debug("Refresh Graph with new Range");
                        updateDateRangeDisplay(moment(s[0]), moment(s[1]));
                    }
                }
            }

            oneTimeChartSetup();
            determineScale();
            createHeader(attributes.rhqChartTitle);
            createYAxisGridLines();
            createXAxisBrush();
            createStackedBars();
            createXandYAxes();
            createAvgLines();
            updateDateRangeDisplay(moment(metricsData.starttimestamp), moment(metricsData.endtimestamp));


            scope.render = function (rhqData) {
                console.debug("Render for rhq-data length of: "+rhqData.length);
                determineScale();
                createStackedBars();
                updateDateRangeDisplay(moment(metricsData.mintimestamp), moment(metricsData.maxtimestamp));
            };

            scope.$watch('rhqData', function () {
                console.debug("watcher for rhqData fired");
                scope.render(scope.rhqData);
            }, true);

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
                rhqAggregateLabel: '@',
                rhqStartLabel: '@',
                rhqEndLabel: '@',
                rhqDurationLabel: '@',
                rhqMinLabel: '@',
                rhqMaxLabel: '@',
                rhqAvgLabel: '@',
                rhqChartTitle: '@'}
        };
    });
