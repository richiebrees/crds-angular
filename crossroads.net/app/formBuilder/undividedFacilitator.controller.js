(function() {
  'use strict';

  module.exports = UndividedFacilitatorCtrl;

  UndividedFacilitatorCtrl.$inject = ['$rootScope', 'Group', 'Session', 'ProfileReferenceData', 'Profile'];

  function UndividedFacilitatorCtrl($rootScope, Group, Session, ProfileReferenceData, Profile) {
    var vm = this;

    var constants = require('crds-constants');
    var attributeTypeIds = require('crds-constants').ATTRIBUTE_TYPE_IDS;
    //TODO Decide if you member or leader - now always leader
    var participant = {
      capacity: 1,
      contactId: parseInt(Session.exists('userId')),
      groupRoleId: constants.GROUP.ROLES.LEADER,
      childCareNeeded: false,
      sendConfirmationEmail: false,
      attributeTypes: {},
    };

    vm.responses = {};
    vm.saving = false;
    vm.save = save;
    vm.viewReady = false;

    activate();

    function activate() {
      //TODO only load profile data if profile field in CMS form builder
      ProfileReferenceData.getInstance().then(function(response) {

        vm.responses.genders = response.genders;
        vm.responses.maritalStatuses = response.maritalStatuses;
        vm.responses.serviceProviders = response.serviceProviders;
        vm.responses.groupParticipant = participant;
        //vm.states = response.states;
        //vm.countries = response.countries;
        //vm.crossroadsLocations = response.crossroadsLocations;
        var contactId = Session.exists('userId');

        Profile.Person.get({contactId: contactId},function(data) {
          vm.responses.profileData = { person: data };
          vm.responses.ethnicities = vm.responses.profileData.person.attributeTypes[attributeTypeIds.ETHNICITY].attributes;

          vm.viewReady = true;
        });

      });
    }

    function save(){
      vm.saving = true;
      try {
          // TODO: Need to return promises from save methods and then wait on all to turn of vm.saving
          savePersonal();
          saveGroup();
      }
      catch (error) {
        vm.saving = false;
        throw (error);
      }
    }

    function savePersonal() {
        vm.responses.profileData.person['State/Region'] = vm.responses.profileData.person.State;
        // TODO: See if there is a better way to pass the server check for changed email address
        vm.responses.profileData.person.oldEmail = vm.responses.profileData.person.emailAddress;
        vm.responses.profileData.person.$save(function() {
           $rootScope.$emit('notify', $rootScope.MESSAGES.successfullRegistration);
           vm.saving = false;
         },
         function() {
           $rootScope.$emit('notify', $rootScope.MESSAGES.generalError);
           $log.debug('person save unsuccessful');
           vm.saving = false;
         });
    }

    function saveGroup() {
        var singleAttributes = _.cloneDeep(vm.responses.singleAttributes);
        var coFacilitator = vm.responses[constants.CMS.FORM_BUILDER.FIELD_NAME.COFACILITATOR];

        if (coFacilitator && coFacilitator !== '') {

          var item = {
            attribute: {
              attributeId: constants.ATTRIBUTE_IDS.COFACILITATOR
            },
            notes: coFacilitator,
          };

          singleAttributes[constants.ATTRIBUTE_TYPE_IDS.COFACILITATOR] = item;
        }

        // var participant = [{
        //   capacity: 1,
        //   contactId: parseInt(Session.exists('userId')),
        //   groupRoleId: constants.GROUP.ROLES.LEADER,
        //   childCareNeeded: vm.responses.Childcare,
        //   sendConfirmationEmail: false,
        //   singleAttributes: singleAttributes,
        //   attributeTypes: {},
        // }];

        //participant.childCareNeeded = vm.responses.groupParticipant.childCareNeeded;
        //participant.singleAttributes = singleAttributes;
debugger;
        var participants = [vm.responses.groupParticipant];
        //TODO groupId will change with new groups
        Group.Participant.save({
          groupId: constants.GROUP.GROUP_ID.UNDIVIDED_FACILITATOR,
        }, participants).$promise.then(function(response) {
          $rootScope.$emit('notify', $rootScope.MESSAGES.successfullRegistration);
          vm.saving = false;
        }, function(error) {
          $rootScope.$emit('notify', $rootScope.MESSAGES.generalError);
          vm.saving = false;
        });
    }
  }

})();
