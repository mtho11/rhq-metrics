
/**
 * RHQ-metrics Charting Javascript Functions.
 */
"use strict";


    /**
     * GraphDateContext object constructor.
     * @param startDate moment object representing startDate range
     * @param endDate moment object representing endDate range
     * @constructor
     */
    var GraphDateContext = function (startDate, endDate) {
        if (!(this instanceof GraphDateContext)) {
            throw new Error("GraphDateContext function cannot be called as a function.");
        }
        this.startDate = startDate;
        this.endDate = endDate;
    },
    rhqCommon = (function () {

        var timeFormat = function (formats) {
            return function (date) {
                var i = formats.length - 1, f = formats[i];
                while (!f[1](date)) f = formats[--i];
                return f[0](date);
            };
        };

        return {
            getD3CustomTimeFormat: function (xAxisTimeFormatHours, xAxisTimeFormatHoursMinutes) {
                return  timeFormat([
                    [d3.time.format("%Y"), function () {
                        return true;
                    }],
                    [d3.time.format("%B"), function (d) {
                        return d.getMonth();
                    }],
                    [d3.time.format("%b %d"), function (d) {
                        return d.getDate() != 1;
                    }],
                    [d3.time.format("%a %d"), function (d) {
                        return d.getDay() && d.getDate() != 1;
                    }],
                    [d3.time.format(xAxisTimeFormatHours), function (d) {
                        return d.getHours();
                    }],
                    [d3.time.format(xAxisTimeFormatHoursMinutes), function (d) {
                        return d.getMinutes();
                    }],
                    [d3.time.format(":%S"), function (d) {
                        return d.getSeconds();
                    }],
                    [d3.time.format(".%L"), function (d) {
                        return d.getMilliseconds();
                    }]
                ]);
            }

        };
    })();






