'use strict';


/**
 * @ngdoc controller
 * @name InsertMetricsController
 * @param {expression} insertMetricsController
 */
angular.module('chartingApp')
    .controller('InsertMetricsController', ['$scope', '$http', 'metricDataService', function ($scope, $http, metricDataService) {

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

            metricDataService.insertSingle($scope.quickInsertData.id,$scope.quickInsertData.jsonPayload);

        };


        $scope.multiInsert = function () {
            console.info("multi insert for: " + $scope.multiInsertData.id);

            metricDataService.insertSingle($scope.multiInsertData.id,$scope.multiInsertData.jsonPayload);

        };




    }]);
