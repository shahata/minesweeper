'use strict';

describe('Factory: Minefield', function () {
  beforeEach(function () {
    module('minesweeperAppInternal');
    module({minePlanter: jasmine.createSpy('minePlanter')});
  });

  function forEachTile(game, fn) {
    game.forEach(function (row) {
      row.forEach(fn);
    });
  }

  function aMinefield(options) {
    var minefield;
    inject(function (Minefield, minePlanter) {
      options.mines = options.mines || [];
      minePlanter.andReturn(options.mines);
      minefield = new Minefield(
            options.rows    || 12,
            options.columns || 10,
            options.mines.length);
    });
    return minefield;
  }

  it('should have a game board with X rows', function () {
    var game = aMinefield({rows: 12}).game;
    expect(game.length).toBe(12);
  });

  it('should have a game board with Y columns', function () {
    var game = aMinefield({columns: 10}).game;
    game.forEach(function (row) {
      expect(row.length).toBe(10);
    });
  });

  it('should have a game board with Z mines', inject(function (minePlanter) {
    var game = aMinefield({mines: [{row: 0, column: 1}, {row: 1, column: 2}]}).game;
    expect(minePlanter).toHaveBeenCalledWith(12, 10, 2);
    expect(game[0][1].mine).toBe(true);
    expect(game[1][2].mine).toBe(true);
  }));

  it('should mark the number of mines on the mine neighbors', function () {
    var game = aMinefield({rows: 3, columns: 3, mines: [{row: 1, column: 1}]}).game;
    var expectedMine = {row: 1, column: 1};
    forEachTile(game, function (tile) {
      if (!angular.equals(expectedMine, tile.coord)) {
        expect(tile.count).toBe(1);
      }
    });
  });

  it('should mark the number of mines for neighbors of a corner mine', function () {
    var game = aMinefield({rows: 3, columns: 3, mines: [{row: 0, column: 0}]}).game;
    expect(game[1][1].count).toBe(1);
  });

  it('should count the number of mines on a tile that neighbors two mines', function () {
    var game = aMinefield({rows: 3, columns: 3, mines:
      [{row: 0, column: 1}, {row: 1, column: 1}]}).game;
    expect(game[0][0].count).toBe(2);
  });

  it('should reveal the cell', function () {
    var minefield = aMinefield({});
    minefield.reveal({row: 0, column: 0});
    expect(minefield.game[0][0].revealed).toBe(true);
  });

  it('should lose if you reveal a mine', inject(function (gameState) {
    var minefield = aMinefield({mines: [{row: 0, column: 0}]});
    expect(minefield.state).toBe(gameState.PLAYING);
    minefield.reveal({row: 0, column: 0});
    expect(minefield.state).toBe(gameState.LOST);
  }));

  it('should win if only mines are still not revealed', inject(function (gameState) {
    var minefield = aMinefield({mines: [{row: 0, column: 0}]});
    expect(minefield.state).toBe(gameState.PLAYING);
    forEachTile(minefield.game, function (tile) {
      if (!tile.mine) {
        minefield.reveal(tile.coord);
      }
    });
    expect(minefield.state).toBe(gameState.WON);
  }));

  it('should keep revealing if you reveal an empty cell', function () {
    var minefield = aMinefield({rows: 4, columns: 1, mines: [{row: 2, column: 0}]});
    minefield.reveal({row: 0, column: 0});

    forEachTile(minefield.game, function (tile) {
      expect(tile.revealed).toBe(tile.coord.row < 2);
    });
  });

  it('should flag the cell', function () {
    var minefield = aMinefield({});
    minefield.flag({row: 0, column: 0});
    expect(minefield.game[0][0].flagged).toBe(true);
  });

  it('should unflag the cell', function () {
    var minefield = aMinefield({});
    minefield.flag({row: 0, column: 0});
    minefield.flag({row: 0, column: 0});
    expect(minefield.game[0][0].flagged).toBe(false);
  });

  it('should not reveal a flagged cell', function () {
    var minefield = aMinefield({});
    minefield.flag({row: 0, column: 0});
    minefield.reveal({row: 0, column: 0});
    expect(minefield.game[0][0].revealed).toBe(false);
  });

  it('should not flag a revealed cell', function () {
    var minefield = aMinefield({});
    minefield.reveal({row: 0, column: 0});
    minefield.flag({row: 0, column: 0});
    expect(minefield.game[0][0].flagged).toBe(false);
  });

  it('should reveal all cells when game is won', inject(function (gameState) {
    var minefield = aMinefield({mines: [{row: 0, column: 0}]});
    minefield.reveal({row: 0, column: 2});

    forEachTile(minefield.game, function (tile) {
      expect(tile.revealed).toBe(true);
    });
    expect(minefield.state).toBe(gameState.WON);
  }));

  it('should reveal all cells when game is lost', inject(function (gameState) {
    var minefield = aMinefield({mines: [{row: 0, column: 0}]});
    minefield.reveal({row: 0, column: 0});

    forEachTile(minefield.game, function (tile) {
      expect(tile.revealed).toBe(true);
    });
    expect(minefield.state).toBe(gameState.LOST);
  }));
});
