'use strict';
angular.module('plEditor.configurator')
.service('configuratorService', [function() {
  var svc = {
    values : {
      showVideoInPlaylist: true,
      confirmAction: true,
      animationsEnabled: true,
      videoHeight: 120,
      videoWidth: 160
    }
  };
  return svc;
}])
;