'use strict';

angular

.module('plEditor.playlist')

.controller('playlistController', ['$scope', '$uibModal', 'playlistService', 'playlistRepoService', 'trackPickerService', '$q', 'configuratorService',
  function playlistController($scope, $uibModal, playlistService, playlistRepoService, trackPickerService, $q, configuratorService) {
  var insertionIndex = 0;
  $scope.days = playlistService.createDaysLocal();
  $scope.selectedDay = $scope.days[1];
  // $scope.playlist = playlistService.playlist;
  $scope.playlist = [];

  // $scope.cfg = {
  //   showVideoInPlaylist: true,
  //   confirmAction: true,
  //   animationsEnabled: true
  // };
  $scope.cfg = configuratorService.values;


  var setMetadata = function() {
    var plRate = playlistService.plRate($scope.playlist);
    $scope.metadata = { 
      range : playlistService.plRange($scope.playlist), 
      rate : plRate,
      isMaxSizeReached: plRate >= 100
    };
  };
  setMetadata();

  $scope.onDayChange = function() {
    console.log('day changed to', $scope.selectedDay);

    var playlistPromise = playlistRepoService.get({ day: $scope.selectedDay.apiAlias }).$promise;
    var tracksPromise = trackPickerService.query().$promise;

    $q.all([playlistPromise, tracksPromise])
    .then(function(data) {
      $scope.playlist = playlistService.buildPlaylist(data[0], data[1]);
      setMetadata();
    })
    .catch(function(error) {
      $scope.playlist = [];
      console.error(error);
    });
  }

  $scope.onDayChange();

  $scope.remove = function(trackIndex) {
    var tracksPromise = trackPickerService.query().$promise
    .then(function(availableTracks) {
      console.log(availableTracks);
      let plAsIntArray = $scope.playlist.map(function(enrichedTrack) { return enrichedTrack.id; });
      let tmp = plAsIntArray.slice(0, trackIndex);
      Array.prototype.push.apply(tmp, plAsIntArray.slice(trackIndex + 1));
      console.log('playlist raw', tmp);
      $scope.playlist = playlistService.buildPlaylist(tmp, availableTracks);
      setMetadata();
    });
  }

  // track picker management
  $scope.close = function() {
    console.log('close');
  }

  $scope.openPicker = function(plIndex) {
    insertionIndex = plIndex;
    console.log('plIndex', plIndex);
    var modalInstance = $uibModal.open({
      animation: $scope.cfg.animationsEnabled,
      component: 'picker'
    });

    modalInstance.result.then(function (selectedTracks) {
      let plAsIntArray = $scope.playlist.map(function(enrichedTrack) { return enrichedTrack.id; });
      let tmp = plAsIntArray.slice(0, insertionIndex);
      Array.prototype.push.apply(tmp, selectedTracks.addedTracks);
      Array.prototype.push.apply(tmp, plAsIntArray.slice(insertionIndex));
      $scope.playlist = playlistService.buildPlaylist(tmp, selectedTracks.availableTracks);

      setMetadata();
    }, function () {
      console.info('track-picker dismissed at: ' + new Date());
    });
  };


  $scope.saving = {};
  $scope.saving.value=false;
  $scope.savePlaylist = function() {
    $scope.saving.value = true;
    console.log('hola save', $scope.saving);
    let trackIds = $scope.playlist.map(function(track) { return track.id; });
    playlistRepoService.patch({ day: $scope.selectedDay.apiAlias }, trackIds).$promise
    .then(function(data){
      console.log(data);
      $scope.saving.value = false;
    })
    .catch(function(error) {
      $scope.saving.value = false;
      console.error(error);
    })
  }

}])
;
