/// <reference path="../../vendor/vendor.d.ts" />

module Directives {
    'use strict';

    angular.module('rhqm.directives')
        .directive('ngEnter', function ():ng.IDirective {
            return function (scope, element, attrs) {
                element.bind("keydown keypress", (event) => {
                    if (event.which === 13) {
                        scope.$apply(function () {
                            scope.$eval(attrs.ngEnter);
                        });

                        event.preventDefault();
                    }
                });
            };
        });

}
