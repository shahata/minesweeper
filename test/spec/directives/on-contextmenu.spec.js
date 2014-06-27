'use strict';

describe('Directive: onContextmenu', function () {

  // load the directive's module
  beforeEach(module('minesweeperAppInternal'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should invoke function on right click', inject(function ($compile) {
    scope.spy = jasmine.createSpy('spy');
    element = angular.element('<div on-contextmenu="spy()"></div>');
    element = $compile(element)(scope);
    element.triggerHandler('contextmenu');
    expect(scope.spy).toHaveBeenCalled();
  }));

  it('should invoke function with optional $event', inject(function ($compile) {
    scope.spy = jasmine.createSpy('spy');
    element = angular.element('<div on-contextmenu="spy($event)"></div>');
    element = $compile(element)(scope);
    element.triggerHandler('contextmenu');
    expect(scope.spy).toHaveBeenCalledWith(jasmine.any(Object));
  }));
});
