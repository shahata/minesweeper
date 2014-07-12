'use strict';

describe('Controller: MinesweeperCtrl', function () {

  beforeEach(function () {
    module('minesweeperAppInternal');
    module({
      $window: jasmine.createSpyObj('$window', ['alert']),
      $translate: angular.identity
    });
    module(function ($provide) {
      $provide.factory('Minefield', function (gameState) {
        return jasmine.createSpy('Minefield').andCallFake(function () {
          this.game = [];
          this.state = gameState.PLAYING;
        });
      });
    });
  });

  var ctrl, scope;

  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ctrl = $controller('MinesweeperCtrl', {
      $scope: scope
    });
  }));

  it('should have a minefield on the scope', inject(function (Minefield) {
    expect(Minefield).toHaveBeenCalledWith(10, 10, 8);
    expect(scope.minefield.game.length).toBe(0);
  }));

  it('should restart with new minefield parameters', inject(function (Minefield) {
    var prev = scope.minefield;
    scope.parameters.rows = 3;
    scope.parameters.columns = 3;
    scope.parameters.mines = 1;

    scope.restart();
    expect(Minefield).toHaveBeenCalledWith(3, 3, 1);
    expect(scope.minefield).not.toBe(prev);
  }));

  it('should alert that you lost', inject(function (gameState, $window) {
    scope.$apply(function () {
      scope.minefield.state = gameState.LOST;
    });
    expect($window.alert).toHaveBeenCalledWith('LOST');
  }));

  it('should alert that you lost', inject(function (gameState, $window) {
    scope.$apply(function () {
      scope.minefield.state = gameState.WON;
    });
    expect($window.alert).toHaveBeenCalledWith('WON');
  }));

  it('should invoke game watcher before alert', inject(function (gameState, $window) {
    var secondlevelWatcher = jasmine.createSpy('secondlevelWatcher');
    scope.$watch('minefield.game[0]', secondlevelWatcher);
    $window.alert.andCallFake(function () {
      expect(secondlevelWatcher).toHaveBeenCalled();
    });
    scope.$apply(function () {
      scope.minefield.game.unshift('a');
      scope.minefield.state = gameState.LOST;
    });
    expect($window.alert).toHaveBeenCalled();
  }));

});
