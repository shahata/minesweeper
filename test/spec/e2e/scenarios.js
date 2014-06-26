'use strict';

describe('minesweeperApp', function () {

  beforeEach(function () {
    browser.addMockModule('minesweeperAppMocks', function () {});
  });

  afterEach(function () {
    browser.removeMockModule();
  });

  it('should load successfully', function () {
    browser.get('/');
    expect(element.all(by.css('#minesweeper tr')).count()).toEqual(10);
    expect(element.all(by.css('#minesweeper td')).count()).toEqual(100);
  });

});
