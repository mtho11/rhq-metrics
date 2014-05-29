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

            console.log("multi insert for: " + $scope.multiInsertData.id);
            console.info("payload: " + $scope.multiInsertData.jsonPayload);
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
                    toastr.success('Inserted value: ' + $scope.quickInsertData.value, 'Success')
                }).error(function (response, status) {
                    console.error("Error: " + status + " --> " + response);
                    toastr.error('An issue with inserting data has occurred. Please see the console logs. Status: ' + status);
                });
        };

        $scope.quickInsert = function (numberOfHoursPast) {
            var multiplier, computedTimestamp;

            if (typeof numberOfHoursPast === 'undefined') {
                multiplier = 1;
            } else {
                multiplier = numberOfHoursPast;
            }
            computedTimestamp = moment().subtract('hours', multiplier);
            console.log("Generated Timestamp is: " + computedTimestamp.fromNow());

            $scope.quickInsertData.jsonPayload = { timestamp: computedTimestamp.valueOf(), value: $scope.quickInsertData.value };
            console.info("quick insert for id: " + $scope.quickInsertData.id);
            console.info("payload: " + $scope.quickInsertData.jsonPayload);
            $http.post('http://localhost:8080/rhq-metrics/metrics/' + $scope.quickInsertData.id, $scope.quickInsertData.jsonPayload
            ).success(function (response, status) {
                    console.debug("POST response: " + status + " --> " + response);
                    toastr.success('Inserted value: ' + $scope.quickInsertData.value, 'Success')
                    $scope.quickInsertData.value = "";
                }).error(function (response, status) {
                    console.error("Error: " + status + " --> " + response);
                    toastr.error('An issue with inserting data has occurred. Please see the console logs. Status: ' + status);
                });
        }


    });
