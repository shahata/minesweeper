'use strict';

describe('Service: MinefieldGenerator', function () {
  var MinefieldGenerator, randomArr;

  beforeEach(function () {
    var randomIndex = 0;
    module('minesweeperAppInternal');
    module({random: function () {
      return randomArr[randomIndex++];
    }});
  });

  beforeEach(inject(function (_MinefieldGenerator_) {
    MinefieldGenerator = _MinefieldGenerator_;
  }));

  it('should generate a field with given parameters', function () {
    var mineField = [];
    for (var i = 0; i < 100; i++) {
      mineField.push({mine: i < 8 ? true : false});
    }
    randomArr = [0, 1, 2, 3, 4, 5, 6, 7];

    expect(MinefieldGenerator.create(10, 10, 8)).toEqual(mineField);
  });

});
