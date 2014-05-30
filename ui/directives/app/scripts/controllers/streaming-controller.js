'use strict';


/**
 * @ngdoc controller
 * @name InsertMetricsController
 * @param {expression} insertMetricsController
 */
angular.module('chartingApp')
    .controller('StreamingController', ['$scope', '$http', '$interval', 'baseUrl', function ($scope, $http, $interval, baseUrl) {
        var intervalPromise,
        createRandomValue = function () {

        };
        $scope.refreshIntervals = [
            {"interval": '30s', "rangeInSeconds": 30 },
            {"interval": '1m', "rangeInSeconds": 60 },
            {"interval": '5m', "rangeInSeconds": 5 * 60},
            {"interval": '10m', "rangeInSeconds": 10 * 60},
            {"interval": '30m', "rangeInSeconds": 30 * 60},
            {"interval": '1h', "rangeInSeconds": 60 * 60},
        ];

        $scope.streamingInsertData = {
            timeStamp: moment().valueOf(),
            id: "",
            jsonPayload: "",
            count: 1,
            startNumber: 1,
            endNumber: 100,
            intervalInMinutes: 1,
            lastStreamedValue: 0
        };

        $scope.refreshTimerValue = 30;
        $scope.selectedRefreshInterval = $scope.refreshIntervals[0];

        $scope.start = function () {
            intervalPromise = $interval(function () {
                console.log("Timer has Run! for seconds: " + $scope.refreshTimerValue);
                toastr.success('Starting Streaming Data.');
                $scope.streamingInsertData.count = $scope.streamingInsertData.count + 1;
                $scope.streamingInsertData.lastStreamedValue = 100;
                //$scope.$emit('refreshIntervalChangedEvent', $scope.selectedRefreshInterval);
                // no need to do anything as all we want to do change the interval
            }, $scope.refreshTimerValue * 1000);
            $scope.$on('$destroy', function () {
                console.info('Destroying intervalPromise');
                $interval.cancel(intervalPromise);
            });

        };

        $scope.stop = function () {
            toastr.info('Stopping Streaming Data.');
            console.info('Stop Streaming Data.');
            $interval.cancel(intervalPromise);
        };


    }]);
