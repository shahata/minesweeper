"use strict";

angular.module("minesweeperApp").directive("onContextmenu", function ($parse) {
  return {
    restrict: "A",
    link: function (scope, element, attrs) {
      var fn = $parse(attrs.onContextmenu);
      element.on("contextmenu", function (e) {
        scope.$apply(function () {
          e.preventDefault();
          fn(scope, { $event: e });
        });
      });
    },
  };
});
