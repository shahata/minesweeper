'use strict';

describe('minesweeperApp', function () {

  var MinesweeperTable = function () {
    var rows = element.all(by.css('#minesweeper tr'));

    this.load = function () {
      browser.get('/');
    };

    this.getCell = function (row, col) {
      return rows.get(row).all(by.css('td')).get(col);
    };

  };

  beforeEach(function () {
    browser.addMockModule('minesweeperAppMocks', function () {});
    browser.addMockModule('randomMock', function () {
      var randomIndex = 0;
      var randomArr = [41, 42, 43, 44, 45, 46, 47, 48];
      angular.module('randomMock', []).value('random', function () {
        return randomArr[randomIndex++];
      });
    });
  });

  afterEach(function () {
    browser.removeMockModule();
  });

  it('should load successfully', function () {
    browser.get('/');
    expect(element.all(by.css('#minesweeper tr')).count()).toEqual(10);
    expect(element.all(by.css('#minesweeper td')).count()).toEqual(100);
  });

  it('should display correct values in cells', function () {
    var table = new MinesweeperTable();
    table.load();
    expect(table.getCell(4, 1).getText()).toBe('*');
    expect(table.getCell(3, 0).getText()).toBe('1');
    expect(table.getCell(3, 1).getText()).toBe('2');
    expect(table.getCell(3, 2).getText()).toBe('3');
    expect(table.getCell(2, 3).getText()).toBe('0');
  });

});
