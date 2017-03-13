'use strict';
angular.module('plEditor.configurator')
.service('configuratorService', [function() {
  var svc = {
    values : {
      showVideoInPlaylist: false,
      showVideoInPicker: true,
      compactVue: true,
      confirmAction: true,
      animationsEnabled: true,
      videoHeight: 120,
      videoWidth: 160
    }
  };
  return svc;
}])
;