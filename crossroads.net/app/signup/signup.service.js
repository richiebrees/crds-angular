(function() {
  'use strict';

  module.exports = SignupService;

  SignupService.$inject = [];

  function SignupService() {
    var service = {
      cmsInfo: {},
      group: {},
      events: []
    };

    return service;
  }
})();
