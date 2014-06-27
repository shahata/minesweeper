'use strict';

angular.module('minesweeperAppInternal')
  .directive('onContextmenu', function ($parse) {
    return {
      restrict: 'A',
      link: function (scope, element, attrs) {
        var fn = $parse(attrs.onContextmenu);
        element.on('contextmenu', function (e) {
          scope.$apply(function () {
            e.preventDefault();
            if (e.defaultPrevented === undefined) {
              //ugly workaround since preventDefault() is noop in tests
              e.defaultPrevented = true;
            }
            fn(scope, {$event: e});
          });
        });
      }
    };
  });
