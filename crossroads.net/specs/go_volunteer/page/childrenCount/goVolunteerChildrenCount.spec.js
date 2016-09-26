require('../../../../app/common/common.module');
require('../../../../app/go_volunteer/goVolunteer.module');

describe('Go Volunteer Children Count Page Component', function() {
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
    element = '<go-volunteer-children-count on-submit="ctrl.onSubmit(newState)"> </go-volunteer-children-count>';
    element = $compile(element)(scope);
  }));

  it('should call the onSubmit callback', function() {
    scope.$digest();
    var isolatedScope = element.isolateScope().goChildrenCount;
    isolatedScope.childrenAttending.childTwoSeven = 1;
    isolatedScope.childrenAttending.childEightTwelve = 2;
    isolatedScope.childrenAttending.childThirteenEighteen = 3;

    isolatedScope.submit();

    expect(GoVolunteerService.childrenAttending.childTwoSeven).toBe(1);
    expect(GoVolunteerService.childrenAttending.childEightTwelve).toBe(2);
    expect(GoVolunteerService.childrenAttending.childThirteenEighteen).toBe(3);
    expect(scope.ctrl.onSubmit).toHaveBeenCalled();
  });

});
