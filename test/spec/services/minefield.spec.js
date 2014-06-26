'use strict';

describe('Service: MinefieldGenerator', function () {
  var Minefield, randomArr;

  beforeEach(function () {
    var randomIndex = 0;
    module('minesweeperAppInternal');
    module({random: function () {
      return randomArr[randomIndex++];
    }});
  });

  beforeEach(inject(function (_Minefield_) {
    Minefield = _Minefield_;
  }));

  function mineField(arr) {
    var game = [];
    for (var i = 0; i < 100; i++) {
      game.push({
        mine: arr.indexOf(i) !== -1 ? true : false,
        count: 0
      });
    }
    return game;
  }

  it('should generate of correct length', function () {
    expect(new Minefield(20, 15, 0).game.length).toBe(300);
  });

  it('should generate a field with given parameters', function () {
    var game = mineField(randomArr = [0, 1, 2, 3, 4, 5, 6, 7]);

    new Minefield(10, 10, 8).game.forEach(function (value, index) {
      expect(value.mine).toEqual(game[index].mine);
    });
  });

  it('should try to randomly select again if mine already exist', function () {
    var game = mineField([0, 1, 2, 3, 4, 5, 6, 7]);
    randomArr = [0, 1, 2, 3, 3, 4, 5, 6, 7];

    new Minefield(10, 10, 8).game.forEach(function (value, index) {
      expect(value.mine).toEqual(game[index].mine);
    });
  });

  it('should count for each cell how many mines it has around it', function () {
    var game = mineField(randomArr = [15]);
    game[4].count = game[5].count = game[6].count = 1;
    game[14].count = game[16].count = 1;
    game[24].count = game[25].count = game[26].count = 1;

    new Minefield(10, 10, 1).game.forEach(function (value, index) {
      expect(value.mine).toEqual(game[index].mine);
      expect(value.count).toEqual(game[index].count);
    });
  });

  it('should not touch overflowing cells', function () {
    var game = mineField(randomArr = [10, 19]);
    game[0].count = game[1].count = game[11].count = game[20].count = game[21].count = 1;
    game[8].count = game[9].count = game[18].count = game[28].count = game[29].count = 1;

    new Minefield(10, 10, 2).game.forEach(function (value, index) {
      expect(value.mine).toEqual(game[index].mine);
      expect(value.count).toEqual(game[index].count);
    });
  });

  it('should not touch cells that are out of boundaries', function () {
    var game = mineField(randomArr = [0, 99]);
    game[1].count = game[10].count = game[11].count = 1;
    game[98].count = game[88].count = game[89].count = 1;

    new Minefield(10, 10, 2).game.forEach(function (value, index) {
      expect(value.mine).toEqual(game[index].mine);
      expect(value.count).toEqual(game[index].count);
    });
  });

  it('should have 8 mines around the single none mine', function () {
    randomArr = [];
    for (var i = 0; i < 100; i++) {
      if (i !== 44) {
        randomArr.push(i);
      }
    }

    var game = new Minefield(10, 10, 99).game;
    expect(game[44].count).toBe(8);
  });

  it('should reveal the mine', function () {
    randomArr = [44];
    var minefield = new Minefield(10, 10, 1);
    minefield.reveal(43);
    expect(minefield.game[43].revealed).toBe(true);
  });
});
