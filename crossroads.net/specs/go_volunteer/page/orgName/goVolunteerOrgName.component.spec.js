require('../../../../app/common/common.module');
require('../../../../app/go_volunteer/goVolunteer.module');

describe('Go Volunteer Other Organization Component', function() {

  var CONSTANTS = require('crds-constants');
  var MODULE = CONSTANTS.MODULES.GO_VOLUNTEER;

  var helpers = require('../../goVolunteer.helpers');

  var $compile;
  var $rootScope;
  var element;
  var scope;
  var $httpBackend;
  var GoVolunteerService;
  var Organizations;
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
    Organizations = $injector.get('Organizations'); 
    scope = $rootScope.$new();

    scope.ctrl = {
      onSubmit: jasmine.createSpy('onSubmit').and.callThrough()
    };

    element = '<go-volunteer-org-name on-submit="ctrl.onSubmit(newState)"></go-volunteer-org-name>';
    element = $compile(element)(scope);
    scope.$digest();
    isolated = element.isolateScope();
    $httpBackend.whenGET( window.__env__['CRDS_API_ENDPOINT'] + 
                           'api/organizations/other').respond(200, helpers.otherOrganizations);
    isolated.goOrgName.activate();
    $httpBackend.flush();
    $httpBackend.expectGET( window.__env__['CRDS_API_ENDPOINT'] + 
                           'api/organizations/other');

  }));

  it('should query for other organizations', function() {
    $httpBackend.expectGET( window.__env__['CRDS_API_ENDPOINT'] + 
                           'api/organizations/other');
    expect(element.isolateScope().goOrgName.availableOptions.length).toEqual(helpers.otherOrganizations.length);
  });

  it('should save the org I entered', function() {
    isolated.goOrgName.otherOrgName = 'xroads';
    isolated.goOrgName.submit();
    expect(GoVolunteerService.otherOrgName).toBe('xroads');
    expect(scope.ctrl.onSubmit).toHaveBeenCalled();
  });

  it('shold not save anything if I dont enter a value', function() {
    isolated.goOrgName.submit();
    expect(GoVolunteerService.otherOrgName).toBeNull();
    expect(scope.ctrl.onSubmit).toHaveBeenCalled();
  });
});
