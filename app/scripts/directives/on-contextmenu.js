'use strict';

angular.module('minesweeperAppInternal')
  .directive('onContextmenu', function () {
    return {
      template: '<div></div>',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
        element.text('this is the onContextmenu directive');
      }
    };
  });
