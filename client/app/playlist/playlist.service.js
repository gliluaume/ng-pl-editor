'use strict';

angular
.module('plEditor.playlist')
.service('playlistService', ['$filter', function($filter) {
  var plStartTime = 21600;
  // var plEndTime = 86400;
  var plEndTime = 25400;
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

  var secondsToHours = function (secondsFormMidnight) {
    var hours   = Math.floor(secondsFormMidnight / 3600);
    var minutes = Math.floor((secondsFormMidnight - (hours * 3600)) / 60);
    var seconds = secondsFormMidnight - (hours * 3600) - (minutes * 60);

    hours = padLeft(hours, '0', 2);
    minutes = padLeft(minutes, '0', 2);
    seconds = padLeft(seconds, '0', 2);

    return `${hours}:${minutes}:${seconds}`;
  };

  var calculateStartTime = function(newTrack, enrichedPlaylist) {
    if(enrichedPlaylist.length === 0) {
      newTrack.startTime = plStartTime;
    } else {
      var lastTrack = enrichedPlaylist[enrichedPlaylist.length - 1];
      newTrack.startTime = lastTrack.startTime + lastTrack.duration;
    }
    newTrack.literalStart = secondsToHours(newTrack.startTime);
  };

  var plSecondEnd = function(playlist) {
    return playlist[playlist.length - 1].startTime + playlist[playlist.length - 1].duration;
  }

  var svc = {};
  svc.playlist = [];
  svc.playlistStart = plStartTime;
  svc.playlistEnd = plEndTime;

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
        apiAlias: apiDays[i],
        lblNg: $filter('date')(d, 'EEEE')
      })
    }
    console.log('days', days);
    return days;
  };

  svc.buildPlaylist = function(rawPlaylist, tracks) {      
    var enrichedPlaylist = [];
    if(rawPlaylist.length > 0) {
      rawPlaylist.forEach(function(trackId) {
        var track = tracks.filter(function(track) {
          return track.id == trackId;
        }).pop();
        calculateStartTime(track, enrichedPlaylist);
        enrichedPlaylist.push(Object.assign({}, track));
      });
      enrichedPlaylist = enrichedPlaylist;
      console.log('enrichedPlaylist', enrichedPlaylist, enrichedPlaylist.length);
    }
    svc.playlist = enrichedPlaylist;

    return svc.playlist;
  };

  svc.isMaxSizeReached = function(playlist) {
    return playlist[playlist.length - 1].startTime >= svc.playlistEnd;
  };

  svc.plRange = function(playlist) {
    if(playlist.length > 0) {
      let plEnd = secondsToHours(plSecondEnd(playlist));
      return `${playlist[0].literalStart} - ${plEnd}`
    }
    return '--';
  }

  svc.availableSpace = function(pl) {
    let playlist = pl ? pl : svc.playlist;
    let availableSeconds = (svc.playlistEnd - svc.playlistStart) - (plSecondEnd(playlist) - playlist[0].startTime); 
    return {
      seconds: availableSeconds,
      literal: secondsToHours(availableSeconds)
    }
  }

  svc.plRate = function(playlist) {
    console.log('in svc', playlist);
    if(playlist.length > 0) {
      let toto = Math.min(100, Math.round( 100 * (plSecondEnd(playlist) - playlist[0].startTime) / (svc.playlistEnd - svc.playlistStart) ));
      return toto;
    }
    return 0;
  }

  return svc;
}])

.service('playlistRepoService', ['$resource', function($resource) {
  return $resource('/api/playlist/:day', { day: 'mon'}, {
    get: {
      method: 'GET',
      isArray: true
    },
    patch: {
      method: 'PATCH'
    }
  }); 
}])
