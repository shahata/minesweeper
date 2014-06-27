'use strict';

angular.module('minesweeperAppInternal')
  .directive('onContextmenu', function ($parse) {
    return {
      restrict: 'A',
      link: function (scope, element, attrs) {
        var fn = $parse(attrs.onContextmenu);
        element.on('contextmenu', function () {
          scope.$apply(function () {
            fn(scope);
          });
        });
      }
    };
  });
