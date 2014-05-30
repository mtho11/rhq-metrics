'use strict';

angular.module('chartingApp', [ 'ui.bootstrap', 'ui.bootstrap.datetimepicker'])
    .constant('baseUrl', 'http://localhost:8080/rhq-metrics/metrics')
    .config(function ($httpProvider) {
        $httpProvider.defaults.useXDomain = true;
        delete $httpProvider.defaults.headers.common['X-Requested-With'];
    });
