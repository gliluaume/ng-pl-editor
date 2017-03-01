'use strict';

angular
.module('plEditor.trackPicker')
.service('trackPickerService', ['$resource', function($resource) {
  return $resource('/api/track', {}, {
      query: {
        method: 'GET',
        isArray: true
      }    
    });
  }
])
