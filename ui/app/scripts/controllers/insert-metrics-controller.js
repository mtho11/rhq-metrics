'use strict';


/**
 * @ngdoc controller
 * @name InsertMetricsController
 * @param {expression} insertMetricsController
 */
angular.module('chartingApp')
    .controller('InsertMetricsController', ['$scope',  'metricDataService', function ($scope,  metricDataService) {

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


        $scope.rangeDurations = [1, 2, 5, 7];

        $scope.rangeInsertData = {
            timeStamp: moment().valueOf(),
            id: "",
            jsonPayload: "",
            startNumber: 1,
            endNumber: 100,
            selectedIntervalInMinutes: $scope.timeIntervalInMinutes[2],
            selectedDuration: $scope.rangeDurations[1]
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

            metricDataService.insertPayload($scope.quickInsertData.id,$scope.quickInsertData.jsonPayload);

        };


        $scope.multiInsert = function () {
            console.info("multi insert for: " + $scope.multiInsertData.id);
            metricDataService.insertPayload($scope.multiInsertData.id,$scope.multiInsertData.jsonPayload);

        };


        $scope.rangeInsert = function () {
            var  jsonPayload,
                currentTimeMoment = moment();

            console.log("range insert for: " + $scope.rangeInsertData.id);
            console.dir($scope.rangeInsertData);

            jsonPayload = calculateTimestamps($scope.rangeInsertData.selectedDuration,
                $scope.rangeInsertData.selectedIntervalInMinutes, currentTimeMoment);
            console.debug("JsonPayload: "+ jsonPayload);
            metricDataService.insertPayload($scope.rangeInsertData.id, jsonPayload);

        };

        function calculateTimestamps(numberOfDays, intervalInMinutes, currentTimeMoment){
            var intervalTimestamps = [], randomValue;

            for(var i = 0; i < numberOfDays * 24* intervalInMinutes; i = i+ intervalInMinutes) {

                console.log("offset minutes: "+i);
                var calculatedTimeInMillis =  currentTimeMoment.subtract('minutes', i).valueOf();
                randomValue = metricDataService.createRandomValue($scope.rangeInsertData.startNumber, $scope.rangeInsertData.endNumber );
                intervalTimestamps.push({timestamp: calculatedTimeInMillis, value : randomValue});
            }
            return angular.toJson(intervalTimestamps);

        }

    }]);
