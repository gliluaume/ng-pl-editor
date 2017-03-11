'use strict';
angular.module('plEditor.configurator')
.service('configuratorService', [function() {
  var svc = {
    values : {
      showVideoInPlaylist: false,
      confirmAction: true,
      animationsEnabled: true,
      videoHeight: 120,
      videoWidth: 160
    }
  };
  return svc;
}])
;