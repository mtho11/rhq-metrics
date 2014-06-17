'use strict';

angular.module('chartingApp')
    .directive('rickshawChart', function () {

        return {
            restrict: 'E',
            template: '<div></div>',
            replace: true,
            link: function (scope, element, attrs) {
                var graph = null;
                var series = [
                    {
                        color: 'black',
                        data: [
                            {x: 0, y: 0}
                        ]
                    }
                ];

                console.debug("Inside rickshawChart");

                scope.$watch(attrs.color, function (value) {
                    if (graph != null) {
                        graph.series[0].color = value;
                        graph.update();
                    }
                });

                scope.$watch(attrs.height, function (value) {
                    if (graph != null) {
                        graph.setSize({height: value, width: graph.width});
                        graph.update();
                    }
                });

                scope.$watch(attrs.width, function (value) {
                    if (graph != null) {
                        graph.setSize({height: graph.height, width: value});
                        graph.update();
                    }
                });

                scope.$watchCollection(attrs.graphicaldata, function (value) {
                    if (graph != null) {
                        graph.series[0].data = value;
                        graph.update();
                    }
                });

                graph = new Rickshaw.Graph({
                    element: element[0],
                    width: 200,
                    height: 100,
                    series: series
                });
                console.debug("Now lets Render Rickshaw");
                graph.render();
            }
        };
    });
