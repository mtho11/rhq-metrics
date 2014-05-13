'use strict';

angular.module('chartingApp')
    .controller('ChartController', function ($scope, $http) {
        $scope.title = {name: "Raw Metrics Chart"};

        $scope.refreshChartData = function () {

            console.log("Retrieving metrics data for  ");


            $http.get('/rhq-metrics/100/data?start=1398891827116').success(function (response) {
                console.dir("--> " + response);

                var newDataPoints = $.map(response.dataPoints, function (point) {
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

                $scope.chartData = {
                    "min": response.min,
                    "max": response.max,
                    "avg": response.avg,
                    "group": response.group,
                    "startTimeStamp": response.startTimeStamp,
                    "endTimeStamp": response.endTimeStamp,
                    "barDuration": 0,
                    "baselineMin": 0,
                    "baselineMax": 0,
                    "baseline": 0,
                    "oobHigh": 0,
                    "oobLow": 0,
                    "dataPoints": newDataPoints
                };
            }).error(function (data) {
                console.error("Error -->" + data);

            });
        };

    });
