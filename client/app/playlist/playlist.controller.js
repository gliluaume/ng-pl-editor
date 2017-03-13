'use strict';

angular.module('plEditor.playlist')

.controller('playlistController', ['$scope', '$uibModal', 'playlistService', 'playlistRepoService', 'configuratorService', 'trackPickerStockService',
  function playlistController($scope, $uibModal, playlistService, playlistRepoService, configuratorService, trackPickerStockService) {
  $scope.days = playlistService.createDaysLocal();
  $scope.selectedDay = $scope.days[1];
  $scope.playlist = [];
  $scope.metadata = playlistService.metadata;
  $scope.cfg = configuratorService.values;
  $scope.loaded = trackPickerStockService.loaded;

  $scope.$watch('loaded.state', function(state) {
    if(state){
      $scope.onDayChange();
    }
  });

  $scope.sortableOptions = {
    stop: function(e, ui) {
      console.log("stop", e, ui);
      $scope.playlist = playlistService.buildPlaylist($scope.playlist.map((item) => { return item.id; }), $scope.playlist);
    }
  };

  $scope.onDayChange = function() {
    console.log('day changed to', $scope.selectedDay);
    playlistRepoService.get({ day: $scope.selectedDay.apiAlias }).$promise
    .then(function(data) {
      $scope.playlist = playlistService.buildPlaylist(data, trackPickerStockService.tracks);
    })
    .catch(function(error) {
      $scope.playlist = [];
      console.error(error);
    });
  }

  $scope.remove = function(trackIndex) {
    console.log('configuratorService.values.confirmAction', configuratorService.values.confirmAction);
    if(configuratorService.values.confirmAction) {
      openConfirm(removeTrack, [trackIndex]);
    } else {
      removeTrack(trackIndex);
    }
  }

  var removeTrack = function(trackIndex) {
    let plAsIntArray = $scope.playlist.map(function(enrichedTrack) { return enrichedTrack.id; });
    let tmp = plAsIntArray.slice(0, trackIndex);
    Array.prototype.push.apply(tmp, plAsIntArray.slice(trackIndex + 1));
    console.log('playlist raw', tmp);
    $scope.playlist = playlistService.buildPlaylist(tmp, trackPickerStockService.tracks);
  } 

  // confirm modal management
  var openConfirm = function(action, args) {
    var modalInstance = $uibModal.open({
      animation: $scope.cfg.animationsEnabled,
      component: 'confirmator'
    });

    modalInstance.result.then(function(confirmed) {
      console.log('confirmed', confirmed);
      if(confirmed)
        action.apply(null, args);
    }, function () {
      console.info('track-picker dismissed at: ' + new Date());
    });
  };

  // track picker management
  var insertionIndex = 0;
  $scope.openPicker = function(plIndex) {
    insertionIndex = plIndex;
    console.log('plIndex', plIndex);
    var modalInstance = $uibModal.open({
      animation: $scope.cfg.animationsEnabled,
      component: 'picker',
      size: 'lg'
    });

    modalInstance.result.then(function(addedTracks) {
      let plAsIntArray = $scope.playlist.map(function(enrichedTrack) { return enrichedTrack.id; });
      var tmp = [...(plAsIntArray.slice(0, insertionIndex)), ...addedTracks, ...(plAsIntArray.slice(insertionIndex))];
      $scope.playlist = playlistService.buildPlaylist(tmp, trackPickerStockService.tracks);
    }, function () {
      console.info('track-picker dismissed at: ' + new Date());
    });
  };

  $scope.saving = {};
  $scope.saving.value=false;
  $scope.savePlaylist = function() {
    $scope.saving.value = true;
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
