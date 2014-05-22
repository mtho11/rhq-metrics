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
        $scope.insertData = {
            id: "",
            jsonPayload: ""
        };

        $scope.quickInsert = {
            timeStamp: moment().valueOf(),
            id: "",
            jsonPayload: ""
        };

        $scope.insertData = function () {

            console.log("POSTing data");
            $http({
                    url: 'http://localhost:8080/rhq-metrics/' + $scope.insertData.id + '/data',
                    method: 'POST',
                    data: $scope.insertData.jsonPayload,
                    headers: {
                        'Access-Control-Allow-Headers': 'Content-Type, Content-Length, x-xsrf-token',
                        'Access-Control-Allow-Origin': '*',
                        'Content-Type': 'application/json',
                        'Content-Length': $scope.insertData.jsonPayload}
                }
            ).success(function (response, status) {

                    console.debug("POST response: " + status + " --> " + response);

                });
        }

        $scope.quickInsert = function () {


        }


//        $scope.insertData = function () {
//
//            console.log("POSTing data");
//            $http.post('http://localhost:8080/rhq-metrics/' + $scope.insertData.id + '/data', $scope.insertData.jsonPayload
//            ).success(function (response, status) {
//
//                    console.debug("POST response: " + status + " --> " + response);
//
//                });
//        }

    });
