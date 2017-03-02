'use strict';

angular
.module('plEditor.trackPicker')
.component('picker', {
  templateUrl: 'trackPicker/trackPicker.template.html',
  
  bindings: {
    dismiss: '&',  // angular-ui built in function
    close: '&' 
  },

  controller: ['playlistService', 'trackPickerService', function(playlistService, trackPickerService) {
    this.addedTracks = [];
    this.items = ["One", "Two", "Three"];

    this.sortableOptions = {
      update: function(e, ui) { 
        console.log('hola', e, ui);
       },
      axis: 'x'
    };

    console.log('hola in controller track picker');
    this.availableTracks = trackPickerService.query();

    this.availableSpace = playlistService.availableSpace;
    this.pl = playlistService.playlist;
    this.addAllowed = true;

    let self = this;
    var setAddAllowed = function() {
      // console.log('allowed', typeof self.stackLength, typeof self.availableSpace().seconds);
      // console.log('allowed', self.stackLength < self.availableSpace().seconds);
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
