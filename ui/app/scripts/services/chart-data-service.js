'use strict';

angular.module('chartingApp')
    .factory('chartDataService', function () {
        var lowBound,
            newLow = 0,
            highBound,
            avg,
            peak,
            min;

        // adjust the min scale so blue low line is not in axis
        function determineLowBound(min) {
            newLow = min;
            if (newLow < 0) {
                return 0;
            }
            else {
                return newLow;
            }
        }

        // Public API here
        return {
            setupFilteredData: function (dataPoints) {
                console.log("SetupFilteredData");
                avg = d3.mean(dataPoints.map(function (d) {
                    return d.value;
                }));

                peak = d3.max(dataPoints.map(function (d) {
                    return d.max;
                }));

                min = d3.min(dataPoints.map(function (d) {
                    return d.min;
                }));
                lowBound = determineLowBound(min);
                highBound = peak + ((peak - min) * 0.1);
                console.log("Highbound = "+highBound);
                console.log("peak = "+peak);

            },
            getLowBound: function () {
                return lowBound;
            },
            getHighBound: function () {
                return highBound;
            },
            getAverage: function () {
                return avg;
            }

        };
    });
