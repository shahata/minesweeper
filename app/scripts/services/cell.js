'use strict';

angular.module('minesweeperAppInternal')
  .factory('Cell', function () {
    return function (coord, onCellRevealed) {
      return {
        count: 0,
        mine: false,
        revealed: false,
        flagged: false,
        coord: coord,
        $reveal: function () {
          if (!this.revealed && !this.flagged) {
            this.revealed = true;
            (onCellRevealed || angular.noop)(this);
          }
        },
        $flag: function () {
          if (!this.revealed) {
            this.flagged = !this.flagged;
          }
        }
      };
    };
  });
