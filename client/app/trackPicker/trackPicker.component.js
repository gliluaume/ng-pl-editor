'use strict';

angular.module('plEditor.trackPicker')
.component('picker', {
  templateUrl: 'trackPicker/trackPicker.template.html',
  
  bindings: {
    resolve: '<',
    dismiss: '&',  // angular-ui built in function
    close: '&' 
  },

  controller: ['playlistService', 'trackPickerStockService','configuratorService', function(playlistService, trackPickerStockService, configuratorService) {
    this.tracksToAdd = [];
    this.cfg = configuratorService.values;
    this.sortableOptions = {};
    this.availableSpace = playlistService.availableSpace;
    this.addAllowed = true;

    let self = this;
    this.$onInit = function() {
      self.selectedDir = self.resolve.selectedDir;
      this.availableTracks = trackPickerStockService.tracks
      .filter(track => (track.origin === self.selectedDir) || (track.origin === 'cmn'));
    };

    var setAddAllowed = function() {
      var stackLength = self.tracksToAdd.reduce((acc, item) => acc + item.duration, 0);
      self.addAllowed = stackLength < self.availableSpace().seconds;
    }

    self.addTrack = function(track) {
      console.log('adding track', track);
      self.tracksToAdd.push(track);
      console.log('available space', playlistService.availableSpace());
      setAddAllowed();
    };

    self.remove = function(index) {
      self.tracksToAdd = [...self.tracksToAdd.slice(0, index), ...self.tracksToAdd.slice(index + 1)];
      console.log('index', index, self.tracksToAdd);
    };

    self.ok = function() {
      self.close({ 
        $value:  self.tracksToAdd.map((item) => item.id)
      });
    };

    self.cancel = function() {
      console.log('cancelled');
      self.dismiss();
    };
  }]
})
