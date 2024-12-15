"use strict";

angular
  .module("minesweeperApp")
  .controller(
    "MinesweeperCtrl",
    function ($scope, Minefield, gameState, $window) {
      $scope.parameters = {
        rows: 10,
        columns: 10,
        mines: 15,
      };

      $scope.restart = function () {
        $scope.minefield = new Minefield(
          parseInt($scope.parameters.rows),
          parseInt($scope.parameters.columns),
          parseInt($scope.parameters.mines)
        );
      };

      $scope.$watch("minefield.state", function (newValue) {
        $scope.$evalAsync(function () {
          if (newValue === gameState.LOST) {
            $window.alert("You Lost!");
          } else if (newValue === gameState.WON) {
            $window.alert("You Won!");
          }
        });
      });

      $scope.restart();
    }
  );
