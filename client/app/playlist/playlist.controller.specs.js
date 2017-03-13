'use strict';
describe('playslistController', function(){
  var ctrl, scope;
  var $controller, $rootScope;
  // var scope = {};
  var playlists = {
    'mon' : [9, 7, 3, 7, 9], 
    'tue' : [9], 
    'wed' : [7], 
    'thu' : [3, 7], 
    'fri' : [7, 9], 
    'sat' : [], 
    'sun' : [7]
  };

  beforeEach(module('plEditor.playlist'));

  beforeEach(inject(function(_$controller_, _$rootScope_) {
    $controller = _$controller_;
    $rootScope = _$rootScope_;
    scope = $rootScope.$new();
    ctrl = $controller('playlistController', {$scope : scope});
  }));

  it('should initialize days', function() {
    expect(scope.days).toBeDefined;
    expect(scope.days.length).toBe(7);
  });

  it('should select a default day', inject(function($controller) {
    var scope = $rootScope.$new();
  }));

});