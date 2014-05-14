'use strict';

angular.module('chartingApp')
    .controller('ChartController', function ($scope, $http) {
        $scope.title = {name: "Raw Metrics Chart"};
        $scope.restParams = {
            searchId: "100",
            endTimeStamp: moment(),
            startTimeStamp: moment().subtract('hours', 8) //default time period set to 8 hours
        }

        $scope.refreshChartData = function () {

            console.log("Retrieving metrics data for id: " + $scope.restParams.searchId);
            console.log("Date Range: " + $scope.restParams.startTimeStamp.format() + " - " + $scope.restParams.endTimeStamp.format());

            $http.get('/rhq-metrics/' + $scope.restParams.searchId + '/data',
                {
                    params: {
                        start: $scope.restParams.startTimeStamp.unix(),
                        end: $scope.restParams.endTimeStamp.unix()
                    }
                }
            ).success(function (response) {
                    console.dir("--> " + response);

                    var newDataPoints = $.map(response.data, function (point) {
                        return {
                            "timeStamp": point.timeStamp,
                            "high": point.value === 'NaN' ? 0 : point.high,
                            "low": point.value === 'NaN' ? 0 : point.low,
                            "value": point.value === 'NaN' ? 0 : point.value,
                            "nodata": point.value === 'NaN'
                        };
                    });
                    console.info("# Transformed DataPoints: " + newDataPoints.length);
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
                });

        };

    });
