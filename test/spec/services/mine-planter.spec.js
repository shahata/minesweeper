'use strict';

describe('Service: random', function () {
  beforeEach(function () {
    module('minesweeperAppInternal');
  });

  it('should generate a random int with max', inject(function (random) {
    _(100).times(function () {
      var result = random(10);
      expect(result).toBeOneOf(0, 1, 2, 3, 4, 5, 6, 7, 8, 9);
    });
  }));
});

describe('Service: minePlanter', function () {
  var randomArr = [];

  beforeEach(function () {
    var randomIndex = 0;
    module('minesweeperAppInternal');
    module({random: function (max) {
      expect(randomArr[randomIndex].expected).toBe(max);
      return randomArr[randomIndex++].result;
    }});
  });

  var minePlanter;
  beforeEach(inject(function (_minePlanter_) {
    minePlanter = _minePlanter_;
  }));

  it('should plant a mine in a random location', function () {
    randomArr = [{expected: 10, result: 0}, {expected: 12, result: 1}];
    expect(minePlanter(10, 12, 1)).toEqual([{row: 0, column: 1}]);
  });

  it('should plant mines in a unique location', function () {
    randomArr = [{expected: 10, result: 0}, {expected: 12, result: 1},
                 {expected: 10, result: 0}, {expected: 12, result: 1},
                 {expected: 10, result: 1}, {expected: 12, result: 2}];
    expect(minePlanter(10, 12, 2)).toEqual([{row: 0, column: 1}, {row: 1, column: 2}]);
  });
});
