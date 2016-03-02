(function() {
  'use strict';

  var MODULE = require('crds-constants').MODULES.GO_VOLUNTEER;

  require('./goVolunteerPage.template.html');
  require('./select_church/');

  angular.module(MODULE)
    .directive('goVolunteerPage', require('./goVolunteerPage.component'));


})();
