require('../../../../app/common/common.module');
require('../../../../app/go_volunteer/goVolunteer.module');

describe('Go Volunteer Group Finder Component', function() {
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
  var GroupConnectors;
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
    GroupConnectors = $injector.get('GroupConnectors');
    scope = $rootScope.$new();

    scope.ctrl = {
      onSubmit: jasmine.createSpy('onSubmit').and.callThrough()
    };

    element = '<go-volunteer-group-find-connector on-submit="ctrl.onSubmit(newState)"></go-volunteer-group-find-connector>';
    element = $compile(element)(scope);
  })); 

  describe('Organization is Crossroads', function() {
    beforeEach(function() {
      GoVolunteerService.organization = helpers.crossroads_organization;
      scope.$digest();
      isolated = element.isolateScope().goGroupFindConnector;
      $httpBackend.whenGET(window.__env__['CRDS_API_ENDPOINT'] +
                           'api/group-connectors/open-orgs/1')
      .respond(200, helpers.crossroads_group_connectors);
      
    });
  });

  describe('Organization is Other', function() {
    beforeEach(function() {
      GoVolunteerService.organization = helpers.other_organization;
      scope.$digest();
      isolated = element.isolateScope().goGroupFindConnector;
      $httpBackend.whenGET(window.__env__['CRDS_API_ENDPOINT'] +
                           'api/group-connectors/open-orgs/1')
      .respond(200, helpers.crossroads_group_connectors);
      
    });
  });

  describe('Organization is Archdio', function() {
    beforeEach(function() {
      GoVolunteerService.organization = helpers.arch_organization;
      scope.$digest();
      isolated = element.isolateScope().goGroupFindConnector;
      $httpBackend.whenGET(window.__env__['CRDS_API_ENDPOINT'] +
                           'api/group-connectors/' + helpers.arch_organization.organizationId + '/1')
      .respond(200, helpers.crossroads_group_connectors);
    });

  });

  it('should go to unique-skills', function() {
    scope.$digest();
    isolated = element.isolateScope().goGroupFindConnector;
    isolated.createGroup();
    expect(scope.ctrl.onSubmit).toHaveBeenCalled();
  });

});
