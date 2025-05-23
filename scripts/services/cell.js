"use strict";

angular.module("minesweeperApp").factory("Cell", function () {
  return function (coord, onCellRevealed) {
    return {
      count: 0,
      mine: false,
      revealed: false,
      flagged: false,
      coord: coord,
      $autoReveal: function () {
        if (this.revealed) {
          (onCellRevealed || angular.noop)(this, true);
        }
      },
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
      },
      $displayValue: function () {
        if (this.mine) {
          return "*";
        } else {
          return this.count ? this.count : "";
        }
      },
    };
  };
});
