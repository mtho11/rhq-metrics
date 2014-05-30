'use strict';


/**
 * @ngdoc controller
 * @name ChartController
 * @param {expression} chartController
 */
angular.module('chartingApp')
    .controller('ChartController', ['$scope', '$http', 'baseUrl', function ($scope, $http, baseUrl) {

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
            searchId: "",
            endTimeStamp: new Date(),
            startTimeStamp: moment().subtract('hours', 8).toDate() //default time period set to 8 hours
        };


        $scope.refreshChartData = function () {

            console.log("Retrieving metrics data for id: " + $scope.restParams.searchId);
            console.log("Date Range: " + $scope.restParams.startTimeStamp + " - " + $scope.restParams.endTimeStamp);

            $http.get(baseUrl + '/' + $scope.restParams.searchId,
                {
                    params: {
                        start: moment($scope.restParams.startTimeStamp).valueOf(),
                        end: moment($scope.restParams.endTimeStamp).valueOf()
                    }
                }
            ).success(function (response) {
                    console.dir("--> " + response);

                    var newDataPoints = $.map(response, function (point) {
                        return {
                            "timeStamp": point.timestamp,
                            "value": point.value === 'NaN' ? 0 : point.value
                        };
                    });
                    if (newDataPoints.length !== 0) {

                        console.info("# Transformed DataPoints: " + newDataPoints.length);
                        console.dir(newDataPoints);

                        // this is basically the DTO for the chart
                        $scope.chartData = {
                            "id": $scope.restParams.id,
                            "startTimeStamp": $scope.restParams.startTimeStamp,
                            "endTimeStamp": $scope.restParams.endTimeStamp,
                            "dataPoints": newDataPoints
                        };
                    } else {
                        console.warn('No Data found for id: ' + $scope.restParams.searchId);
                        toastr.warn('No Data found for id: ' + $scope.restParams.searchId);
                    }


                }).error(function (response, status) {
                    console.error('Error loading graph data: ' + response);
                    toastr.error('Error loading graph data', 'Status: ' + status);
                });

        };

    }]);
