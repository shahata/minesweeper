'use strict';

angular.module('minesweeperAppInternal')
  .controller('MinesweeperCtrl', function ($scope, Minefield, gameState, $window, $translate, $routeParams, games, $location) {
    games.get($routeParams.gameId).$bind($scope, 'minefield').then(function () {
      $scope.minefield = new Minefield($scope.minefield);
    }).catch(function () {
      $location.path('/');
    });

    $scope.$watch('minefield.game[0][0].$reveal', function (newValue) {
      if (!newValue) {
        $scope.minefield = new Minefield($scope.minefield);
      }
    });

    $scope.parameters = {
      rows: 10,
      columns: 10,
      mines: 8
    };

    $scope.restart = function () {
      $scope.minefield = new Minefield(
        parseInt($scope.parameters.rows),
        parseInt($scope.parameters.columns),
        parseInt($scope.parameters.mines));
    };

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
