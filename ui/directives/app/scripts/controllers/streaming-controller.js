'use strict';


/**
 * @ngdoc controller
 * @name InsertMetricsController
 * @param {expression} insertMetricsController
 */
angular.module('chartingApp')
    .controller('StreamingController', ['$scope', '$http', function ($scope, $http) {

        $scope.showOpenGroup = true;

        $scope.streamingInsertData = {
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


    }]);
