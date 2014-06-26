'use strict';

angular.module('minesweeperAppInternal')
  .controller('MinesweeperCtrl', function ($scope, Minefield, gameState, $window) {
    $scope.minefield = new Minefield(10, 10, 8);

    $scope.$watch('minefield.state', function (newValue) {
      if (newValue === gameState.LOST) {
        $window.alert('You Lost!');
      } else if (newValue === gameState.WON) {
        $window.alert('You Won!');
      }
    });

    $scope.reveal = function (row, column) {
      $scope.minefield.reveal((row * 10) + column);
    };

    $scope.flag = function (row, column) {
      $scope.minefield.flag((row * 10) + column);
    };
  });
