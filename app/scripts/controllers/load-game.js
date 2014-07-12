'use strict';

angular.module('minesweeperAppInternal')
  .controller('LoadGameCtrl', function ($scope, games, Minefield, $location) {
    $scope.games = games.list();

    $scope.newGame = function (name) {
      $scope.games.$add({name: name, minefield: new Minefield(10, 10, 8)}).then(function (ref) {
        $location.path('/' + ref.name());
      });
    };
  });
