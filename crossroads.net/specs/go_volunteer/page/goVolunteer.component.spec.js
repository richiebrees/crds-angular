require('../../../app/common/common.module');
require('../../../app/go_volunteer/goVolunteer.module');

describe('Go Volunteer Page Component', function() {
  var CONSTANTS = require('crds-constants');
  var MODULE = CONSTANTS.MODULES.GO_VOLUNTEER; 

  var helpers = require('../goVolunteer.helpers');

  var $compile;
  var $rootScope;
  var element;
  var scope;
  var $httpBackend;
  var GoVolunteerService;
  var Validation;
  var isolated;
  var mockState;
  var injector;
  var isolatedScope;
  var $state;
  var $stateParams;

  beforeEach(function() {
    angular.mock.module(MODULE);
  });

  beforeEach(angular.mock.module(function($provide) {
    mockState = jasmine.createSpyObj('$state',['get']);
    $provide.value(mockState);
  }));

  beforeEach(inject(function(_$compile_, _$rootScope_, $injector) {
    injector = $injector;
    $compile = _$compile_;
    $rootScope = _$rootScope_;
    $stateParams = $injector.get('$stateParams');          
    $httpBackend = $injector.get('$httpBackend');
    
    $state = $injector.get('$state');
    spyOn($state, 'go').and.returnValue(true);
    
    $rootScope.MESSAGES = {
      generalError: 'generalError'
    };
    spyOn($rootScope, '$emit').and.callThrough();

    GoVolunteerService = $injector.get('GoVolunteerService');
    GoVolunteerService.person = helpers.person;

    Validation = $injector.get('Validation');
    scope = $rootScope.$new();
    
    element = '<go-volunteer-page></go-volunteer-page>';
    element = $compile(element)(scope);
    scope.$digest();
    isolatedScope = element.isolateScope().goVolunteerPage;
  }));

  it('should show the profile', function() {
    $stateParams.page = 'profile';
    expect(isolatedScope.showProfile()).toBe(true);
  });

  it('should not show the profile', function() {
    $stateParams.page = 'anythingButProfile';
    expect(isolatedScope.showProfile()).toBe(false);
  });
  
  describe('Crossroads Org', function() {

    it('should go to the next crossroads page', function() {
      isolatedScope.handlePageChange('spouse');
      expect($state.go).toHaveBeenCalledWith('go-volunteer.crossroadspage', 
                                             { page: 'spouse'});

    });
  });

  describe('Non-Crossroads Org', function() {

    beforeEach(function() {
      $stateParams.organization = 'whateva';
      $stateParams.city = 'cincinnati';
    });

    it('should change to the next page for non-crossroads orgs', function() {
      isolatedScope.handlePageChange('spouse');
      expect($state.go).toHaveBeenCalledWith('go-volunteer.page', 
                                             { city: 'cincinnati', organization: 'whateva', page: 'spouse'});
    });
  });
});
