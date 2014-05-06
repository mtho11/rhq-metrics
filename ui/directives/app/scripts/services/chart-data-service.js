'use strict';

angular.module('chartingApp')
    .factory('chartDataService', function ($http) {

        // Public API here
        return {
            getMetricsData: function () {
                console.log("Retrieving metrics data for  ");
                 return $http.get('/api/chartData.json').then(function (response) {
                    console.dir("--> " + this);

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
