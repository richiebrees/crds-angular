(function() {
  'use strict';

  var MODULE = require('crds-constants').MODULES.FORM_BUILDER;

  angular.module(MODULE, ['crossroads.core', 'crossroads.common'])
    .config(require('./formBuilder.routes'))
    .factory('FormBuilderService', require('./formBuilder.service'))
    .directive('formBuilder', require('./formBuilder.directive'))
    .directive('formField', require('./formField.directive'))
    .controller('FormBuilderDefaultCtrl', require('./formBuilderDefault.controller'))
    .controller('UndividedFacilitatorCtrl', require('./undividedFacilitator.controller'))
    ;

  //Require Templates
  require('./templates/formBuilder.html');
  require('./templates/defaultField.html');
  require('./templates/editableBooleanField.html');
  require('./templates/editableCheckbox.html');
  require('./templates/editableCheckboxGroupField.html');
  require('./templates/editableNumericField.html');
  require('./templates/editableRadioField.html');
  require('./templates/editableTextField.html');
  require('./templates/groupParticipantChildcare.html');
  require('./templates/groupParticipantCoFacilitator.html');
  require('./templates/groupParticipantFacilitatorTraining.html');  
  require('./templates/groupParticipantKickOffEvent.html'); 
  require('./templates/groupParticipantPreferredSession.html'); 
  require('./templates/profileEmail.html');
  require('./templates/profileEthnicity.html');  
  require('./templates/profileGender.html'); 
  require('./templates/profileName.html');
  
})();
