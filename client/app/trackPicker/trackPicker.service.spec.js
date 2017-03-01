'use strict';

describe('TrackPicker', function() {
  var $httpBackend;
  var trackPickerService;
  var tracksData = [
    {
    'id': 9,
    'filepath': 'resources/CAP_0009_180630.mp4',
    'alias': 'LE WHARLF DE BASSAM.mpg.mobile1080p_H264_@_MP3_@.MPEG4.MP4',
    'title': 'Test capsule',
    'description': 'Capsule en HD',
    'typeDesc': 'Capsule',
    'duration':180
    },
    {
    'id': 7,
    'filepath': 'resources/CAP_0007_180630.mp4',
    'alias': 'La pirogue de génération Félix Houphouët Boigny appelée FA ELE ou ABY SALAMAN .mpg.mobile1080p_H264_@_MP3_@.MPEG4.MP4',
    'title': 'Ma première capsule',
    'description': 'La pirogue de génération Félix Houphouët Boigny',
    'typeDesc': 'Capsule',
    'duration':181
    },
    {
    'id': 3,
    'filepath': 'resources/CAP_0003_180630.mp4',
    'title': 'Ma deuxième capsule',
    'alias': 'ROYAUME DU SANWI.mpg.mobile1080p_H264_@_MP3_@.MPEG4.MP4',
    'description': 'Le royaume du Sanwi',
    'typeDesc': 'Publicité',
    'duration':180
    }
  ];

  // Add a custom equality tester before each test ($resource modifies data returned)
  beforeEach(function() {
    jasmine.addCustomEqualityTester(angular.equals);
  });

  // Load the module that contains the service before each test
  beforeEach(module('plEditor.trackPicker'));

  // Instantiate the service and "train" `$httpBackend` before each test
  beforeEach(inject(function(_$httpBackend_, _trackPickerService_) {
    $httpBackend = _$httpBackend_;
    $httpBackend.expectGET('/api/track').respond(tracksData);

    trackPickerService = _trackPickerService_;
  }));

  // Verify that there are no outstanding expectations or requests after each test
  afterEach(function () {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });


  it('should fetch the tracks data from `/api/track`', function() {
    var tracks = trackPickerService.query();

    expect(tracks).toEqual([]);

    $httpBackend.flush();

    expect(tracks).toEqual(tracksData);
  });

});