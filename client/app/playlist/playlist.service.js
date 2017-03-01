'use strict';

angular
.module('plEditor.playlist')
.service('playlistService', [function() {
  var plStartTime = 21600;
  var padLeft = function(text, char, len) {
    text = text.toString();
    char = char.toString();

    if(len <= text.length) 
      return text;
    var padder = (new Array(Math.max(len - text.length, 0) + 1))
      .join(char)
      .split('')
      .reduce(function(acc, elt){ 
        return acc + elt
      });

    return padder + text;
  };

  var __secondsToHours = function (secondsFormMidnight) {
    var hours   = Math.floor(secondsFormMidnight / 3600);
    var minutes = Math.floor((secondsFormMidnight - (hours * 3600)) / 60);
    var seconds = secondsFormMidnight - (hours * 3600) - (minutes * 60);

    hours = padLeft(hours, '0', 2);
    minutes = padLeft(minutes, '0', 2);
    seconds = padLeft(seconds, '0', 2);

    return `${hours}:${minutes}:${seconds}`;
  };

  var __calculateStartTime = function(newTrack, enrichedPlaylist) {
    if(enrichedPlaylist.length === 0) {
      newTrack.startTime = plStartTime;
    } else {
      var lastTrack = enrichedPlaylist[enrichedPlaylist.length - 1];
      newTrack.startTime = lastTrack.startTime + lastTrack.duration;
    }
    newTrack.literalStart = __secondsToHours(newTrack.startTime);
  };


  var svc = {};
  svc.createDaysLocal = function() {
    var apiDays = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
    // peuple la liste des jours:
    var days = [];
    var d = new Date(1970, 0, 1);
    d.setDate(d.getDate() - 5);
    for(var i = 0; i < 7; i++){
      d.setDate(d.getDate() + 1);
      days.push({
        index: i, 
        label: d.toLocaleString(window.navigator.language, {weekday: 'long'}),
        apiAlias: apiDays[i]
      })
    }
    console.log(days);
    return days;
  };

  svc.buildPlaylist = function(rawPlaylist, tracks) {      
    var enrichedPlaylist = [];
    console.log(rawPlaylist, typeof rawPlaylist, rawPlaylist.prototype);
    if(rawPlaylist.length > 0) {
      rawPlaylist.forEach(function(trackId) {
        console.log(trackId);
        var track = tracks.filter(function(track) {
          return track.id == trackId;
        }).pop();
        __calculateStartTime(track, enrichedPlaylist);
        console.log(track);
        enrichedPlaylist.push(Object.assign({}, track));
      });
      enrichedPlaylist = enrichedPlaylist;
      console.log('enrichedPlaylist');
      console.log(enrichedPlaylist, enrichedPlaylist.length);

    }
    return enrichedPlaylist;
  };

  svc.playlistEnd = 86400;
  svc.isMaxSizeReached = function(playlist) {
    return playlist[playlist.length - 1].startTime >= svc.playlistEnd;
  };

  return svc;
}])

.service('playlistRepoService', ['$resource', function($resource) {
  return $resource('/api/playlist/:day', { day: 'mon'}, {
    get: {
      method: 'GET',
      isArray: true
    }
  }); 
}])
