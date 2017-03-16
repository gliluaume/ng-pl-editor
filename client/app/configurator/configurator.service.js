'use strict';
angular.module('plEditor.configurator')
.service('configuratorService', [function() {
  var svc = {
    values : {
      showVideoInPlaylist: true,
      showVideoInPicker: true,
      compactVue: false,
      confirmAction: false,
      animationsEnabled: true
    }
  };
  return svc;
}])
;