'use strict';
describe('playslistController', function(){
  var $httpBackend;
  var ctrl;
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

  // beforeEach(function() {
  //   jasmine.addCustomEqualityTester(angular.equals);
  // });

  beforeEach(module('plEditor.playlist'));

  // beforeEach(inject(function(_$httpBackend_, $controller) {
  //   $httpBackend = _$httpBackend_;
  //   $httpBackend.expectGET('/api/playlist/mon').respond(playlists['mon']);
  //   ctrl = $controller('playlistController', {$scope: scope });
  // }));

  // // Verify that there are no outstanding expectations or requests after each test
  // afterEach(function () {
  //   $httpBackend.verifyNoOutstandingExpectation();
  //   $httpBackend.verifyNoOutstandingRequest();
  // });

  // it('should add a track when asked for', function(){

  //   console.log('toto', ctrl.selectedDay, ctrl);
  //   expect(ctrl.playlist).toBeDefined();
  // });


  it('should initialize days', inject(function($controller) {
    var scope = {};
    var ctrl = $controller('playlistController', {$scope : scope});
    expect(scope.days).toBeDefined;
    expect(scope.days.length).toBe(7);
  }));

  it('should select a default day', inject(function($controller) {
    var scope = {};
    var ctrl = $controller('playlistController', {$scope : scope});
    expect(scope.selectedDay).toBeDefined;
  }));

});