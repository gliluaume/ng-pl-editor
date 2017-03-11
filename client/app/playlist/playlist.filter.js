'use strict';
angular.module('plEditor.playlist')
.filter('duration', ['playlistService', function(playlistService) {
  return function(secondDuration) {
    return playlistService.secondsToHours(secondDuration);
  };
}])