require('../../../../app/common/common.module');
require('../../../../app/go_volunteer/goVolunteer.module');

describe('Go Volunteer Prep Work Component', function() {

  var CONSTANTS = require('crds-constants');
  var MODULE = CONSTANTS.MODULES.GO_VOLUNTEER;

  var helpers = require('../../goVolunteer.helpers');

  var $compile;
  var $rootScope;
  var element;
  var scope;
  var $httpBackend;
  var GoVolunteerService;
  var Validation;
  var isolated;

  beforeEach(function() {
    angular.mock.module(MODULE);
  });

  beforeEach(angular.mock.module(function($provide) {
    $provide.value('$state', { get: function() {} });
  }));

  
  beforeEach(inject(function(_$compile_, _$rootScope_, $injector) {
    $compile = _$compile_;
    $rootScope = _$rootScope_;
    $httpBackend = $injector.get('$httpBackend');
    
    GoVolunteerService = $injector.get('GoVolunteerService');
    GoVolunteerService.prepWork = angular.copy(helpers.prepWork);
    scope = $rootScope.$new();

    scope.ctrl = {
      onSubmit: jasmine.createSpy('onSubmit').and.callThrough()
    };
  }));

  describe('My Prep Time Availability', function() {

    beforeEach(function() {
      element = '<go-volunteer-available-prep on-submit="ctrl.onSubmit(nextState)"></go-volunteer-available-prep>';
      element = $compile(element)(scope);
    });

    it('should have a list of prep work options', function() {
      scope.$digest();
      isolated = element.isolateScope().goAvailablePrep;
      expect(isolated.prepWork.length).toEqual(helpers.prepWork.length);
    });

    it('should call onSubmit if there is no prep times', function() {
      GoVolunteerService.prepWork = [];
      scope.$digest();
      isolated = element.isolateScope().goAvailablePrep;
      expect(scope.ctrl.onSubmit).toHaveBeenCalledWith('waiver'); 
    });

    it('should call onSubmit if prep times is undefined', function() {
      GoVolunteerService.prepWork = undefined;
      scope.$digest();
      isolated = element.isolateScope().goAvailablePrep;
      expect(scope.ctrl.onSubmit).toHaveBeenCalledWith('waiver'); 
    });

    it('should set my prepTime preference and continue to my spouse option', function() {
      scope.$digest();
      isolated = element.isolateScope().goAvailablePrep;
      isolated.chooseTime(helpers.prepWork[0]);
      expect(GoVolunteerService.myPrepTime).toEqual(helpers.prepWork[0]);
      expect(scope.ctrl.onSubmit).toHaveBeenCalledWith('available-prep-spouse');
    });

    it('should set my prepTime preference to false and continue to spouse option', function() {
      scope.$digest();
      isolated = element.isolateScope().goAvailablePrep;
      isolated.chooseTime(false);
      expect(GoVolunteerService.myPrepTime).toEqual(false);
      expect(scope.ctrl.onSubmit).toHaveBeenCalledWith('available-prep-spouse');
    });
  });

  describe('My Spouses Prep Time Availability', function() {
    
    beforeEach(function() {
      element = '<go-volunteer-available-prep on-submit="ctrl.onSubmit(nextState)" for-spouse="true">' + 
                '</go-volunteer-available-prep>';
      element = $compile(element)(scope);
    });

    it('should set have the list of prep work options', function() {
      scope.$digest();
      isolated = element.isolateScope().goAvailablePrep;
      expect(isolated.prepWork.length).toEqual(helpers.prepWork.length);
    });

    it('should set my spouses prepTime preference and continue to the waiver option', function() {
      scope.$digest();
      isolated = element.isolateScope().goAvailablePrep;
      isolated.chooseTime(helpers.prepWork[0]);
      expect(GoVolunteerService.spousePrepTime).toEqual(helpers.prepWork[0]);
      expect(scope.ctrl.onSubmit).toHaveBeenCalledWith('waiver');
    });

    it('should set my spouses prepTime preference to false and continue to waiver option', function() {
      scope.$digest();
      isolated = element.isolateScope().goAvailablePrep;
      isolated.chooseTime(false);
      expect(GoVolunteerService.spousePrepTime).toEqual(false);
      expect(scope.ctrl.onSubmit).toHaveBeenCalledWith('waiver');
    });


  });

});
