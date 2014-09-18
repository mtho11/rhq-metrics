/// <reference path="../../vendor/vendor.d.ts" />
'use strict';


interface IContextChartDataPoint {
    timestamp: number;
    value: number;
    avg: number;
    empty: boolean;
}

interface IChartDataPoint extends  IContextChartDataPoint{
    date: Date;
    min: number;
    max: number;
}

interface IChartController {
    searchId: string;
    startTimeStamp: Date;
    endTimeStamp: Date;
    dateRange: string;
    updateEndTimeStampToNow: boolean;
    collapseTable: boolean;
    tableButtonLabel:  string;
    showAvgLine: boolean;
    hideHighLowValues:boolean;
    showPreviousRangeDataOverlay: boolean;
    showContextZoom: boolean;
    showAutoRefreshCancel:boolean;
    chartType: string;
    chartTypes: string[];

    showPreviousTimeRange():void;
    showNextTimeRange():void;
    hasNext():boolean;
    toggleTable():void;
    cancelAutoRefresh():void;
    autoRefresh(intervalInSeconds:number):void;
    refreshChartDataNow(startTime:Date):void;
    refreshHistoricalChartData(startDate:Date, endDate:Date):void;
    refreshHistoricalChartDataForTimestamp(startTime?:number, endTime?:number):void;
    overlayPreviousRangeData():void;
    togglePreviousRangeDataOverlay():void;
    toggleContextZoom():void ;
    refreshContextChart():void;
}

interface IDateTimeRangeDropDown {
    range: string;
    rangeInSeconds:number;
}

/**
 * @ngdoc controller
 * @name ChartController
 * @description This controller is responsible for handling activity related to the Chart tab.
 * @param $scope
 * @param $rootScope
 * @param $interval
 * @param $log
 * @param metricDataService
 */
class ChartController implements IChartController {
    public static  $inject = ['$scope', '$rootScope', '$interval', '$log', 'metricDataService' ];


    constructor(private $scope:ng.IScope,
                private $rootScope:ng.IRootScopeService,
                private $interval:ng.IIntervalService,
                private $log:ng.ILogService,
                private metricDataService) {
        $scope.vm = this;
    }

    private updateLastTimeStampToNowPromise:ng.IPromise<number>;
    private bucketedDataPoints:IChartDataPoint[] = [];
    private contextDataPoints:IChartDataPoint[] = [];
    private chartData:any;

    searchId = '';
    startTimeStamp:Date = moment().subtract('hours', 24).toDate(); //default time period set to 24 hours
    endTimeStamp:Date = new Date();
    dateRange:string = moment().subtract('hours', 24).from(moment(), true);
    updateEndTimeStampToNow = false;
    collapseTable = true;
    tableButtonLabel = 'Show Table';
    showAvgLine = true;
    hideHighLowValues = false;
    showPreviousRangeDataOverlay = false;
    showContextZoom = true;
    showAutoRefreshCancel = false;
    chartType = 'bar';
    chartTypes = ['bar', 'line', 'area', 'scatter', 'scatterline', 'candlestick', 'histogram'];

    dateTimeRanges:IDateTimeRangeDropDown[] = [
        { 'range': '1h', 'rangeInSeconds': 60 * 60 } ,
        { 'range': '4h', 'rangeInSeconds': 4 * 60 * 60 } ,
        { 'range': '8h', 'rangeInSeconds': 8 * 60 * 60 },
        { 'range': '12h', 'rangeInSeconds': 12 * 60 * 60 },
        { 'range': '1d', 'rangeInSeconds': 24 * 60 * 60 },
        { 'range': '5d', 'rangeInSeconds': 5 * 24 * 60 * 60 },
        { 'range': '1m', 'rangeInSeconds': 30 * 24 * 60 * 60 },
        { 'range': '3m', 'rangeInSeconds': 3 * 30 * 24 * 60 * 60 },
        { 'range': '6m', 'rangeInSeconds': 6 * 30 * 24 * 60 * 60 }
    ];

//       $rootScope.$on('DateRangeMove', function (event, message) {
//            $log.debug('DateRangeMove on chart Detected.');
//        });
//
//    $rootScope.$on('GraphTimeRangeChangedEvent', function (event, timeRange) {

    // set to the new published time range
//    startTimeStamp = timeRange[0];
//    endTimeStamp = timeRange[1];
//    dateRange = moment(timeRange[0]).from(moment(timeRange[1]));
    //refreshHistoricalChartData(startTimeStamp, endTimeStamp);

    private noDataFoundForId(id:string):void {
        this.$log.warn('No Data found for id: ' + id);
        toastr.warning('No Data found for id: ' + id);
    }

    private calculatePreviousTimeRange(startDate:Date, endDate:Date):any {
        var previousTimeRange:Date[] = [];
        var intervalInMillis = endDate.getTime() - startDate.getTime();

        previousTimeRange.push(new Date(startDate.getTime() - intervalInMillis));
        previousTimeRange.push(startDate);
        return previousTimeRange;
    }

    showPreviousTimeRange():void {
        var previousTimeRange = this.calculatePreviousTimeRange(this.startTimeStamp, this.endTimeStamp);

        this.startTimeStamp = previousTimeRange[0];
        this.endTimeStamp = previousTimeRange[1];
        this.refreshHistoricalChartData(this.startTimeStamp, this.endTimeStamp);

    }


    private calculateNextTimeRange(startDate:Date, endDate:Date):any {
        var nextTimeRange = [];
        var intervalInMillis = endDate.getTime() - startDate.getTime();

        nextTimeRange.push(endDate);
        nextTimeRange.push(new Date(endDate.getTime() + intervalInMillis));
        return nextTimeRange;
    }


    showNextTimeRange():void {
        var nextTimeRange = this.calculateNextTimeRange(this.startTimeStamp, this.endTimeStamp);

        this.startTimeStamp = nextTimeRange[0];
        this.endTimeStamp = nextTimeRange[1];
        this.refreshHistoricalChartData(this.startTimeStamp, this.endTimeStamp);

    }


    hasNext():boolean {
        var nextTimeRange = this.calculateNextTimeRange(this.startTimeStamp, this.endTimeStamp);
        // unsophisticated test to see if there is a next; without actually querying.
        //@fixme: pay the price, do the query!
        return nextTimeRange[1].getTime() < _.now();
    }


    toggleTable():void {
        this.collapseTable = !this.collapseTable;
        if (this.collapseTable) {
            this.tableButtonLabel = 'Show Table';
        } else {
            this.tableButtonLabel = 'Hide Table';
        }
    }


    cancelAutoRefresh():void {
        this.showAutoRefreshCancel = !this.showAutoRefreshCancel;
        this.$interval.cancel(this.updateLastTimeStampToNowPromise);
        toastr.info('Canceling Auto Refresh');
    }

    autoRefresh(intervalInSeconds:number):void {
        toastr.info('Auto Refresh Mode started');
        this.updateEndTimeStampToNow = !this.updateEndTimeStampToNow;
        this.showAutoRefreshCancel = true;
        if (this.updateEndTimeStampToNow) {
            this.refreshHistoricalChartDataForTimestamp();
            this.showAutoRefreshCancel = true;
            this.updateLastTimeStampToNowPromise = this.$interval(function () {
                this.endTimeStamp = new Date();
                this.refreshHistoricalChartData();
            }, intervalInSeconds * 1000);

        } else {
            this.$interval.cancel(this.updateLastTimeStampToNowPromise);
        }

        this.$scope.$on('$destroy', function () {
            this.$interval.cancel(this.updateLastTimeStampToNowPromise);
        });
    }

    refreshChartDataNow(startTime:Date):void {
        this.$rootScope.$broadcast('MultiChartOverlayDataChanged');
        this.endTimeStamp = new Date();
        this.refreshHistoricalChartData(startTime, new Date());
    }

    refreshHistoricalChartData(startDate:Date, endDate:Date):void {
        this.refreshHistoricalChartDataForTimestamp(startDate.getTime(), endDate.getTime());
    }


    refreshHistoricalChartDataForTimestamp(startTime?:number, endTime?:number):void {
        // calling refreshChartData without params use the model values
        if (angular.isUndefined(endTime)) {
            endTime = this.endTimeStamp.getTime();
        }
        if (angular.isUndefined(startTime)) {
            startTime = this.startTimeStamp.getTime();
        }

//
//        if (startTime >= endTime) {
//            $log.warn('Start Date was >= End Date');
//            return;
//        }

        if (this.searchId !== '') {

            this.metricDataService.getMetricsForTimeRange(this.searchId, startTime, endTime)
                .then(function (response) {
                    // we want to isolate the response from the data we are feeding to the chart
                    this.bucketedDataPoints = this.formatBucketedChartOutput(response);

                    if (this.bucketedDataPoints.length !== 0) {

                        // this is basically the DTO for the chart
                        this.chartData = {
                            id: this.searchId,
                            startTimeStamp: this.startTimeStamp,
                            endTimeStamp: this.endTimeStamp,
                            dataPoints: this.bucketedDataPoints,
                            contextDataPoints: this.contextDataPoints,
                            annotationDataPoints: []
                        };

                    } else {
                        this.noDataFoundForId(this.searchId);
                    }

                }, function (error) {
                    toastr.error('Error Loading Chart Data: ' + error);
                });
        }

    }

    private formatBucketedChartOutput(response):IChartDataPoint[] {
        //  The schema is different for bucketed output
        return _.map(response, function (point:IChartDataPoint) {
            return {
                timestamp: point.timestamp,
                date: new Date(point.timestamp),
                value: !angular.isNumber(point.value) ? 0 : point.value,
                avg: (point.empty) ? 0 : point.avg,
                min: !angular.isNumber(point.min) ? 0 : point.min,
                max: !angular.isNumber(point.max) ? 0 : point.max,
                empty: point.empty
            };
        });
    }


    togglePreviousRangeDataOverlay():void {
        if (this.showPreviousRangeDataOverlay) {
            this.chartData.prevDataPoints = [];
        } else {
            this.overlayPreviousRangeData();
        }
    }


    overlayPreviousRangeData():void {
        var previousTimeRange = this.calculatePreviousTimeRange(this.startTimeStamp, this.endTimeStamp);

        if (this.searchId !== '') {
            this.metricDataService.getMetricsForTimeRange(this.searchId, previousTimeRange[0], previousTimeRange[1])
                .then(function (response) {
                    // we want to isolate the response from the data we are feeding to the chart
                    var prevTimeRangeBucketedDataPoints = this.formatPreviousBucketedOutput(response);

                    if (angular.isDefined(prevTimeRangeBucketedDataPoints) && prevTimeRangeBucketedDataPoints.length !== 0) {

                        // this is basically the DTO for the chart
                        this.chartData = {
                            id: this.searchId,
                            prevStartTimeStamp: previousTimeRange[0],
                            prevEndTimeStamp: previousTimeRange[1],
                            prevDataPoints: prevTimeRangeBucketedDataPoints,
                            dataPoints: this.bucketedDataPoints,
                            contextDataPoints: this.contextDataPoints,
                            annotationDataPoints: []
                        };

                    } else {
                        this.noDataFoundForId(this.searchId);
                    }

                }, function (error) {
                    toastr.error('Error loading Prev Range graph data', 'Status: ' + error);
                });
        }
    }

    private formatPreviousBucketedOutput(response) {
        //  The schema is different for bucketed output
        var mappedNew = _.map(response, function (point:IChartDataPoint, i:number) {
            return {
                timestamp: this.bucketedDataPoints[i].timestamp,
                originalTimestamp: point.timestamp,
                value: !angular.isNumber(point.value) ? 0 : point.value,
                avg: (point.empty) ? 0 : point.avg,
                min: !angular.isNumber(point.min) ? 0 : point.min,
                max: !angular.isNumber(point.max) ? 0 : point.max,
                empty: point.empty
            };
        });
        return mappedNew;
    }


    toggleContextZoom():void {
        if (this.showContextZoom) {
            this.chartData.contextDataPoints = [];
        } else {
            this.refreshContextChart();
        }
    }

    refreshContextChart():void {
        // unsophisticated default time range to avoid DB checking right now
        // @fixme: add a real service to determine unbounded range
        var endTime = _.now(),
            startTime = moment().subtract('months', 24).valueOf();

        console.debug('refreshChartContext');
        if (this.searchId !== '') {
            if (startTime >= endTime) {
                this.$log.warn('Start Date was >= End Date');
                return;
            }

            this.metricDataService.getMetricsForTimeRange(this.searchId, new Date(startTime), new Date(endTime), 300)
                .then(function (response) {

                    this.chartData.contextDataPoints = this.formatContextOutput(response);

                    if (angular.isUndefined(this.chartData.contextDataPoints) || this.chartData.contextDataPoints.length === 0) {
                        this.noDataFoundForId(this.searchId);
                    }

                }, function (error) {
                    toastr.error('Error loading Context graph data', 'Status: ' + error);
                });
        }
    }

    private formatContextOutput(response) {
        //  The schema is different for bucketed output
        return _.map(response, function (point:IChartDataPoint) {
            return {
                timestamp: point.timestamp,
                value: !angular.isNumber(point.value) ? 0 : point.value,
                avg: (point.empty) ? 0 : point.avg,
                empty: point.empty
            };
        });

    }
}

angular.module('chartingApp')
    .controller('ChartController', ChartController);