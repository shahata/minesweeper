'use strict';

angular.module('minesweeperAppInternal')
  .value('random', function (max) {
    return Math.round(Math.random() * max);
  })
  .service('MinefieldGenerator', function MinefieldGenerator(random) {
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
          try {
            mineField[position].mine = true;
            if (position % width !== 0) {
              mineField[position - 1].count++;
              mineField[position - width - 1].count++;
              mineField[position + width - 1].count++;
            }
            if (position % width !== width - 1) {
              mineField[position + 1].count++;
              mineField[position - width + 1].count++;
              mineField[position + width + 1].count++;
            }
            mineField[position - width].count++;
            mineField[position + width].count++;
          } catch (e) {

          }
        }
      }

      return mineField;
    };
  });
