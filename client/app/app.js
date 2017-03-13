'use strict';

// Declare app level module which depends on views, and components
angular.module('plEditor', [
  'plEditor.version',
  'plEditor.playlist',
  'plEditor.trackPicker',
  'plEditor.configurator',
  'ui.bootstrap'
])

.run(['trackPickerStockService', function(trackPickerStockService) {
  trackPickerStockService.load();
}])
;
