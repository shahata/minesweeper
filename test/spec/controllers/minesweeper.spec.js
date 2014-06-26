'use strict';

describe('Controller: MinesweeperCtrl', function () {

  beforeEach(function () {
    module('minesweeperAppInternal');
    module(function ($provide) {
      $provide.factory('Minefield', function (gameState) {
        return function () {
          this.game = [];
          this.state = gameState.PLAYING;
          this.reveal = jasmine.createSpy('reveal');
          this.flag = jasmine.createSpy('flag');
        };
      });
    });
  });

  var MinesweeperCtrl, scope;

  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    MinesweeperCtrl = $controller('MinesweeperCtrl', {
      $scope: scope
    });
  }));

  it('should have a minefield on the scope', function () {
    expect(scope.minefield.game.length).toBe(0);
  });
});
