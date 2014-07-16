'use strict';

angular.module('minesweeperAppInternal')
  .service('games', function game($resource, $q) {
    var GameResource = $resource('/_api/minesweeper/game/:gameId', {gameId: '@id'});

    this.list = function () {
      var list = GameResource.query();
      list.$add = function (game) {
        var deferred = $q.defer();
        (new GameResource(game)).$save(function (game) {
          deferred.resolve({name: function () {
            return game.id;
          }});
        }, function (response) {
          deferred.reject(response);
        });
        return deferred.promise;
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
