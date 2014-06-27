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

    this.getValue = function (row, col) {
      return this.getCell(row, col).element(by.css('.cell-value'));
    };

    this.getRows = function () {
      return element.all(by.css('#minesweeper tr'));
    };

    this.getCells = function (selector) {
      return element.all(by.css('#minesweeper td' + (selector ? selector : '')));
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
    var table = new MinesweeperTable();
    table.load();
    expect(table.getRows().count()).toEqual(10);
    expect(table.getCells().count()).toEqual(100);
  });

  it('should reveal cell on click', function () {
    var table = new MinesweeperTable();
    table.load();
    expect(table.getValue(0, 0).isDisplayed()).toBe(false);
    table.getCell(0, 0).click();
    expect(table.getValue(0, 0).isDisplayed()).toBe(true);
  });

  it('should change background color on click', function () {
    var table = new MinesweeperTable();
    table.load();
    expect(table.getCell(0, 0).getAttribute('class')).toMatch(/\bcovered\b/);
    table.getCell(0, 0).click();
    expect(table.getCell(0, 0).getAttribute('class')).not.toMatch(/\bcovered\b/);
    expect(table.getCells('.covered').count()).toBe(60);
  });

  it('should display correct values in cells', function () {
    var table = new MinesweeperTable();
    table.load();
    table.getCell(3, 0).click();
    table.getCell(3, 1).click();
    table.getCell(3, 2).click();
    table.getCell(2, 3).click();
    expect(table.getCell(3, 0).getText()).toBe('1');
    expect(table.getCell(3, 1).getText()).toBe('2');
    expect(table.getCell(3, 2).getText()).toBe('3');
    expect(table.getCell(2, 3).getText()).toBe('');
  });

  it('should display alert when you lose', function () {
    var table = new MinesweeperTable();
    table.load();
    table.getCell(4, 1).click();

    var alertDialog = browser.switchTo().alert();
    expect(alertDialog.getText()).toBe('You Lost!');
    alertDialog.accept();

    expect(table.getCell(4, 1).getText()).toBe('*');
  });

  it('should display alert when you win', function () {
    var table = new MinesweeperTable();
    table.load();
    table.getCell(0, 0).click();
    table.getCell(4, 0).click();
    table.getCell(9, 9).click();
    table.getCell(4, 9).click();

    var alertDialog = browser.switchTo().alert();
    expect(alertDialog.getText()).toBe('You Won!');
    alertDialog.accept();
  });

});
