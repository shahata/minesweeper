'use strict';

angular.module('minesweeperAppInternal')
  .controller('MinesweeperCtrl', function ($scope, Minefield, gameState, $window, $translate) {
    $scope.minefield = new Minefield(10, 10, 8);

    $scope.$watch('minefield.state', function (newValue) {
      $scope.$evalAsync(function () {
        if (newValue === gameState.LOST) {
          $window.alert($translate('LOST'));
        } else if (newValue === gameState.WON) {
          $window.alert($translate('WON'));
        }
      });
    });

  });
