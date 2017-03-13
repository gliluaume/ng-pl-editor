'use strict';

angular.module('plEditor.trackPicker')

.service('trackPickerStockService', ['trackPickerService', function(trackPickerService) {
  var svc = {
    loaded: {state: false},
    tracks: [],
    load: function() {
      trackPickerService.query().$promise
      .then(function(data) {
        svc.tracks = data;
        svc.loaded.state = true;
        console.log('track stock loaded');
      })
      .catch(function(error) {
        console.error(error);
      });
    }
  };
  return svc;
  }
])

.service('trackPickerService', ['$resource', function($resource) {
  return $resource('/api/track', {}, {
      query: {
        method: 'GET',
        isArray: true
      }    
    });
  }
])
