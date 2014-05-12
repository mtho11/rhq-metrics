'use strict';

angular.module('chartingApp')
    .factory('chartDataService', function ($http) {
        var lowBound,
            newLow = 0,
            highBound,
            avgFiltered,
            avg,
            peak,
            peakFiltered,
            minFiltered,
            min;

        // adjust the min scale so blue low line is not in axis
        function determineLowBound(min) {
            newLow = min;
            if (newLow < 0) {
                return 0;
            }
            else {
                return newLow;
            }
        };

        // Public API here
        return {
            setupFilteredData: function (metricsData) {
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

            },
            getLowBound: function () {
                return lowBound;
            },
            getHighBound: function () {
                return highBound;
            },
            getAverage: function () {
                return avg;
            },

            loadMetricsData: function () {
                console.log("Retrieving metrics data for  ");
                return $http.get('/api/chart-data-large-raw.json').then(function (response) {
                    //console.dir("--> " + this);

                    var newDataPoints = $.map(response.data.dataPoints, function (point) {
                        return {
                            "timeStamp": point.timeStamp,
                            "high": point.value === 'NaN' ? 0 : point.high,
                            "low": point.value === 'NaN' ? 0 : point.low,
                            "value": point.value === 'NaN' ? 0 : point.value,
                            "nodata": point.value === 'NaN'
                        };
                    });
                    console.info("# New DataPoints: " + newDataPoints.length);
                    console.dir(newDataPoints);

                    return {
                        "min": response.data.min,
                        "max": response.data.max,
                        "avg": response.data.avg,
                        "group": response.data.group,
                        "minTimeStamp": response.data.minTimeStamp,
                        "maxTimeStamp": response.data.maxTimeStamp,
                        "barDuration": 0,
                        "baselineMin": 0,
                        "baselineMax": 0,
                        "baseline": 0,
                        "oobHigh": 0,
                        "oobLow": 0,
                        "dataPoints": newDataPoints
                    };
                });
            }
        };
    });
