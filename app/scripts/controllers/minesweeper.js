'use strict';

angular.module('minesweeperAppInternal')
  .controller('MinesweeperCtrl', function ($scope, Minefield, gameState, $window) {
    $scope.minefield = new Minefield(10, 10, 8);

    $scope.$watch('minefield.state', function (newValue) {
      if (newValue === gameState.LOST) {
        $window.alert('You Lost!');
      }
    });
  });