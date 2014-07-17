'use strict';

angular.module('minesweeperAppInternal')
  .service('games', function game($resource) {
    var GameResource = $resource('/_api/minesweeper/game/:gameId', {gameId: '@id'});

    this.list = function () {
      var list = GameResource.query();
      list.$add = function (game) {
        return (new GameResource(game)).$save();
      };
      return list;
    };

    this.get = function (gameId) {
      var game = GameResource.get({gameId: gameId});
      game.$bind = function (scope, property) {
        return game.$promise.then(function (game) {
          scope[property] = game.minefield;
          scope.$watch(property, function () {
            game.minefield = scope[property];
            game.$save();
          }, true);
          return game.minefield;
        });
      };
      return game;
    };

  });
