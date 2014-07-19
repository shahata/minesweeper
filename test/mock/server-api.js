/* global URI */
'use strict';

angular.module('minesweeperAppMocks', ['ngMockE2E'])
  .run(function ($httpBackend, $window, Minefield) {
    function u(url) {
      return new URI(url, $window.location);
    }
    function clean(minefield) {
      minefield.game = minefield.game.map(function (row) {
        return row.map(function (cell) {
          return _.omit(cell, _.functions(cell));
        });
      });
      return minefield;
    }
    function parseId(url) {
      return parseInt(url.split('/').reverse()[0], 10);
    }
    var games = [{id: 0, name: 'shahar', minefield: clean(new Minefield(10, 10, 8))}];
    $httpBackend.whenGET(u('/_api/minesweeper/game')).respond(function () {
      return [200, games];
    });
    $httpBackend.whenPOST(u('/_api/minesweeper/game')).respond(function (method, url, data) {
      data = JSON.parse(data);
      data.id = games.length;
      games.push(data);
      return [200, data];
    });
    $httpBackend.whenGET(/\/_api\/minesweeper\/game\/[^\/]*$/).respond(function (method, url) {
      var id = parseId(url);
      return id < games.length ? [200, games[id]] : [404];
    });
    $httpBackend.whenPOST(/\/_api\/minesweeper\/game\/[^\/]*$/).respond(function (method, url, data) {
      var id = parseId(url);
      data = JSON.parse(data);
      return id < games.length ? [200, angular.extend(games[id], data)] : [404];
    });
    $httpBackend.whenGET(/.*/).passThrough();
    $httpBackend.whenPOST(/.*/).passThrough();
    $httpBackend.whenPUT(/.*/).passThrough();
    $httpBackend.whenDELETE(/.*/).passThrough();
  });
