'use strict';


/**
 * @ngdoc controller
 * @name InsertMetricsController
 * @param {expression} insertMetricsController
 */
angular.module('chartingApp')
    .controller('RangeInsertController', ['$scope', '$http', function ($scope, $http) {

        $scope.showOpenGroup = true;

        $scope.rangeInsertData = {
            timeStamp: moment().valueOf(),
            id: "CPU1",
            jsonPayload: ""
        };


        $scope.rangeInsert = function () {

            console.log("multi insert for: " + $scope.rangeInsertData.id);
            console.info("payload: " + $scope.rangeInsertData.jsonPayload);
            $http({
                    url: 'http://localhost:8080/rhq-metrics/metrics/' + $scope.rangeInsertData.id,
                    method: 'POST',
                    data: $scope.rangeInsertData.jsonPayload
                }
            ).success(function (response, status) {
                    console.debug("POST response: " + status + " --> " + response);
                    toastr.success('Inserted values: ' + $scope.rangeInsertData.jsonPayload, 'Success')
                }).error(function (response, status) {
                    console.error("Error: " + status + " --> " + response);
                    toastr.error('An issue with inserting data has occurred. Please see the console logs. Status: ' + status);
                });
        };


    }]);
