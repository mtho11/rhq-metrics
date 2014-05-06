'use strict';

angular.module('chartingApp')
  .controller('ChartController', function ($scope, chartDataService) {
        $scope.title = {name: "Stacked Bar Chart"};
        $scope.chartData = chartDataService.getMetricsData();

});
