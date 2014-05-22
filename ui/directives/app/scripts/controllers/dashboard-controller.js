'use strict';


/**
 * @ngdoc controller
 * @name ChartController
 * @param {expression} chartController
 */
angular.module('chartingApp')
    .controller('ChartController', function ($scope, $http) {

        $scope.text = "Angular Rickshaw stuff";
        $scope.title = "Angular Rickshaw";
        $scope.inputColor = "steelblue";
        $scope.graphcolor = "steelblue";
        $scope.inputHeight = 100;
        $scope.graphheight = 100;
        $scope.inputWidth = 200;
        $scope.graphwidth = 200;
        $scope.graphdata = [
            {x: 0, y: 0}
        ];
        $scope.graphIndex = 1;
        $scope.inputData = 0;
        $scope.changeColor = function () {
            if (($scope.inputColor != null) && ($scope.inputColor !== "")) {
                $scope.graphcolor = $scope.inputColor;
            }
        };
        $scope.addData = function () {
            if (($scope.inputData != null) && ($scope.inputData !== "")) {
                $scope.graphdata.push({x: $scope.graphIndex, y: parseInt($scope.inputData, 10)});
                $scope.graphIndex++;
            }
        };
        $scope.changeHeight = function () {
            if (($scope.inputHeight != null) && ($scope.inputHeight !== "")) {
                $scope.graphheight = parseInt($scope.inputHeight, 10);
            }
        };
        $scope.changeWidth = function () {
            if (($scope.inputWidth != null) && ($scope.inputWidth !== "")) {
                $scope.graphwidth = parseInt($scope.inputWidth, 10);
            }
        };


        $scope.restParams = {
            searchId: "100",
            endTimeStamp: new Date(),
            startTimeStamp: moment().subtract('hours', 8).toDate() //default time period set to 8 hours
        }

        $scope.refreshChartData = function () {

            console.log("Retrieving metrics data for id: " + $scope.restParams.searchId);
            console.log("Date Range: " + $scope.restParams.startTimeStamp + " - " + $scope.restParams.endTimeStamp);

            $http.get('/rhq-metrics/' + $scope.restParams.searchId,
                {
                    params: {
                        start: moment($scope.restParams.startTimeStamp).valueOf(),
                        end: moment($scope.restParams.endTimeStamp).valueOf()
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
