'use strict';

angular.module('minesweeperAppInternal')
  .value('random', function (max) {
    return Math.floor(Math.random() * max);
  })
  .factory('minePlanter', function (random) {
    return function (rows, columns, mines) {
      function coordExists(arr, coord) {
        return arr.some(function (value) {
          return angular.equals(value, coord);
        });
      }

      var mineArr = [];
      while (mineArr.length !== mines) {
        var coord = {row: random(rows), column: random(columns)};
        if (!coordExists(mineArr, coord)) {
          mineArr.push(coord);
        }
      }
      return mineArr;
    };
  });
