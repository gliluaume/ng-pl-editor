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
    // this.availableTracks = [
    //   {
    //   'id': 9,
    //   'filepath': 'video/CAP_0009_180630.mp4',
    //   'alias': 'LE WHARLF DE BASSAM.mpg.mobile1080p_H264_@_MP3_@.MPEG4.MP4',
    //   'title': 'Test capsule',
    //   'description': 'Capsule en HD',
    //   'typeDesc': 'Capsule',
    //   'duration':180
    //   },
    //   {
    //   'id': 7,
    //   'filepath': 'video/CAP_0007_180630.mp4',
    //   'alias': 'La pirogue de génération Félix Houphouët Boigny appelée FA ELE ou ABY SALAMAN .mpg.mobile1080p_H264_@_MP3_@.MPEG4.MP4',
    //   'title': 'Ma première capsule',
    //   'description': 'La pirogue de génération Félix Houphouët Boigny',
    //   'typeDesc': 'Capsule',
    //   'duration':181
    //   },
    //   {
    //   'id': 3,
    //   'filepath': 'video/CAP_0003_180630.mp4',
    //   'title': 'Ma deuxième capsule',
    //   'alias': 'ROYAUME DU SANWI.mpg.mobile1080p_H264_@_MP3_@.MPEG4.MP4',
    //   'description': 'Le royaume du Sanwi',
    //   'typeDesc': 'Publicité',
    //   'duration':180
    //   }
    // ];
    console.log('hola in controller track picker');
    this.availableTracks = trackPickerService.query();

    let self = this;
    self.addTrack = function(track) {
      //console.log('adding track', track);
      self.addedTracks.push(track);
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
