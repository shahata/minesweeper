"use strict";

describe("Service: games", function () {
  var GameResource, deferredSave, deferredGet;

  beforeEach(function () {
    GameResource = jasmine.createSpy("GameResource");

    module("minesweeperApp");
    module({
      $resource: function () {
        return GameResource;
      },
    });

    inject(function ($q) {
      GameResource.andCallFake(function () {
        this.$save = function () {
          deferredSave = $q.defer();
          return deferredSave.promise;
        };
      });
      GameResource.query = jasmine.createSpy("query").andReturn([]);
      GameResource.get = jasmine.createSpy("get").andCallFake(function () {
        deferredGet = $q.defer();
        return { $promise: deferredGet.promise };
      });
    });
  });

  var games;
  beforeEach(inject(function (_games_) {
    games = _games_;
  }));

  it("should list games", function () {
    expect(games.list().length).toBe(0);
    expect(GameResource.query).toHaveBeenCalled();
  });

  it("should resolve promise after add success", inject(function ($rootScope) {
    var spy = jasmine.createSpy();
    games.list().$add({ name: "shahata" }).then(spy);
    deferredSave.resolve({ id: 666 });
    $rootScope.$digest();
    expect(spy).toHaveBeenCalledWith({ id: 666 });
  }));

  it("should reject promise after add failed", inject(function ($rootScope) {
    var spy = jasmine.createSpy();
    games.list().$add({ name: "shahata" }).catch(spy);
    deferredSave.reject({ error: 666 });
    $rootScope.$digest();
    expect(spy).toHaveBeenCalledWith({ error: 666 });
  }));

  it("should get a game", function () {
    expect(games.get(666)).toEqual({
      $bind: jasmine.any(Function),
      $promise: jasmine.any(Object),
    });
    expect(GameResource.get).toHaveBeenCalledWith({ gameId: 666 });
  });

  it("should resolve promise after bind success", inject(function ($rootScope) {
    var game = { minefield: 666, $save: jasmine.createSpy("$save") };
    var spy = jasmine.createSpy();
    games.get(666).$bind($rootScope, "shahata").then(spy);
    deferredGet.resolve(game);
    $rootScope.$digest();
    expect(spy).toHaveBeenCalledWith(666);
    expect(game.$save).toHaveBeenCalled();
  }));

  it("should watch bound property", inject(function ($rootScope) {
    var game = { minefield: 666, $save: jasmine.createSpy("$save") };
    games.get(666).$bind($rootScope, "shahata");
    deferredGet.resolve(game);
    $rootScope.$digest();
    game.$save.reset();

    expect($rootScope.shahata).toBe(666);
    $rootScope.$apply(function () {
      $rootScope.shahata = 999;
    });
    expect(game.minefield).toBe(999);
    expect(game.$save).toHaveBeenCalled();
  }));

  it("should reject promise after bind failed", inject(function ($rootScope) {
    var spy = jasmine.createSpy();
    games.get(666).$bind($rootScope, "shahata").catch(spy);
    deferredGet.reject({ error: 666 });
    $rootScope.$digest();
    expect(spy).toHaveBeenCalledWith({ error: 666 });
  }));
});
