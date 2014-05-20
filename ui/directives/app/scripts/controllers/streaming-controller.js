'use strict';


/**
 * @ngdoc controller
 * @name InsertMetricsController
 * @param {expression} insertMetricsController
 */
angular.module('chartingApp')
    .controller('StreamingController', function ($scope, $http) {

        $scope.showOpenGroup = true;
        $scope.insertData = {
            id: "",
            jsonPayload: ""
        };

        $scope.streamedData = {
            timeStamp: moment().valueOf(),
            id: "CPU1",
            jsonPayload: "",
            count: 1,
            lastStreamedValue: ""
        };


        $scope.start = function () {

        };

        $scope.stop = function () {
        };


    });
