(function() {
  'use strict';

  var MODULE = require('crds-constants').MODULES.COMMON;

  angular.module(MODULE)
    .factory('StaffContact', require('./staffContact.service'))
    .factory('Room', require('./room.service'))
    .factory('LookupService', require('./lookup.service'))
    .service('ZipcodeService', require('./zipcode.service'))
    ;

})();
