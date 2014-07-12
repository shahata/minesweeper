'use strict';

describe('Controller: LoadGameCtrl', function () {
  var $q;

  beforeEach(function () {
    module('minesweeperAppInternal');
    module({
      $location: jasmine.createSpyObj('$location', ['path']),
      Minefield: function (rows, columns, mines) {
        return {rows: rows, columns: columns, mines: mines};
      },
      games: {list: function () {
        return {$add: function (obj) {
          return $q.when({name: function () {
            return JSON.stringify(obj);
          }});
        }};
      }}
    });
  });

  var LoadGameCtrl, scope;

  beforeEach(inject(function ($controller, $rootScope, _$q_) {
    $q = _$q_;
    scope = $rootScope.$new();
    LoadGameCtrl = $controller('LoadGameCtrl', {
      $scope: scope
    });
  }));

  it('should store the games object on the scope', function () {
    expect(scope.games.$add).toBeDefined();
  });

  it('should add a game with default dimensions', inject(function ($location) {
    scope.newGame('shahar');
    scope.$digest();
    expect($location.path).toHaveBeenCalledWith('/' + JSON.stringify({
      name: 'shahar',
      minefield: {rows: 10, columns: 10, mines: 8}
    }));
  }));

});
