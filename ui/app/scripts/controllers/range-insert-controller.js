'use strict';


/**
 * @ngdoc controller
 * @name InsertMetricsController
 * @param {expression} insertMetricsController
 */
angular.module('chartingApp')
    .controller('RangeInsertController', ['$scope', '$http', 'BASE_URL', function ($scope, $http, BASE_URL) {
        $scope.rangeInsertData = {
            timeStamp: moment().valueOf(),
            id: "",
            jsonPayload: "",
            startNumber: 1,
            endNumber: 100,
            selectedIntervalInMinutes: $scope.timeIntervalInMinutes[0]
        };
        
        var createRandomValue = function (min,max) {
            return Math.floor(Math.random()*(max-min+1)+min);
        };
        


        $scope.rangeInsert = function () {

            console.info("multi insert for: " + $scope.rangeInsertData.id);
            console.info("payload: " + $scope.rangeInsertData.jsonPayload);
            $http({
                    url: BASE_URL + '/' + $scope.rangeInsertData.id,
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
