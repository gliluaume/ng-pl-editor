'use strict';

angular

.module('plEditor.playlist')

.controller('playlistController', ['$scope', '$uibModal', 'playlistService', 'playlistRepoService', 'trackPickerService', '$q',
  function playlistController($scope, $uibModal, playlistService, playlistRepoService, trackPickerService, $q) {
  var insertionIndex = 0;
  $scope.days = playlistService.createDaysLocal();
  $scope.selectedDay = $scope.days[2];
  $scope.playlist = [];

  $scope.cfg = {
    showVideoInPlaylist: true,
    confirmAction: true
  };
  
  $scope.onDayChange = function() {
    console.log('hola', $scope.selectedDay);

    var playlistPromise = playlistRepoService.get({ day: $scope.selectedDay.apiAlias }).$promise;
    var tracksPromise = trackPickerService.query().$promise;

    $q.all([playlistPromise, tracksPromise])
    .then(function(data) {
      // let pl = angular.fromJson(angular.toJson(data[0]));
      // let trs = angular.fromJson(angular.toJson(data[1]));
      // $scope.playlist = playlistService.buildPlaylist(pl, trs);

      $scope.playlist = playlistService.buildPlaylist(data[0], data[1]);
    })
    .catch(function(error) {
      $scope.playlist = [];
      console.error(error);
    });
  }

  $scope.onDayChange();

  $scope.isMaxSizeReached = function() {
    return playlistService.isMaxSizeReached($scope.playlist);
  }


  // modal management
  $scope.animationsEnabled = true;
  $scope.close = function() {
    console.log('close');
  }

  $scope.openPicker = function(plIndex) {
    insertionIndex = plIndex;
    console.log('plIndex', plIndex);
    var modalInstance = $uibModal.open({
      // templateUrl: 'trackPicker/trackPicker.template.html'
      animation: $scope.animationsEnabled,
      component: 'picker'
    });

    modalInstance.result.then(function (selectedTracks) {
      console.log('insetionIndex : ', insertionIndex, 'reçu par la playlist', selectedTracks);
      if(insertionIndex === 0) {
        $scope.playlist = playlistService.buildPlaylist(selectedTracks.addedTracks, selectedTracks.availableTracks);
      }
    }, function () {
      console.info('track-picker dismissed at: ' + new Date());
    });
  };

}])
;
