'use strict';

describe('Service: games', function () {

  beforeEach(function () {
    module('minesweeperAppInternal');
    module({
      firebaseUrl: 'firebaseUrl',
      Firebase: function (val) {
        this.ref = 'Firebase(' + val + ')';
      },
      $firebase: function (val) {
        return '$firebase(' + val.ref + ')';
      },
    });
  });

  var games;
  beforeEach(inject(function (_games_) {
    games = _games_;
  }));

  it('should list games', function () {
    expect(games.list()).toBe('$firebase(Firebase(firebaseUrl))');
  });

  it('should get a game', function () {
    expect(games.get('shahar')).toBe('$firebase(Firebase(firebaseUrl/shahar/minefield))');
  });

});
