'use strict';

angular.module('minesweeperAppInternal')
  .constant('gameState', {
    LOST: 'lost',
    WON: 'won',
    PLAYING: 'playing'
  })
  .factory('Minefield', function Minefield(minePlanter, gameState) {
    return function (rows, columns, mines) {
      var game, remainingCells;

      function cellAt(coord) {
        return game[coord.row][coord.column];
      }

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

      function plantMines() {
        minePlanter(rows, columns, mines).forEach(function (coord) {
          cellAt(coord).mine = true;
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
            game[row].push({
              count: 0,
              mine: false,
              revealed: false,
              flagged: false,
              coord: {
                row: row,
                column: column
              }
            });
          });
        });
      }

      this.reveal = function (coord) {
        if (!cellAt(coord).revealed && !cellAt(coord).flagged) {
          cellAt(coord).revealed = true;
          if (cellAt(coord).mine) {
            this.state = gameState.LOST;
            revealAll();
          } else {
            remainingCells--;
            if (remainingCells === 0) {
              this.state = gameState.WON;
              revealAll();
            } else if (cellAt(coord).count === 0) {
              getNeighbors(coord).forEach(function (cell) {
                this.reveal(cell.coord);
              }, this);
            }
          }
        }
      };

      this.flag = function (coord) {
        if (!cellAt(coord).revealed) {
          cellAt(coord).flagged = !cellAt(coord).flagged;
        }
      };

      initGame();
      plantMines();

      remainingCells = game.reduce(function (count, row) {
        return count + row.filter(function (cell) {
          return !cell.revealed && !cell.mine;
        }).length;
      }, 0);
      this.game = game;
      this.state = gameState.PLAYING;
    };

  });
