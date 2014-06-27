'use strict';

describe('Controller: MinesweeperCtrl', function () {

  beforeEach(function () {
    module('minesweeperAppInternal');
    module({$window: jasmine.createSpyObj('$window', ['alert'])});
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

  it('should alert that you lost', inject(function (gameState, $window) {
    scope.$apply(function () {
      scope.minefield.state = gameState.LOST;
    });
    expect($window.alert).toHaveBeenCalledWith('You Lost!');
  }));

  it('should alert that you lost', inject(function (gameState, $window) {
    scope.$apply(function () {
      scope.minefield.state = gameState.WON;
    });
    expect($window.alert).toHaveBeenCalledWith('You Won!');
  }));

});
