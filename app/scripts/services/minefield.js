'use strict';

angular.module('minesweeperAppInternal')
  .constant('gameState', {
    LOST: 'lost',
    WON: 'won',
    PLAYING: 'playing'
  })
  .factory('Minefield', function Minefield(minePlanter, gameState) {
    return function (rows, columns, mines) {

      function markNeighbor(cell) {
        cell.count++;
      }

      function getNeighbors(row, column) {
        var neighbors = [];

        function pushNeighbor(drow, dcolumn) {
          var actualRow = row + drow;
          var actualColumn = column + dcolumn;

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

      function plantMines(game) {
        minePlanter(rows, columns, mines).forEach(function (coord) {
          game[coord.row][coord.column].mine = true;
          getNeighbors(coord.row, coord.column).forEach(markNeighbor);
        });
      }

      function initGame() {
        var game = [];
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
        return game;
      }

      function cellAt(coord) {
        return game[coord.row][coord.column];
      }

      this.reveal = function (coord) {
        if (!cellAt(coord).revealed && !cellAt(coord).flagged) {
          cellAt(coord).revealed = true;
          if (cellAt(coord).mine) {
            this.state = gameState.LOST;
            revealAll();
          } else {
            reminingCells--;
            if (reminingCells === 0) {
              this.state = gameState.WON;
              revealAll();
            } else if (cellAt(coord).count === 0) {
              getNeighbors(coord.row, coord.column).forEach(function (cell) {
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

      var reminingCells = (rows * columns) - mines;
      var game = initGame();
      plantMines(game);

      this.game = game;
      this.state = gameState.PLAYING;
    };

  });
