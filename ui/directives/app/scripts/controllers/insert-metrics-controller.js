'use strict';


/**
 * @ngdoc controller
 * @name InsertMetricsController
 * @param {expression} insertMetricsController
 */
angular.module('chartingApp')
    .controller('InsertMetricsController', function ($scope, $http) {

        $scope.timeIntervalInMinutes = [1, 5, 10, 15, 30, 60];
        $scope.selectedTimeInterval = 5;
        $scope.showOpenGroup = true;
        $scope.multiInsertData = {
            id: "",
            jsonPayload: ""
        };

        $scope.quickInsertData = {
            timeStamp: moment().valueOf(),
            id: "",
            jsonPayload: "",
            value: ""
        };

        $scope.multiInsert = function () {

            console.log("multi insert for: "+$scope.multiInsertData.id);
            console.info("payload: "+$scope.multiInsertData.jsonPayload);
            $http({
                    url: 'http://localhost:8080/rhq-metrics/metrics/' + $scope.multiInsertData.id,
                    method: 'POST',
                    data: $scope.multiInsertData.jsonPayload,
                    headers: {
                        'Access-Control-Allow-Headers': 'Content-Type, Content-Length, x-xsrf-token',
                        'Access-Control-Allow-Origin': '*',
                        'Content-Type': 'application/json',
                        'Content-Length': $scope.multiInsertData.jsonPayload.length}
                }
            ).success(function (response, status) {
                    console.debug("POST response: " + status + " --> " + response);
                }).error(function (response, status) {
                    console.error("Error: " + status + " --> " + response);
                });
        };

        $scope.quickInsert = function () {
            $scope.quickInsertData.jsonPayload = { timestamp: moment().valueOf(), value: $scope.quickInsertData.value };
            console.info("quick insert for id: "+$scope.quickInsertData.id);
            console.info("payload: "+$scope.quickInsertData.jsonPayload);
            $http.post('http://localhost:8080/rhq-metrics/metrics/' + $scope.quickInsertData.id , $scope.quickInsertData.jsonPayload
            ).success(function (response, status) {
                    console.debug("POST response: " + status + " --> " + response);
                    $scope.quickInsertData.value = "";
                });
        }


    });
