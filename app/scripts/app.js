'use strict';

angular.module('minesweeperAppInternal', []);

angular.module('minesweeperApp', [
  'minesweeperAppInternal',
  'minesweeperTranslations',
  'wixAngular',
  'ngRoute',
  'firebase'
]).config(function ($routeProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'views/load-game.html',
      controller: 'LoadGameCtrl',
    })
    .when('/:gameId', {
      templateUrl: 'views/minesweeper.html',
      controller: 'MinesweeperCtrl'
    })
    .otherwise({
      redirectTo: '/'
    });
});
