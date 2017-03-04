'use strict';

angular.module('plEditor.configurator')
.component('configuratorButton', {
  transclude:true,
  templateUrl: 'configurator/configurator.button.template.html',
  controller: ['$uibModal', 'configuratorService', function($uibModal, configuratorService) {

    var self = this;
    self.openPicker = function() {
      var modalInstance = $uibModal.open({
        animation: configuratorService.values.animationsEnabled,
        templateUrl: 'configurator/configurator.template.html',
        controllerAs: '$ctrl',
        controller: ['$uibModalInstance', 'configuratorService', function($uibModalInstance, configuratorService) {
          var self = this;
          self.cfg = configuratorService.values;
          self.close = function() {
            $uibModalInstance.close();
          };
        }]
      });

      modalInstance.result.then(function(data) {
        console.log(configuratorService.values);
        console.log('data', data);
      }, function () {
        console.info('configurator dismissed');
      });
    };
  }]
})
