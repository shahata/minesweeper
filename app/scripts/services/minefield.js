'use strict';

angular.module('minesweeperAppInternal')
  .value('random', function (max) {
    return Math.round(Math.random() * max);
  })
  .constant('gameState', {
    LOST: 'lost',
    WON: 'won',
    PLAYING: 'playing'
  })
  .factory('Minefield', function Minefield(random, gameState) {
    return function (width, height, mines) {
      var mineField = [];
      var reminingCells = (width * height) - mines;

      function incrementCount(cell) {
        cell.count++;
      }

      function getNeighbors(row, col) {
        var neighbors = [];

        function safePush(row, col) {
          if (mineField[row] && mineField[row][col]) {
            neighbors.push(mineField[row][col]);
          }
        }

        safePush(row, col - 1);
        safePush(row - 1, col - 1);
        safePush(row + 1, col - 1);
        safePush(row, col + 1);
        safePush(row - 1, col + 1);
        safePush(row + 1, col + 1);
        safePush(row - 1, col);
        safePush(row + 1, col);

        return neighbors;
      }

      function revealAll() {
        for (var i = 0; i < height; i++) {
          for (var j = 0; j < width; j++) {
            mineField[i][j].revealed = true;
          }
        }
      }

      for (var i = 0; i < height; i++) {
        mineField.push([]);
        for (var j = 0; j < width; j++) {
          mineField[i].push({
            row: i,
            column: j,
            count: 0,
            mine: false,
            revealed: false,
            flagged: false
          });
        }
      }

      for (i = 0; i < mines; i++) {
        var position = random(width * height);
        var row = Math.floor(position / height);
        var col = position - (row * height);
        if (mineField[row][col].mine) {
          i--;
        } else {
          mineField[row][col].mine = true;
          getNeighbors(row, col).forEach(incrementCount);
        }
      }

      this.reveal = function (row, col) {
        if (!mineField[row][col].revealed && !mineField[row][col].flagged) {
          mineField[row][col].revealed = true;
          if (mineField[row][col].mine) {
            this.state = gameState.LOST;
          } else {
            reminingCells--;
            if (reminingCells === 0) {
              this.state = gameState.WON;
              revealAll();
            } else if (mineField[row][col].count === 0) {
              getNeighbors(row, col).forEach(function (cell) {
                this.reveal(cell.row, cell.column);
              }, this);
            }
          }
        }
      };

      this.flag = function (row, col) {
        if (!mineField[row][col].revealed) {
          mineField[row][col].flagged = !mineField[row][col].flagged;
        }
      };

      this.game = mineField;
      this.state = gameState.PLAYING;
    };
  });
