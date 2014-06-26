'use strict';

angular.module('minesweeperAppInternal')
  .value('random', function (max) {
    return Math.round(Math.random() * max);
  })
  .service('MinefieldGenerator', function MinefieldGenerator(random) {
    function incrementCount(cell) {
      if (cell) {
        cell.count++;
      }
    }

    this.create = function (width, height, mines) {
      var mineField = [];
      for (var i = 0; i < width * height; i++) {
        mineField.push({mine: false, count: 0});
      }

      for (i = 0; i < mines; i++) {
        var position = random(width * height);
        if (mineField[position].mine) {
          i--;
        } else {
          mineField[position].mine = true;
          if (position % width !== 0) {
            incrementCount(mineField[position - 1]);
            incrementCount(mineField[position - width - 1]);
            incrementCount(mineField[position + width - 1]);
          }
          if (position % width !== width - 1) {
            incrementCount(mineField[position + 1]);
            incrementCount(mineField[position - width + 1]);
            incrementCount(mineField[position + width + 1]);
          }
          incrementCount(mineField[position - width]);
          incrementCount(mineField[position + width]);
        }
      }

      return mineField;
    };
  });
