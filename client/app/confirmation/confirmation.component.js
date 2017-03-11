'use strict';
angular.module('plEditor.confirmation')
.component('confirmator', {
  templateUrl: 'confirmation/confirmation.template.html',

  bindings: {
    dismiss: '&',  // angular-ui built in function
    close: '&' 
  },
  
  controller: [function() {
    this.action = 'Ajouter';
    let self = this;

    self.ok = function () {
      self.close({ 
        $value: {
          response: true
        }
      });
    };

    self.cancel = function() {
      console.log('cancelled');
      self.dismiss();
    };
  }]
})