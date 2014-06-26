'use strict';

angular.module('minesweeperAppInternal')
  .controller('MinesweeperCtrl', function ($scope, Minefield) {
    $scope.minefield = new Minefield(10, 10, 8);
  });
