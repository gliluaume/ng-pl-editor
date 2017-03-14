'use strict';

describe('PlaylistRepoService', function() {
  var $httpBackend;
  var playlistRepoService;
  var playlists = {
    'mon' : [9, 7, 3, 7, 9], 
    'tue' : [9], 
    'wed' : [7], 
    'thu' : [3, 7], 
    'fri' : [7, 9], 
    'sat' : [], 
    'sun' : [7]
  };

  // Add a custom equality tester before each test ($resource modifies data returned)
  beforeEach(function() {
    jasmine.addCustomEqualityTester(angular.equals);
  });

  // Load the module that contains the service before each test
  beforeEach(module('plEditor.playlist'));

  // Instantiate the service and "train" `$httpBackend` before each test
  beforeEach(inject(function(_$httpBackend_, _playlistRepoService_) {
    $httpBackend = _$httpBackend_;
    $httpBackend.expectGET('/api/playlist/test/mon').respond(playlists['mon']);

    playlistRepoService = _playlistRepoService_;
  }));

  // Verify that there are no outstanding expectations or requests after each test
  afterEach(function () {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('should fetch the playlist data from `/api/playlist/:day`', function() {
    var mondayPlaylist = playlistRepoService.get({ dir: 'test', day: 'mon' });

    expect(mondayPlaylist).toEqual([]);

    $httpBackend.flush();
    console.log(mondayPlaylist);

    expect(mondayPlaylist).toEqual(playlists['mon']);
  });

})