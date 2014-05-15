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
            $http.post('/rhq-metrics/' + $scope.insertData.id + '/data', $scope.insertData.jsonPayload
            ).success(function (response, status) {

                    console.debug("POST response: " + status + " --> " + response);

                });
        }

    });
