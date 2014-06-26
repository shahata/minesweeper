'use strict';

angular.module('minesweeperAppInternal')
  .value('random', function (max) {
    return Math.round(Math.random() * max);
  })
  .service('MinefieldGenerator', function MinefieldGenerator(random) {
    this.create = function (width, height, mines) {
      var mineField = [];
      for (var i = 0; i < width * height; i++) {
        mineField.push({mine: false});
      }

      for (i = 0; i < mines; i++) {
        mineField[random(width * height)].mine = true;
      }

      return mineField;
    };
  });
