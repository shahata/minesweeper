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
    for (var i = 0; i < 10; i++) {
      game.push([]);
      for (var j = 0; j < 10; j++) {
        game[i].push({
          row: i,
          column: j,
          mine: arr.indexOf((i * 10) + j) !== -1 ? true : false,
          count: 0
        });
      }
    }
    return game;
  }

  it('should generate of correct length', function () {
    var game = new Minefield(20, 15, 0).game;
    expect(game.length).toBe(15);
    game.forEach(function (colmuns) {
      expect(colmuns.length).toBe(20);
    });
  });

  it('should generate a field with given parameters', function () {
    var game = mineField(randomArr = [0, 1, 2, 3, 4, 5, 6, 7]);

    new Minefield(10, 10, 8).game.forEach(function (columns) {
      columns.forEach(function (value) {
        expect(value.mine).toEqual(game[value.row][value.column].mine);
      });
    });
  });

  it('should try to randomly select again if mine already exist', function () {
    var game = mineField([0, 1, 2, 3, 4, 5, 6, 7]);
    randomArr = [0, 1, 2, 3, 3, 4, 5, 6, 7];

    new Minefield(10, 10, 8).game.forEach(function (columns) {
      columns.forEach(function (value) {
        expect(value.mine).toEqual(game[value.row][value.column].mine);
      });
    });
  });

  it('should count for each cell how many mines it has around it', function () {
    var game = mineField(randomArr = [15]);
    game[0][4].count = game[0][5].count = game[0][6].count = 1;
    game[1][4].count = game[1][6].count = 1;
    game[2][4].count = game[2][5].count = game[2][6].count = 1;

    new Minefield(10, 10, 1).game.forEach(function (columns) {
      columns.forEach(function (value) {
        expect(value.mine).toEqual(game[value.row][value.column].mine);
        expect(value.count).toEqual(game[value.row][value.column].count);
      });
    });
  });

  it('should not touch cells that are out of boundaries', function () {
    var game = mineField(randomArr = [0, 99]);
    game[0][1].count = game[1][0].count = game[1][1].count = 1;
    game[9][8].count = game[8][8].count = game[8][9].count = 1;

    new Minefield(10, 10, 2).game.forEach(function (columns) {
      columns.forEach(function (value) {
        expect(value.mine).toEqual(game[value.row][value.column].mine);
        expect(value.count).toEqual(game[value.row][value.column].count);
      });
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
    expect(game[4][4].count).toBe(8);
  });

  it('should reveal the cell', function () {
    randomArr = [44];
    var minefield = new Minefield(10, 10, 1);
    minefield.reveal(4, 3);
    expect(minefield.game[4][3].revealed).toBe(true);
  });

  it('should lose if you reveal a mine', inject(function (gameState) {
    randomArr = [44];
    var minefield = new Minefield(10, 10, 1);
    minefield.reveal(4, 4);
    expect(minefield.game[4][4].revealed).toBe(true);
    expect(minefield.state).toBe(gameState.LOST);
  }));

  it('should keep revealing if you reveal an empty cell', function () {
    randomArr = [44];
    var minefield = new Minefield(10, 10, 1);
    minefield.reveal(0, 0);

    minefield.game.forEach(function (columns) {
      columns.forEach(function (value) {
        expect(value.revealed).toBe(value.row !== 4 || value.column !== 4);
      });
    });
  });

  it('should win if only mines are still not revealed', inject(function (gameState) {
    randomArr = [33, 34, 35, 43, 45, 53, 54, 55];
    var minefield = new Minefield(10, 10, 8);

    minefield.game.forEach(function (columns) {
      columns.forEach(function (value) {
        if (randomArr.indexOf((value.row * 10) + value.column) === -1 && value.row !== 4 && value.column !== 4) {
          minefield.reveal(value.row, value.column);
        }
        expect(minefield.state).toBe(gameState.PLAYING);
      });
    });
    minefield.reveal(4, 4);
    expect(minefield.state).toBe(gameState.WON);
  }));

  it('should flag the cell', function () {
    var minefield = new Minefield(10, 10, 0);
    minefield.flag(4, 4);
    expect(minefield.game[4][4].flagged).toBe(true);
  });

  it('should unflag the cell', function () {
    var minefield = new Minefield(10, 10, 0);
    minefield.flag(4, 4);
    minefield.flag(4, 4);
    expect(minefield.game[4][4].flagged).toBe(false);
  });

  it('should not reveal a flagged cell', function () {
    var minefield = new Minefield(10, 10, 0);
    minefield.flag(4, 4);
    minefield.reveal(4, 4);
    expect(minefield.game[4][4].revealed).toBe(false);
  });

  it('should not flag a revealed cell', function () {
    var minefield = new Minefield(10, 10, 0);
    minefield.reveal(4, 4);
    minefield.flag(4, 4);
    expect(minefield.game[4][4].flagged).toBe(false);
  });

  it('should reveal all cells when game is won', function () {
    randomArr = [44];
    var minefield = new Minefield(10, 10, 1);
    minefield.reveal(0, 0);

    minefield.game.forEach(function (columns) {
      columns.forEach(function (value) {
        expect(value.revealed).toBe(true);
      });
    });
  });
});
