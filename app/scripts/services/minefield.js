'use strict';

angular.module('minesweeperAppInternal')
  .constant('gameState', {
    LOST: 'lost',
    WON: 'won',
    PLAYING: 'playing'
  })
  .factory('Minefield', function Minefield(minePlanter, gameState, Cell) {
    return function (rows, columns, mines) {
      var game, remainingCells, self = this;

      function getNeighbors(coord) {
        var neighbors = [];

        function pushNeighbor(drow, dcolumn) {
          var actualRow = coord.row + drow;
          var actualColumn = coord.column + dcolumn;

          if (game[actualRow] && game[actualRow][actualColumn]) {
            neighbors.push(game[actualRow][actualColumn]);
          }
        }

        pushNeighbor(-1, -1);
        pushNeighbor(-1, 0);
        pushNeighbor(-1, 1);
        pushNeighbor(0, -1);
        pushNeighbor(0, 1);
        pushNeighbor(1, -1);
        pushNeighbor(1, 0);
        pushNeighbor(1, 1);

        return neighbors;
      }

      function revealAll() {
        game.forEach(function (row) {
          row.forEach(function (cell) {
            cell.revealed = true;
          });
        });
      }

      function loadGame(load) {
        game = load.game.map(function (row) {
          return row.map(function (cell) {
            return angular.extend(new Cell(cell.coord, onCellRevealed), cell);
          });
        });
      }

      function gameOver(state) {
        self.state = state;
        revealAll();
      }

      function onCellRevealed(cell, auto) {
        if (auto) {
          var neighbors = getNeighbors(cell.coord);
          if (neighbors.filter(function (neighbor) {
            return neighbor.flagged;
          }).length >= cell.count) {
            neighbors.forEach(function (neighbor) {
              neighbor.$reveal();
            });
          }
        } else if (cell.mine) {
          gameOver(gameState.LOST);
        } else if (--remainingCells === 0) {
          gameOver(gameState.WON);
        } else if (cell.count === 0) {
          getNeighbors(cell.coord).forEach(function (neighbor) {
            neighbor.$reveal();
          });
        }
      }

      function plantMines() {
        minePlanter(rows, columns, mines).forEach(function (coord) {
          game[coord.row][coord.column].mine = true;
          getNeighbors(coord).forEach(function (cell) {
            cell.count++;
          });
        });
      }

      function initGame() {
        game = [];
        _(rows).times(function (row) {
          game.push([]);
          _(columns).times(function (column) {
            game[row].push(new Cell({row: row, column: column}, onCellRevealed));
          });
        });
      }

      if (arguments.length === 1) {
        loadGame(arguments[0]);
      } else {
        initGame();
        plantMines();
      }

      remainingCells = game.reduce(function (count, row) {
        return count + row.filter(function (cell) {
          return !cell.revealed && !cell.mine;
        }).length;
      }, 0);
      this.game = game;
      this.state = gameState.PLAYING;
    };

  });
