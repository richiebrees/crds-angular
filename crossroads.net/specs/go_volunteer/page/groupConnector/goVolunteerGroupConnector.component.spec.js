require('../../../../app/common/common.module');
require('../../../../app/go_volunteer/goVolunteer.module');

describe('Go Volunteer Group Connector Component', function() {
  var CONSTANTS = require('crds-constants');
  var MODULE = CONSTANTS.MODULES.GO_VOLUNTEER;

  var helpers = require('../../goVolunteer.helpers');

  var $compile;
  var $rootScope;
  var element;
  var scope;
  var $httpBackend;
  var GoVolunteerService;
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
    scope = $rootScope.$new();

    scope.ctrl = {
      onSubmit: jasmine.createSpy('onSubmit').and.callThrough()
    };

    element = '<go-volunteer-group-connector on-submit="ctrl.onSubmit(newState)"></go-volunteer-group-connector>';
    element = $compile(element)(scope);
  }));

  describe('Choose not to serve with a group', function() {
    it('should call the onSubmit callback', function() {
      scope.$digest();
      var isolatedScope = element.isolateScope().goGroupConnector;
      isolatedScope.submit(false);

      expect(GoVolunteerService.privateGroup).toBe(true);
      expect(scope.ctrl.onSubmit).toHaveBeenCalled();
    });
  });

  describe('Choose to serve with a group', function() {
    it('should call the onSubmit callback', function() {
      scope.$digest();
      var isolatedScope = element.isolateScope().goGroupConnector;
      isolatedScope.submit(true);

      expect(GoVolunteerService.privateGroup).toBe(false);
      expect(scope.ctrl.onSubmit).toHaveBeenCalled();
    });
  });
});
