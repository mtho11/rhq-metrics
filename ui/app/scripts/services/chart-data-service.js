'use strict';

angular.module('chartingApp')
    .factory('chartDataService', function () {
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
            }

        };
    });
