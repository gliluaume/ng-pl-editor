'use strict';

angular.module('plEditor.directory')
.service('directoryService', ['$resource', function($resource) {
  return $resource('/api/directory', null, {
    get: {
      method: 'GET',
      isArray: true
    }
  }); 
}])
;