"use strict";

describe("Controller: MinesweeperCtrl", function () {
  var gamePromise, $q;

  beforeEach(function () {
    module("minesweeperApp");
    module({
      $window: jasmine.createSpyObj("$window", ["alert"]),
      $location: jasmine.createSpyObj("$location", ["path"]),
      $translate: angular.identity,
      $routeParams: { gameId: "shahar" },
      Minefield: jasmine.createSpy("Minefield").andCallFake(function () {
        this.game = [[{}]];
      }),
      games: {
        get: function (gameId) {
          expect(gameId).toBe("shahar");
          return {
            $bind: function (scope, property) {
              gamePromise = $q.defer();
              return gamePromise.promise.then(function (result) {
                scope[property] = result;
                return angular.noop;
              });
            },
          };
        },
      },
    });
  });

  var ctrl, scope;

  beforeEach(inject(function ($controller, $rootScope, _$q_) {
    $q = _$q_;
    scope = $rootScope.$new();
    ctrl = $controller("MinesweeperCtrl", {
      $scope: scope,
    });
  }));

  it("should have a minefield on the scope", inject(function (Minefield) {
    gamePromise.resolve("loadedGame");
    scope.$digest();
    expect(Minefield).toHaveBeenCalledWith("loadedGame");
    expect(scope.minefield).toBeInstanceOf(Minefield);
  }));

  it("should navigate back to list on failure", inject(function ($location) {
    gamePromise.reject();
    scope.$digest();
    expect($location.path).toHaveBeenCalledWith("/");
  }));

  it("should restart with new minefield parameters", inject(function (
    Minefield
  ) {
    var prev = scope.minefield;
    scope.parameters.rows = 3;
    scope.parameters.columns = 3;
    scope.parameters.mines = 1;

    scope.restart();
    expect(Minefield).toHaveBeenCalledWith(3, 3, 1);
    expect(scope.minefield).not.toBe(prev);
  }));

  it("should alert that you lost", inject(function (gameState, $window) {
    scope.$apply(function () {
      scope.restart();
      scope.minefield.state = gameState.LOST;
    });
    expect($window.alert).toHaveBeenCalledWith("LOST");
  }));

  it("should alert that you lost", inject(function (gameState, $window) {
    scope.$apply(function () {
      scope.restart();
      scope.minefield.state = gameState.WON;
    });
    expect($window.alert).toHaveBeenCalledWith("WON");
  }));

  it("should invoke game watcher before alert", inject(function (
    gameState,
    $window
  ) {
    var secondlevelWatcher = jasmine.createSpy("secondlevelWatcher");
    scope.$watch("minefield.game[0][0].dummy", secondlevelWatcher);
    $window.alert.andCallFake(function () {
      expect(secondlevelWatcher).toHaveBeenCalled();
    });
    scope.$apply(function () {
      scope.restart();
      scope.minefield.game[0][0].dummy = "a";
      scope.minefield.state = gameState.LOST;
    });
    expect($window.alert).toHaveBeenCalled();
  }));
});
