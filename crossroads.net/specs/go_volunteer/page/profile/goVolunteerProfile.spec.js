require('../../../../app/common/common.module');
require('../../../../app/go_volunteer/goVolunteer.module');

describe('Go Volunteer Profile Page Component', function() {
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
    $provide.value('$state', { get: function() {}, current: {name: 'go-volunteer.crossroadspage'} });
  }));

  beforeEach(inject(function(_$compile_, _$rootScope_, $injector) {
    $compile = _$compile_;
    $rootScope = _$rootScope_;

    $rootScope.MESSAGES = {
      generalError: 'generalError'
    };

    spyOn($rootScope, '$emit').and.callThrough();

    GoVolunteerService = $injector.get('GoVolunteerService');
    GoVolunteerService.person = angular.copy(helpers.person);

    Validation = $injector.get('Validation');

    scope = $rootScope.$new();
    scope.ctrl = {
      onSubmit: jasmine.createSpy('onSubmit').and.callThrough()
    };
    element = '<go-volunteer-profile on-submit="ctrl.onSubmit(newState)"></go-volunteer-profile>';
    element = $compile(element)(scope);
  }));

  it('should fail if firstName is empty', function() {
    scope.$digest();
    var isolatedScope = element.isolateScope().volunteerProfile;
    isolatedScope.profileForm.firstName.$setViewValue(null);
    isolatedScope.submit();
    expect($rootScope.$emit).toHaveBeenCalledWith('notify', 'generalError');
    expect(isolatedScope.profileForm.firstName.$error.required).toBeTruthy();
  });

  it('should fail if age is less than 18', function() {
    scope.$digest();
    var isolatedScope = element.isolateScope().volunteerProfile;
    var now = new Date();
    var fiveYearsAgo = now.getFullYear() - 5;
    var under18 = '11/20/' + fiveYearsAgo + '';

    isolatedScope.profileForm.firstName.$setViewValue(helpers.person.firstName);
    isolatedScope.profileForm.lastName.$setViewValue(helpers.person.lastName);
    isolatedScope.profileForm.email.$setViewValue(helpers.person.emailAddress);
    isolatedScope.profileForm.birthdate.$setViewValue(under18);
    isolatedScope.profileForm.phone.$setViewValue(helpers.person.mobilePhone);

    isolatedScope.submit();

    expect($rootScope.$emit).toHaveBeenCalledWith('notify', 'generalError');
    expect(isolatedScope.profileForm.birthdate.$error.maxDate).toBeTruthy();
  });

  it('should show an error message if the form is invalid', function() {
    scope.$digest();
    var isolatedScope = element.isolateScope().volunteerProfile;
    isolatedScope.profileForm.firstName.$setViewValue(null);
    isolatedScope.submit();
    expect($rootScope.$emit).toHaveBeenCalledWith('notify', 'generalError');
    isolatedScope.profileForm.firstName.$setViewValue(helpers.person.firstName);
  });

  it('should call the onSubmit callback', function() {
    scope.$digest();
    var isolatedScope = element.isolateScope().volunteerProfile;
    isolatedScope.profileForm.firstName.$setViewValue(helpers.person.firstName);
    isolatedScope.profileForm.lastName.$setViewValue(helpers.person.lastName);
    isolatedScope.profileForm.email.$setViewValue(helpers.person.emailAddress);
    isolatedScope.profileForm.birthdate.$setViewValue(helpers.person.dateOfBirth);
    isolatedScope.profileForm.phone.$setViewValue(helpers.person.mobilePhone);

    isolatedScope.submit();

    expect(isolatedScope.profileForm.lastName.$error.required).toBeFalsy();
    expect(scope.ctrl.onSubmit).toHaveBeenCalled();
  });

});
