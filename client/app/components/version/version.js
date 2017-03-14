'use strict';

angular
.module('plEditor.version', [
  'plEditor.version.interpolate-filter',
  'plEditor.version.version-directive'
])

.value('version', '0.3');
