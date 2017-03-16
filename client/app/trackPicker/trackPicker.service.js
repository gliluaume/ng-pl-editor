'use strict';

angular.module('plEditor.trackPicker')

.service('trackPickerStockService', ['trackPickerService', 'directoryService', function(trackPickerService, directoryService) {
  var svc = {
    loaded: {state: false},
    tracks: [],
    directories: [],
    load: function() {
      var promises = [trackPickerService.query().$promise, directoryService.get().$promise];
      Promise.all(promises)
      .then(function(data) {
        svc.tracks = data[0];
        svc.directories = data[1];
        svc.loaded.state = true;
        console.log('directories loaded', svc.directories);
        console.log('track stock loaded', svc.tracks);
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
