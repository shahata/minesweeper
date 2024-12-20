"use strict";

angular
  .module("minesweeperApp")
  .constant("gameState", {
    LOST: "lost",
    WON: "won",
    PLAYING: "playing",
  })
  .factory("Minefield", function Minefield(minePlanter, gameState, Cell) {
    return function (rows, columns, mines) {
      var game,
        self = this;

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

      function allCells() {
        return game.reduce(function (all, row) {
          return all.concat(row);
        }, []);
      }

      function revealAll() {
        allCells().forEach(function (cell) {
          cell.revealed = true;
        });
      }

      function loadGame(load) {
        game = load.game.map(function (row) {
          return row.map(function (cell) {
            return angular.extend(new Cell(cell.coord, onCellRevealed), cell);
          });
        });
      }

      function gameOver(state) {
        self.state = state;
        revealAll();
      }

      function onCellRevealed(cell, auto) {
        if (cell.mine) {
          gameOver(gameState.LOST);
          return;
        }

        if (auto) {
          var neighbors = getNeighbors(cell.coord);
          if (
            neighbors.filter(function (neighbor) {
              return neighbor.flagged;
            }).length >= cell.count
          ) {
            neighbors.forEach(function (neighbor) {
              neighbor.$reveal();
            });
          }
        } else if (cell.count === 0) {
          getNeighbors(cell.coord).forEach(function (neighbor) {
            neighbor.$reveal();
          });
        }

        var won = allCells(game).every(function (cell) {
          return cell.revealed || cell.mine;
        });
        if (won) {
          gameOver(gameState.WON);
        }
      }

      function plantMines() {
        minePlanter(rows, columns, mines).forEach(function (coord) {
          game[coord.row][coord.column].mine = true;
          getNeighbors(coord).forEach(function (cell) {
            cell.count++;
          });
        });
      }

      function initGame() {
        game = [];
        for (var row = 0; row < rows; row++) {
          game.push([]);
          for (var column = 0; column < columns; column++) {
            game[row].push(
              new Cell({ row: row, column: column }, onCellRevealed)
            );
          }
        }
      }

      initGame();
      plantMines();

      this.game = game;
      this.state = gameState.PLAYING;
    };
  });
