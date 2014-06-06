'use strict';

angular.module('chartingApp', [ 'ui.bootstrap', 'ui.bootstrap.datetimepicker','nvd3ChartDirectives'])
    .constant('BASE_URL', 'http://localhost:8080/rhq-metrics/metrics')
    .constant('DATE_TIME_FORMAT', 'MM/DD/YYYY h:mm a')
    .config(function ($httpProvider) {
        $httpProvider.defaults.useXDomain = true;
        delete $httpProvider.defaults.headers.common['X-Requested-With'];
    });
