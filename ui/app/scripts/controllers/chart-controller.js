'use strict';


/**
 * @ngdoc controller
 * @name ChartController
 * @param {expression} chartController
 */
angular.module('chartingApp')
    .controller('ChartController', ['$scope', '$http', 'BASE_URL', function ($scope, $http, BASE_URL) {

//        $scope.text = "Angular Rickshaw stuff";
//        $scope.title = "Angular Rickshaw";
//        $scope.inputColor = "steelblue";
//        $scope.graphcolor = "steelblue";
//        $scope.inputHeight = 200;
//        $scope.graphheight = 200;
//        $scope.inputWidth = 200;
//        $scope.graphwidth = 200;
//        $scope.graphIndex = 1;
//        $scope.inputData = 0;
//        $scope.changeColor = function () {
//            if (($scope.inputColor != null) && ($scope.inputColor !== "")) {
//                $scope.graphcolor = $scope.inputColor;
//            }
//        };
//        $scope.addData = function () {
//            if (($scope.inputData != null) && ($scope.inputData !== "")) {
//                $scope.graphdata.push({x: $scope.graphIndex, y: parseInt($scope.inputData, 10)});
//                $scope.graphIndex++;
//            }
//        };


        $scope.restParams = {
            searchId: "",
            endTimeStamp: new Date(),
            startTimeStamp: moment().subtract('hours', 8).toDate() //default time period set to 8 hours
        };


        $scope.refreshChartData = function () {

            console.log("Retrieving metrics data for id: " + $scope.restParams.searchId);
            console.log("Date Range: " + $scope.restParams.startTimeStamp + " - " + $scope.restParams.endTimeStamp);

            $http.get(BASE_URL + '/' + $scope.restParams.searchId,
                {
                    params: {
                        start: moment($scope.restParams.startTimeStamp).valueOf(),
                        end: moment($scope.restParams.endTimeStamp).valueOf(),
                        buckets: 60
                    }
                }
            ).success(function (response) {
                    // we want to isolate the response from the data we are feeding to the chart
                    var bucketizedDataPoints = formatBucketizedOutput(response);

                    if (bucketizedDataPoints.length !== 0) {

                        console.info("# Transformed DataPoints: "+ bucketizedDataPoints.length);
                        console.dir(bucketizedDataPoints);

                        // this is basically the DTO for the chart
                        $scope.chartData = {
                            id: $scope.restParams.id,
                            startTimeStamp: $scope.restParams.startTimeStamp,
                            endTimeStamp: $scope.restParams.endTimeStamp,
                            dataPoints: bucketizedDataPoints
                            //nvd3DataPoints: formatForNvD3(response),
                            //rickshawDataPoints: formatForRickshaw(response)
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

        function formatBucketizedOutput(response){
            //  The schema is different for bucketized output
            var bucketizedDataPoints = $.map(response, function (point) {
                return {
                    timestamp: point.timestamp,
                    date: new Date(point.timestamp),
                    value: angular.isUndefined(point.value)  ? 0 : point.value,
                    avg: (point.empty) ? 0 : point.avg,
                    low: angular.isUndefined(point.low)  ? 0 : point.low,
                    high: angular.isUndefined(point.high)  ? 0 : point.high,
                    empty: point.empty
                };
            });

            return bucketizedDataPoints;
        }

//        function formatForNvD3(dataPoints) {
//
//            // do this for nvd3
//            var nvd3ValuesArray = [];
//            dataPoints.forEach(function (myPoint) {
//                nvd3ValuesArray.push(new Array(myPoint.timestamp, myPoint.value));
//            });
//
//            var nvd3Data = {
//                "key": "Metrics",
//                "values": nvd3ValuesArray
//            };
//
//            return nvd3Data;
//
//        }
//
//        function formatForRickshaw(dataPoints) {
//
//            var rickshawData = $.map(dataPoints, function (point) {
//                return {
//                    "x": point.timestamp,
//                    "y": point.value,
//                };
//            });
//            return rickshawData;
//        }

    }]);
