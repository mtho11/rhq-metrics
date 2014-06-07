'use strict';


/**
 * @ngdoc controller
 * @name InsertMetricsController
 * @param {expression} insertMetricsController
 */
angular.module('chartingApp')
    .controller('RangeInsertController', ['$scope',  'metricDataService', function ($scope,  metricDataService) {
        $scope.rangeDurations = [1, 2, 5, 7];

        $scope.rangeInsertData = {
            timeStamp: moment().valueOf(),
            id: "",
            jsonPayload: "",
            startNumber: 1,
            endNumber: 100,
            selectedIntervalInMinutes: $scope.timeIntervalInMinutes[0],
            selectedDuration: $scope.rangeDurations[1]
        };




        $scope.rangeInsert = function () {
            var randomValue;

            console.log("range insert for: " + $scope.rangeInsertData.id);
            console.dir($scope.rangeInsertData);
            console.log("payload: " + $scope.rangeInsertData.jsonPayload);
            randomValue = insertService.createRandomValue($scope.rangeInsertData.startNumber, $scope.rangeInsertData.endNumber);

            metricDataService.insertSingle($scope.rangeInsertData.id, $scope.rangeInsertData.jsonPayload);

        };


    }]);
