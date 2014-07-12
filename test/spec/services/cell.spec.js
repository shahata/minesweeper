'use strict';

describe('Service: Cell', function () {

  beforeEach(function () {
    module('minesweeperAppInternal');
  });

  var Cell;
  beforeEach(inject(function (_Cell_) {
    Cell = _Cell_;
  }));

  function aCell(coord, onCellRevealed) {
    return new Cell(coord || {row: 0, column: 0}, onCellRevealed);
  }

  it('should reveal the cell', function () {
    var cell = aCell();
    cell.$reveal();
    expect(cell.revealed).toBe(true);
  });

  it('should have coordinates', function () {
    var coord = {row: 99, column: 99};
    var cell = aCell(coord);
    expect(cell.coord).toBe(coord);
  });

  it('should invoke callback when cell is revealed', function () {
    var revealSpy = jasmine.createSpy('revealSpy');
    var cell = aCell({row: 0, column: 0}, revealSpy);
    cell.$reveal();
    expect(revealSpy).toHaveBeenCalledWith(cell);
  });

  it('should invoke callback when cell is auto revealed', function () {
    var revealSpy = jasmine.createSpy('revealSpy');
    var cell = aCell({row: 0, column: 0}, revealSpy);
    cell.$reveal();
    cell.$autoReveal();
    expect(revealSpy).toHaveBeenCalledWith(cell, true);
  });

  it('should flag the cell', function () {
    var cell = aCell();
    cell.$flag();
    expect(cell.flagged).toBe(true);
  });

  it('should unflag the cell', function () {
    var cell = aCell();
    cell.$flag();
    cell.$flag();
    expect(cell.flagged).toBe(false);
  });

  it('should not reveal a flagged cell', function () {
    var cell = aCell();
    cell.$flag();
    cell.$reveal();
    expect(cell.revealed).toBe(false);
  });

  it('should not flag a revealed cell', function () {
    var cell = aCell();
    cell.$reveal();
    cell.$flag();
    expect(cell.flagged).toBe(false);
  });

  it('should not auto reveal a non-revealed cell', function () {
    var revealSpy = jasmine.createSpy('revealSpy');
    var cell = aCell({row: 0, column: 0}, revealSpy);
    cell.$autoReveal();
    expect(revealSpy).not.toHaveBeenCalled();
  });

});
