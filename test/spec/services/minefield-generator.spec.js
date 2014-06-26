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

  function mineField(arr) {
    var field = [];
    for (var i = 0; i < 100; i++) {
      field.push({mine: arr.indexOf(i) !== -1 ? true : false});
    }
    return field;
  }

  it('should generate a field with given parameters', function () {
    var field = mineField([0, 1, 2, 3, 4, 5, 6, 7]);
    randomArr = [0, 1, 2, 3, 4, 5, 6, 7];
    expect(MinefieldGenerator.create(10, 10, 8)).toEqual(field);
  });

  it('should try to randomly select again if mine already exist', function () {
    var field = mineField([0, 1, 2, 3, 4, 5, 6, 7]);
    randomArr = [0, 1, 2, 3, 3, 4, 5, 6, 7];
    expect(MinefieldGenerator.create(10, 10, 8)).toEqual(field);
  });

});
