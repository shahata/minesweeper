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

      function getNeighbors(position) {
        var neighbors = [];

        if (position % width !== 0) {
          neighbors.push(mineField[position - 1]);
          neighbors.push(mineField[position - width - 1]);
          neighbors.push(mineField[position + width - 1]);
        }
        if (position % width !== width - 1) {
          neighbors.push(mineField[position + 1]);
          neighbors.push(mineField[position - width + 1]);
          neighbors.push(mineField[position + width + 1]);
        }
        neighbors.push(mineField[position - width]);
        neighbors.push(mineField[position + width]);

        return neighbors.filter(angular.identity);
      }

      for (var i = 0; i < width * height; i++) {
        mineField.push({
          id: i,
          count: 0,
          mine: false,
          revealed: false,
          flagged: false
        });
      }

      for (i = 0; i < mines; i++) {
        var position = random(width * height);
        if (mineField[position].mine) {
          i--;
        } else {
          mineField[position].mine = true;
          getNeighbors(position).forEach(incrementCount);
        }
      }

      this.reveal = function (index) {
        if (!mineField[index].revealed) {
          mineField[index].revealed = true;
          if (mineField[index].mine) {
            this.state = gameState.LOST;
          } else {
            reminingCells--;
            if (reminingCells === 0) {
              this.state = gameState.WON;
            } else if (mineField[index].count === 0) {
              getNeighbors(index).forEach(function (cell) {
                this.reveal(cell.id);
              }, this);
            }
          }
        }
      };

      this.flag = function (index) {
        mineField[index].flagged = true;
      };

      this.game = mineField;
      this.state = gameState.PLAYING;
    };
  });
