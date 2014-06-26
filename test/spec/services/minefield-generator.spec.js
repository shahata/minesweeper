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
      field.push({
        mine: arr.indexOf(i) !== -1 ? true : false,
        count: 0
      });
    }
    return field;
  }

  it('should generate a field with given parameters', function () {
    var field = mineField([0, 1, 2, 3, 4, 5, 6, 7]);
    randomArr = [0, 1, 2, 3, 4, 5, 6, 7];

    MinefieldGenerator.create(10, 10, 8).forEach(function (value, index) {
      expect(value.mine).toEqual(field[index].mine);
    });
  });

  it('should try to randomly select again if mine already exist', function () {
    var field = mineField([0, 1, 2, 3, 4, 5, 6, 7]);
    randomArr = [0, 1, 2, 3, 3, 4, 5, 6, 7];

    MinefieldGenerator.create(10, 10, 8).forEach(function (value, index) {
      expect(value.mine).toEqual(field[index].mine);
    });
  });

  it('should count for each cell how many mines it has around it', function () {
    var field = mineField([15]);
    field[4].count = field[5].count = field[6].count = 1;
    field[14].count = field[16].count = 1;
    field[24].count = field[25].count = field[26].count = 1;

    randomArr = [15];
    expect(MinefieldGenerator.create(10, 10, 1)).toEqual(field);
  });

});
