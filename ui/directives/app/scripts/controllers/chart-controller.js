'use strict';

angular.module('chartingApp')
    .controller('ChartController', function ($scope, $http) {
        $scope.title = {name: "Raw Metrics Chart"};

        $scope.refreshChartData = function () {

            console.log("Retrieving metrics data for  ");
            return $http.get('/api/chart-data-large-raw.json').success(function (response) {
                console.dir("--> " + response);

                var newDataPoints = $.map(response.dataPoints, function (point) {
                    return {
                        "timeStamp": point.timeStamp,
                        "high": point.value === 'NaN' ? 0 : point.high,
                        "low": point.value === 'NaN' ? 0 : point.low,
                        "value": point.value === 'NaN' ? 0 : point.value,
                        "nodata": point.value === 'NaN'
                    };
                });
                console.info("# New DataPoints: " + newDataPoints.length);
                console.dir(newDataPoints);

                $scope.chartData = {
                    "min": response.min,
                    "max": response.max,
                    "avg": response.avg,
                    "group": response.group,
                    "minTimeStamp": response.minTimeStamp,
                    "maxTimeStamp": response.maxTimeStamp,
                    "barDuration": 0,
                    "baselineMin": 0,
                    "baselineMax": 0,
                    "baseline": 0,
                    "oobHigh": 0,
                    "oobLow": 0,
                    "dataPoints": newDataPoints
                };
            }).error(function (data) {
                console.error("Error -->" + data);

            });
        };

        $scope.chartData = angular.fromJson({"scheduleId": 10006, "min": 1.809696768E10, "avg": 1.9274166101333336E10, "max": 2.2374178816E10, "numDataPoints": 60,
            "dataPoints": [
                {
                    "timeStamp": 1396446795614,
                    "value": 1.8293178368E10,
                    "high": 1.8293178368E10,
                    "low": 1.8293178368E10
                },
                {
                    "timeStamp": 1396447275614,
                    "value": 1.8369118208E10,
                    "high": 1.8369118208E10,
                    "low": 1.8369118208E10
                },
                {
                    "timeStamp": 1396447755614,
                    "value": "NaN",
                    "high": "NaN",
                    "low": "NaN"
                },
                {
                    "timeStamp": 1396448235614,
                    "value": 1.809696768E10,
                    "high": 1.809696768E10,
                    "low": 1.809696768E10
                },
                {
                    "timeStamp": 1396448715614,
                    "value": 1.8200920064E10,
                    "high": 1.8200920064E10,
                    "low": 1.8200920064E10
                },
                {
                    "timeStamp": 1396449195614,
                    "value": 1.8170687488E10,
                    "high": 1.8170687488E10,
                    "low": 1.8170687488E10
                },
                {
                    "timeStamp": 1396449675614,
                    "value": 1.8529398784E10,
                    "high": 1.8529398784E10,
                    "low": 1.8529398784E10
                },
                {
                    "timeStamp": 1396450155614,
                    "value": "NaN",
                    "high": "NaN",
                    "low": "NaN"
                },
                {
                    "timeStamp": 1396450635614,
                    "value": 1.8520727552E10,
                    "high": 1.8520727552E10,
                    "low": 1.8520727552E10
                },
                {
                    "timeStamp": 1396451115614,
                    "value": 1.8629505024E10,
                    "high": 1.8629505024E10,
                    "low": 1.8629505024E10
                },
                {
                    "timeStamp": 1396451595614,
                    "value": 1.8645651456E10,
                    "high": 1.8645651456E10,
                    "low": 1.8645651456E10
                },
                {
                    "timeStamp": 1396452075614,
                    "value": 1.8675892224E10,
                    "high": 1.8675892224E10,
                    "low": 1.8675892224E10
                },
                {
                    "timeStamp": 1396452555614,
                    "value": "NaN",
                    "high": "NaN",
                    "low": "NaN"
                },
                {
                    "timeStamp": 1396453035614,
                    "value": 1.8958303232E10,
                    "high": 1.8958303232E10,
                    "low": 1.8958303232E10
                },
                {
                    "timeStamp": 1396453515614,
                    "value": 1.867964416E10,
                    "high": 1.867964416E10,
                    "low": 1.867964416E10
                },
                {
                    "timeStamp": 1396453995614,
                    "value": 1.9089952768E10,
                    "high": 1.9089952768E10,
                    "low": 1.9089952768E10
                },
                {
                    "timeStamp": 1396454475614,
                    "value": 1.9247640576E10,
                    "high": 1.9247640576E10,
                    "low": 1.9247640576E10
                },
                {
                    "timeStamp": 1396454955614,
                    "value": "NaN",
                    "high": "NaN",
                    "low": "NaN"
                },
                {
                    "timeStamp": 1396455435614,
                    "value": 1.9160342528E10,
                    "high": 1.9160342528E10,
                    "low": 1.9160342528E10
                },
                {
                    "timeStamp": 1396455915614,
                    "value": 1.9189321728E10,
                    "high": 1.9189321728E10,
                    "low": 1.9189321728E10
                },
                {
                    "timeStamp": 1396456395614,
                    "value": 1.9479711744E10,
                    "high": 1.9479711744E10,
                    "low": 1.9479711744E10
                },
                {
                    "timeStamp": 1396456875614,
                    "value": 1.9238432768E10,
                    "high": 1.9238432768E10,
                    "low": 1.9238432768E10
                },
                {
                    "timeStamp": 1396457355614,
                    "value": "NaN",
                    "high": "NaN",
                    "low": "NaN"
                },
                {
                    "timeStamp": 1396457835614,
                    "value": 1.9542061056E10,
                    "high": 1.9542061056E10,
                    "low": 1.9542061056E10
                },
                {
                    "timeStamp": 1396458315614,
                    "value": 1.8980032512E10,
                    "high": 1.8980032512E10,
                    "low": 1.8980032512E10
                },
                {
                    "timeStamp": 1396458795614,
                    "value": 1.9267596288E10,
                    "high": 1.9267596288E10,
                    "low": 1.9267596288E10
                },
                {
                    "timeStamp": 1396459275614,
                    "value": 1.9027529728E10,
                    "high": 1.9027529728E10,
                    "low": 1.9027529728E10
                },
                {
                    "timeStamp": 1396459755614,
                    "value": "NaN",
                    "high": "NaN",
                    "low": "NaN"
                },
                {
                    "timeStamp": 1396460235614,
                    "value": 1.9004694528E10,
                    "high": 1.9004694528E10,
                    "low": 1.9004694528E10
                },
                {
                    "timeStamp": 1396460715614,
                    "value": 1.9078131712E10,
                    "high": 1.9078131712E10,
                    "low": 1.9078131712E10
                },
                {
                    "timeStamp": 1396461195614,
                    "value": 1.9122515968E10,
                    "high": 1.9122515968E10,
                    "low": 1.9122515968E10
                },
                {
                    "timeStamp": 1396461675614,
                    "value": 1.9277635584E10,
                    "high": 1.9277635584E10,
                    "low": 1.9277635584E10
                },
                {
                    "timeStamp": 1396462155614,
                    "value": "NaN",
                    "high": "NaN",
                    "low": "NaN"
                },
                {
                    "timeStamp": 1396462635614,
                    "value": 1.9190452224E10,
                    "high": 1.9190452224E10,
                    "low": 1.9190452224E10
                },
                {
                    "timeStamp": 1396463115614,
                    "value": 1.952483328E10,
                    "high": 1.952483328E10,
                    "low": 1.952483328E10
                },
                {
                    "timeStamp": 1396463595614,
                    "value": 1.9288694784E10,
                    "high": 1.9288694784E10,
                    "low": 1.9288694784E10
                },
                {
                    "timeStamp": 1396464075614,
                    "value": 1.9322650624E10,
                    "high": 1.9322650624E10,
                    "low": 1.9322650624E10
                },
                {
                    "timeStamp": 1396464555614,
                    "value": "NaN",
                    "high": "NaN",
                    "low": "NaN"
                },
                {
                    "timeStamp": 1396465035614,
                    "value": 1.9313360896E10,
                    "high": 1.9313360896E10,
                    "low": 1.9313360896E10
                },
                {
                    "timeStamp": 1396465515614,
                    "value": 1.9373817856E10,
                    "high": 1.9373817856E10,
                    "low": 1.9373817856E10
                },
                {
                    "timeStamp": 1396465995614,
                    "value": 1.9643789312E10,
                    "high": 1.9643789312E10,
                    "low": 1.9643789312E10
                },
                {
                    "timeStamp": 1396466475614,
                    "value": 1.9396829184E10,
                    "high": 1.9396829184E10,
                    "low": 1.9396829184E10
                },
                {
                    "timeStamp": 1396466955614,
                    "value": "NaN",
                    "high": "NaN",
                    "low": "NaN"
                },
                {
                    "timeStamp": 1396467435614,
                    "value": 1.942147072E10,
                    "high": 1.942147072E10,
                    "low": 1.942147072E10
                },
                {
                    "timeStamp": 1396467915614,
                    "value": 1.9521839104E10,
                    "high": 1.9521839104E10,
                    "low": 1.9521839104E10
                },
                {
                    "timeStamp": 1396468395614,
                    "value": 1.9578806272E10,
                    "high": 1.9578806272E10,
                    "low": 1.9578806272E10
                },
                {
                    "timeStamp": 1396468875614,
                    "value": 1.9739705344E10,
                    "high": 1.9739705344E10,
                    "low": 1.9739705344E10
                },
                {
                    "timeStamp": 1396469355614,
                    "value": "NaN",
                    "high": "NaN",
                    "low": "NaN"
                },
                {
                    "timeStamp": 1396469835614,
                    "value": 1.9770564608E10,
                    "high": 1.9770564608E10,
                    "low": 1.9770564608E10
                },
                {
                    "timeStamp": 1396470315614,
                    "value": 1.9689455616E10,
                    "high": 1.9689455616E10,
                    "low": 1.9689455616E10
                },
                {
                    "timeStamp": 1396470795614,
                    "value": 1.9744538624E10,
                    "high": 1.9744538624E10,
                    "low": 1.9744538624E10
                },
                {
                    "timeStamp": 1396471275614,
                    "value": 1.9776503808E10,
                    "high": 1.9776503808E10,
                    "low": 1.9776503808E10
                },
                {
                    "timeStamp": 1396471755614,
                    "value": "NaN",
                    "high": "NaN",
                    "low": "NaN"
                },
                {
                    "timeStamp": 1396472235614,
                    "value": 1.8411565056E10,
                    "high": 1.8411565056E10,
                    "low": 1.8411565056E10
                },
                {
                    "timeStamp": 1396472715614,
                    "value": 1.8550153216E10,
                    "high": 1.8550153216E10,
                    "low": 1.8550153216E10
                },
                {
                    "timeStamp": 1396473195614,
                    "value": 1.9424579584E10,
                    "high": 1.9424579584E10,
                    "low": 1.9424579584E10
                },
                {
                    "timeStamp": 1396473675614,
                    "value": 2.1269118976E10,
                    "high": 2.1269118976E10,
                    "low": 2.1269118976E10
                },
                {
                    "timeStamp": 1396474155614,
                    "value": "NaN",
                    "high": "NaN",
                    "low": "NaN"
                },
                {
                    "timeStamp": 1396474635614,
                    "value": 2.2374178816E10,
                    "high": 2.2374178816E10,
                    "low": 2.2374178816E10
                },
                {
                    "timeStamp": 1396475115614,
                    "value": 2.2357471232E10,
                    "high": 2.2357471232E10,
                    "low": 2.2357471232E10
                }
            ],
            "startTimeStamp": 1396446795614, "endTimeStamp": 1396475115614, "group": false});

    });
