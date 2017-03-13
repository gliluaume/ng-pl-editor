'use strict';

angular
.module('plEditor.trackPicker')
.component('picker', {
  templateUrl: 'trackPicker/trackPicker-alt.template.html',
  
  bindings: {
    dismiss: '&',  // angular-ui built in function
    close: '&' 
  },

  controller: ['playlistService', 'trackPickerService','configuratorService', function(playlistService, trackPickerService, configuratorService) {
    this.addedTracks = [];
    this.cfg = configuratorService.values;
    this.sortableOptions = {};
    this.availableTracks = trackPickerService.query();
    this.availableSpace = playlistService.availableSpace;
    this.pl = playlistService.playlist;
    this.addAllowed = true;

    let self = this;
    var setAddAllowed = function() {
      var stackLength = self.addedTracks.reduce(function(acc, item) { 
        return acc + item.duration;
      }, 0);

      self.addAllowed = stackLength < self.availableSpace().seconds;
    }

    self.addTrack = function(track) {
      console.log('adding track', track);
      self.addedTracks.push(track);
      console.log(self.pl.length);
      console.log('available space', playlistService.availableSpace());
      setAddAllowed();
    };

    self.remove = function(index) {
      console.log('index', index);
    };

    self.ok = function () {
      self.close({ 
        $value: {
          addedTracks: self.addedTracks.map(function(item) { return item.id; }),
          availableTracks: self.availableTracks
        }
      });
    };

    self.cancel = function() {
      console.log('cancelled');
      self.dismiss();
    };
  }]
})
