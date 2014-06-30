'use strict';

describe('Factory: Minefield', function () {
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
          mine: false,
          count: 0
        });
      }
    }

    for (i = 0; i < arr.length; i += 2) {
      game[arr[i]][arr[i + 1]].mine = true;
    }

    return game;
  }

  it('should generate of correct length', function () {
    var game = new Minefield(15, 20, 0).game;
    expect(game.length).toBe(15);
    game.forEach(function (colmuns) {
      expect(colmuns.length).toBe(20);
    });
  });

  it('should generate a field with given parameters', function () {
    var game = mineField(randomArr = [0, 0, 0, 1, 0, 2, 0, 3, 0, 4, 0, 5, 0, 6, 0, 7]);

    new Minefield(10, 10, 8).game.forEach(function (row) {
      row.forEach(function (cell) {
        expect(cell.mine).toEqual(game[cell.coord.row][cell.coord.column].mine);
      });
    });
  });

  it('should try to randomly select again if mine already exist', function () {
    var game = mineField([0, 0, 0, 1, 0, 2, 0, 3, 0, 4, 0, 5, 0, 6, 0, 7]);
    randomArr = [0, 0, 0, 1, 0, 2, 0, 3, 0, 3, 0, 4, 0, 5, 0, 6, 0, 7];

    new Minefield(10, 10, 8).game.forEach(function (row) {
      row.forEach(function (cell) {
        expect(cell.mine).toEqual(game[cell.coord.row][cell.coord.column].mine);
      });
    });
  });

  it('should count for each cell how many mines it has around it', function () {
    var game = mineField(randomArr = [1, 5]);
    game[0][4].count = game[0][5].count = game[0][6].count = 1;
    game[1][4].count = game[1][6].count = 1;
    game[2][4].count = game[2][5].count = game[2][6].count = 1;

    new Minefield(10, 10, 1).game.forEach(function (row) {
      row.forEach(function (cell) {
        expect(cell.mine).toEqual(game[cell.coord.row][cell.coord.column].mine);
        expect(cell.count).toEqual(game[cell.coord.row][cell.coord.column].count);
      });
    });
  });

  it('should not touch cells that are out of boundaries', function () {
    var game = mineField(randomArr = [0, 0, 9, 9]);
    game[0][1].count = game[1][0].count = game[1][1].count = 1;
    game[9][8].count = game[8][8].count = game[8][9].count = 1;

    new Minefield(10, 10, 2).game.forEach(function (row) {
      row.forEach(function (cell) {
        expect(cell.mine).toEqual(game[cell.coord.row][cell.coord.column].mine);
        expect(cell.count).toEqual(game[cell.coord.row][cell.coord.column].count);
      });
    });
  });

  it('should have 8 mines around the single none mine', function () {
    randomArr = [3, 3, 3, 4, 3, 5, 4, 3, 4, 5, 5, 3, 5, 4, 5, 5];
    var game = new Minefield(10, 10, 8).game;
    expect(game[4][4].count).toBe(8);
  });

  it('should reveal the cell', function () {
    randomArr = [4, 4];
    var minefield = new Minefield(10, 10, 1);
    minefield.reveal({row: 4, column: 3});
    expect(minefield.game[4][3].revealed).toBe(true);
  });

  it('should lose if you reveal a mine', inject(function (gameState) {
    randomArr = [4, 4];
    var minefield = new Minefield(10, 10, 1);
    minefield.reveal({row: 4, column: 4});
    expect(minefield.game[4][4].revealed).toBe(true);
    expect(minefield.state).toBe(gameState.LOST);
  }));

  it('should keep revealing if you reveal an empty cell', function () {
    randomArr = [3, 3, 3, 4, 3, 5, 4, 3, 4, 5, 5, 3, 5, 4, 5, 5];
    var minefield = new Minefield(10, 10, 8);
    minefield.reveal({row: 0, column: 0});

    minefield.game.forEach(function (row) {
      row.forEach(function (cell) {
        expect(cell.revealed).toBe(!cell.mine && (cell.coord.row !== 4 || cell.coord.column !== 4));
      });
    });
  });

  it('should win if only mines are still not revealed', inject(function (gameState) {
    randomArr = [3, 3, 3, 4, 3, 5, 4, 3, 4, 5, 5, 3, 5, 4, 5, 5];
    var minefield = new Minefield(10, 10, 8);

    minefield.game.forEach(function (row) {
      row.forEach(function (cell) {
        if ([3, 4, 5].indexOf(cell.coord.row) === -1 && [3, 4, 5].indexOf(cell.coord.column) === -1) {
          minefield.reveal(cell.coord);
        }
        expect(minefield.state).toBe(gameState.PLAYING);
      });
    });
    minefield.reveal({row: 4, column: 4});
    expect(minefield.state).toBe(gameState.WON);
  }));

  it('should flag the cell', function () {
    var minefield = new Minefield(10, 10, 0);
    minefield.flag({row: 4, column: 4});
    expect(minefield.game[4][4].flagged).toBe(true);
  });

  it('should unflag the cell', function () {
    var minefield = new Minefield(10, 10, 0);
    minefield.flag({row: 4, column: 4});
    minefield.flag({row: 4, column: 4});
    expect(minefield.game[4][4].flagged).toBe(false);
  });

  it('should not reveal a flagged cell', function () {
    var minefield = new Minefield(10, 10, 0);
    minefield.flag({row: 4, column: 4});
    minefield.reveal({row: 4, column: 4});
    expect(minefield.game[4][4].revealed).toBe(false);
  });

  it('should not flag a revealed cell', function () {
    var minefield = new Minefield(10, 10, 0);
    minefield.reveal({row: 4, column: 4});
    minefield.flag({row: 4, column: 4});
    expect(minefield.game[4][4].flagged).toBe(false);
  });

  it('should reveal all cells when game is won', function () {
    randomArr = [4, 4];
    var minefield = new Minefield(10, 10, 1);
    minefield.reveal({row: 0, column: 0});

    minefield.game.forEach(function (row) {
      row.forEach(function (cell) {
        expect(cell.revealed).toBe(true);
      });
    });
  });

  it('should reveal all cells when game is lost', function () {
    randomArr = [4, 4];
    var minefield = new Minefield(10, 10, 1);
    minefield.reveal({row: 4, column: 4});

    minefield.game.forEach(function (row) {
      row.forEach(function (cell) {
        expect(cell.revealed).toBe(true);
      });
    });
  });
});
