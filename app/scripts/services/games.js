'use strict';

angular.module('minesweeperAppInternal')
  .value('firebaseUrl', 'https://torid-fire-3995.firebaseio.com/minesweeper')
  .service('games', function games(Firebase, $firebase, firebaseUrl) {
    var baseUrl = firebaseUrl;

    this.list = function () {
      return $firebase(new Firebase(baseUrl));
    };

    this.get = function (gameId) {
      return $firebase(new Firebase(baseUrl + '/' + gameId + '/minefield'));
    };
  });
