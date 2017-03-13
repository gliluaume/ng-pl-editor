'use strict';

angular.module('plEditor.trackPicker')
.component('picker', {
  templateUrl: 'trackPicker/trackPicker-alt.template.html',
  
  bindings: {
    dismiss: '&',  // angular-ui built in function
    close: '&' 
  },

  controller: ['playlistService', 'trackPickerStockService','configuratorService', function(playlistService, trackPickerStockService, configuratorService) {
    this.addedTracks = [];
    this.cfg = configuratorService.values;
    this.sortableOptions = {};
    this.availableTracks = trackPickerStockService.tracks;
    this.availableSpace = playlistService.availableSpace;
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
      console.log('available space', playlistService.availableSpace());
      setAddAllowed();
    };

    self.remove = function(index) {
      console.log('index', index);
    };

    self.ok = function () {
      self.close({ 
        $value:  self.addedTracks.map(function(item) { return item.id; })
      });
    };

    self.cancel = function() {
      console.log('cancelled');
      self.dismiss();
    };
  }]
})
