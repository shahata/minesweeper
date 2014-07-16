'use strict';

describe('Service: games', function () {
  var GameResource, $save, deferred;

  beforeEach(function () {
    GameResource = jasmine.createSpy('GameResource').andCallFake(function () {
      this.$save = $save = jasmine.createSpy('$save');
    });

    GameResource.query = jasmine.createSpy('query').andReturn([]);
    GameResource.get = jasmine.createSpy('get').andCallFake(function () {
      inject(function ($q) {
        deferred = $q.defer();
      });
      return {$promise: deferred.promise};
    });

    module('minesweeperAppInternal');
    module({
      $resource: function () {
        return GameResource;
      }
    });
  });

  var games;
  beforeEach(inject(function (_games_) {
    games = _games_;
  }));

  it('should list games', function () {
    expect(games.list().length).toBe(0);
    expect(GameResource.query).toHaveBeenCalled();
  });

  it('should resolve promise after add success', inject(function ($rootScope) {
    var spy = jasmine.createSpy().andCallFake(function (ref) {
      expect(ref.name()).toBe(666);
    });
    games.list().$add({name: 'shahata'}).then(spy);
    $save.calls[0].args[0]({id: 666});
    $rootScope.$digest();
    expect(spy).toHaveBeenCalled();
  }));

  it('should reject promise after add failed', inject(function ($rootScope) {
    var spy = jasmine.createSpy();
    games.list().$add({name: 'shahata'}).catch(spy);
    $save.calls[0].args[1]({error: 666});
    $rootScope.$digest();
    expect(spy).toHaveBeenCalledWith({error: 666});
  }));

  it('should get a game', function () {
    expect(games.get(666)).toEqual({$bind: jasmine.any(Function), $promise: jasmine.any(Object)});
    expect(GameResource.get).toHaveBeenCalledWith({gameId: 666});
  });

  it('should resolve promise after bind success', inject(function ($rootScope) {
    var game = {minefield: 666, $save: jasmine.createSpy('$save')};
    var spy = jasmine.createSpy();
    games.get(666).$bind($rootScope, 'shahata').then(spy);
    deferred.resolve(game);
    $rootScope.$digest();
    expect(spy).toHaveBeenCalledWith(666);
    expect(game.$save).toHaveBeenCalled();
  }));

  it('should watch bound property', inject(function ($rootScope) {
    var game = {minefield: 666, $save: jasmine.createSpy('$save')};
    games.get(666).$bind($rootScope, 'shahata');
    deferred.resolve(game);
    $rootScope.$digest();
    game.$save.reset();

    expect($rootScope.shahata).toBe(666);
    $rootScope.$apply(function () {
      $rootScope.shahata = 999;
    });
    expect(game.minefield).toBe(999);
    expect(game.$save).toHaveBeenCalled();
  }));

  it('should reject promise after bind failed', inject(function ($rootScope) {
    var spy = jasmine.createSpy();
    games.get(666).$bind($rootScope, 'shahata').catch(spy);
    deferred.reject({error: 666});
    $rootScope.$digest();
    expect(spy).toHaveBeenCalledWith({error: 666});
  }));

});
