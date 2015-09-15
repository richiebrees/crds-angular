(function() {
  'use strict';

  module.exports = Page0Controller;

  Page0Controller.$inject = ['TripsSignupService', 'Campaign', 'Family'];

  function Page0Controller(TripsSignupService, Campaign, Family) {

    var vm = this;
    vm.familyMembers = Family;
    vm.signupService = TripsSignupService;

    activate();

    ////////////////////////////////
    //// IMPLEMENTATION DETAILS ////
    ////////////////////////////////
    function activate() {
      vm.signupService.reset(Campaign);
      vm.signupService.activate();
    }

  }
})();
