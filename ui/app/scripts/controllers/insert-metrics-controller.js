'use strict';


/**
 * @ngdoc controller
 * @name InsertMetricsController
 * @param {expression} insertMetricsController
 */
angular.module('chartingApp')
    .controller('InsertMetricsController', ['$scope', '$http', 'baseUrl', function ($scope, $http, baseUrl) {

        $scope.timeIntervalInMinutes = [1, 5, 10, 15, 30, 60];
        $scope.selectedTimeInterval = 5;
        $scope.showOpenGroup = true;

        $scope.quickInsertData = {
            timeStamp: moment().valueOf(),
            id: "",
            jsonPayload: "",
            value: ""
        };

        $scope.multiInsertData = {
            id: "",
            jsonPayload: ""
        };

        $scope.quickInsert = function (numberOfHoursPast) {
            var  computedTimestamp;

            if (angular.isUndefined(numberOfHoursPast)) {
                computedTimestamp = moment();
            } else {
                computedTimestamp = moment().subtract('hours', numberOfHoursPast);
            }
            console.log("Generated Timestamp is: " + computedTimestamp.fromNow());

            $scope.quickInsertData.jsonPayload = { timestamp: computedTimestamp.valueOf(), value: $scope.quickInsertData.value };
            console.info("quick insert for id: " + $scope.quickInsertData.id);

            $http.post(baseUrl + '/' + $scope.quickInsertData.id, $scope.quickInsertData.jsonPayload
            ).success(function () {
                    toastr.success('Inserted<br/>Value: ' + $scope.quickInsertData.value + ",<br/>Time: "+computedTimestamp.fromNow()+ "<br/>ID: "+$scope.quickInsertData.id,
                        'Success')
                    $scope.quickInsertData.value = "";
                }).error(function (response, status) {
                    console.error("Error: " + status + " --> " + response);
                    toastr.error('An issue with inserting data has occurred. Please see the console logs. Status: ' + status);
                });
        };


        $scope.multiInsert = function () {
            console.info("multi insert for: " + $scope.multiInsertData.id);
            $http({
                    url: baseUrl + '/' + $scope.multiInsertData.id,
                    method: 'POST',
                    data: $scope.multiInsertData.jsonPayload
                }
            ).success(function () {
                    toastr.success('Inserted values: ' + $scope.multiInsertData.jsonPayload, 'Success')
                }).error(function (response, status) {
                    console.error("Error: " + status + " --> " + response);
                    toastr.error('An issue with inserting data has occurred. Please see the console logs. Status: ' + status);
                });
        };




    }]);
