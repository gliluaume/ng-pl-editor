'use strict';
angular.module('plEditor.configurator')
.service('configuratorService', [function() {
  var svc = {
    values : {
      showVideoInPlaylist: false,
      showVideoInPicker: false,
      compactVue: true,
      confirmAction: false,
      animationsEnabled: true
    }
  };
  return svc;
}])
;