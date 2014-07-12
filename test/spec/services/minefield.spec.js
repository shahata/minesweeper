'use strict';

describe('Factory: Minefield', function () {
  beforeEach(function () {
    module('minesweeperAppInternal');
    module({minePlanter: jasmine.createSpy('minePlanter')});
  });

  function forEachCell(game, fn) {
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

  function aGame(options) {
    return aMinefield(options).game;
  }

  it('should load a previously serialized game', inject(function (Minefield) {
    var cell = new Minefield({game: [[{mine: true}]]}).game[0][0];
    expect(cell.$reveal).toBeDefined();
    expect(cell.mine).toBe(true);
  }));

  it('should have a game board with X rows', function () {
    var game = aGame({rows: 12});
    expect(game.length).toBe(12);
  });

  it('should have a game board with Y columns', function () {
    var game = aGame({columns: 10});
    game.forEach(function (row) {
      expect(row.length).toBe(10);
    });
  });

  it('should have a game board with Z mines', inject(function (minePlanter) {
    var game = aGame({mines: [{row: 0, column: 1}, {row: 1, column: 2}]});
    expect(minePlanter).toHaveBeenCalledWith(12, 10, 2);
    expect(game[0][1].mine).toBe(true);
    expect(game[1][2].mine).toBe(true);
  }));

  it('should mark the number of mines on the mine neighbors', function () {
    var game = aGame({rows: 3, columns: 3, mines: [{row: 1, column: 1}]});
    var expectedMine = {row: 1, column: 1};
    forEachCell(game, function (cell) {
      if (!angular.equals(expectedMine, cell.coord)) {
        expect(cell.count).toBe(1);
      }
    });
  });

  it('should mark the number of mines for neighbors of a corner mine', function () {
    var game = aGame({rows: 3, columns: 3, mines: [{row: 0, column: 0}]});
    expect(game[1][1].count).toBe(1);
  });

  it('should count the number of mines on a cell that neighbors two mines', function () {
    var game = aGame({rows: 3, columns: 3, mines:
      [{row: 0, column: 1}, {row: 1, column: 1}]});
    expect(game[0][0].count).toBe(2);
  });

  it('should lose if you reveal a mine', inject(function (gameState) {
    var minefield = aMinefield({mines: [{row: 0, column: 0}]});
    expect(minefield.state).toBe(gameState.PLAYING);
    minefield.game[0][0].$reveal();
    expect(minefield.state).toBe(gameState.LOST);
  }));

  it('should win if only mines are still not revealed', inject(function (gameState) {
    var minefield = aMinefield({mines: [{row: 0, column: 0}]});
    expect(minefield.state).toBe(gameState.PLAYING);
    forEachCell(minefield.game, function (cell) {
      if (!cell.mine) {
        cell.$reveal();
      }
    });
    expect(minefield.state).toBe(gameState.WON);
  }));

  it('should keep revealing if you reveal an empty cell', function () {
    var game = aGame({rows: 4, columns: 1, mines: [{row: 2, column: 0}]});
    game[0][0].$reveal();

    forEachCell(game, function (cell) {
      expect(cell.revealed).toBe(cell.coord.row < 2);
    });
  });

  it('should reveal all cells when game is won', function () {
    var game = aGame({mines: [{row: 0, column: 0}]});
    game[0][2].$reveal();

    forEachCell(game, function (cell) {
      expect(cell.revealed).toBe(true);
    });
  });

  it('should reveal all cells when game is lost', function () {
    var game = aGame({mines: [{row: 0, column: 0}]});
    game[0][0].$reveal();

    forEachCell(game, function (cell) {
      expect(cell.revealed).toBe(true);
    });
  });

  it('should reveal all cells around auto revealed cell', function () {
    var game = aGame({rows: 3, columns: 3, mines: [{row: 0, column: 0}]});
    game[0][0].$flag();
    game[1][1].$reveal();
    game[1][1].$autoReveal();

    forEachCell(game, function (cell) {
      expect(cell.revealed).toBe(true);
    });
  });

  it('should not auto reveal if not enough cells are flagged', function () {
    var game = aGame({rows: 3, columns: 3, mines: [{row: 0, column: 0}]});
    game[1][1].$reveal();
    game[1][1].$autoReveal();

    forEachCell(game, function (cell) {
      expect(cell.revealed).toBe(angular.equals(cell.coord, {row: 1, column: 1}));
    });
  });
});
