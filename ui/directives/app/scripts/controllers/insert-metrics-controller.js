'use strict';


/**
 * @ngdoc controller
 * @name InsertMetricsController
 * @param {expression} insertMetricsController
 */
angular.module('chartingApp')
    .controller('InsertMetricsController', function ($scope, $http) {

        $scope.insertData = {
            id: "",
            jsonPayload: ""
        }

        $scope.insertData = function () {

            console.log("POSTing data");
            $http({
                    url: 'http://localhost:7474/rhq-metrics/' + $scope.insertData.id + '/data',
                    method: 'POST',
                    data: $scope.insertData.jsonPayload,
                    headers: {'Transfer-Encoding': 'chunked',
                        'Access-Control-Allow-Headers': 'Content-Type, x-xsrf-token',
                        'Content-Type': 'application/json'}
                }
            ).success(function (response, status) {

                    console.debug("POST response: " + status + " --> " + response);

                });
        }

    });
