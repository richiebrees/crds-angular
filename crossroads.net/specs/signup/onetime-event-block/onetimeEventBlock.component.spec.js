require('../../../app/common/common.module');
require('../../../app/signup/onetime_event');

describe('Onetime Signup Event Block', function() {

  var CONSTANTS = require('crds-constants');
  var MODULE = CONSTANTS.MODULES.ONETIME_SIGNUP;
  var helpers = require('../signup.helpers');

  var $compile;
  var $rootScope;
  var element;
  var scope;
  var $httpBackend;
  var isolated;
  var EventService;

  beforeEach(function() {
    angular.mock.module(MODULE);
  });

  beforeEach(angular.mock.module(function($provide) {
    $provide.value('$state', { get: function() {} });
  }));

  beforeEach(inject(function(_$rootScope_) {
    $rootScope = _$rootScope_;

    $rootScope.MESSAGES = {
      rsvpOneTimeEventSuccess: 'rsvpOneTimeEventSuccess',
      rsvpFailed: 'rsvpFailed',
      chooseOne: 'chooseOne',
      oneTimeEventChildcarePopup: {content: 'hi'}
    };

    spyOn($rootScope, '$emit').and.callThrough();

  }));

  beforeEach(inject(function(_$compile_, _$rootScope_, $injector) {
    $compile = _$compile_;

    EventService = $injector.get('EventService');
    $httpBackend = $injector.get('$httpBackend');

    scope = $rootScope.$new();
    scope.event = helpers.group.events[0];
    scope.group = helpers.group;
    scope.family = helpers.family;

    element = '<onetime-event-block event=\'event\' family=\'family\' group=\'group\'></onetime-event-block>';
    element = $compile(element)(scope);

    scope.$digest();
    isolated = element.isolateScope();

  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('should get just the time for an endtime', function() {
    expect(isolated.onetimeEventBlock.endTime()).toEqual('9:00pm');
  });

  it('should get just the time for a start time', function() {
    expect(isolated.onetimeEventBlock.startTime()).toEqual('7:00pm');
  });

  it('should show childcare button if I am over 17', function() {
    expect(isolated.onetimeEventBlock.showChildcare(helpers.family[0])).toBe(true);
  });

  it('should not show childcare button if member is under 18', function() {
    expect(isolated.onetimeEventBlock.showChildcare(helpers.family[1])).toBe(false);
  });

  it('should not show childcare for anyone if the group does not have it enabled', function() {
    scope.group.childCareInd = false;
    expect(isolated.onetimeEventBlock.showChildcare(helpers.family[0])).toBe(false);
    expect(isolated.onetimeEventBlock.showChildcare(helpers.family[1])).toBe(false);
  });

  it('should not attempt to save if no one was selected', function() {
    isolated.onetimeEventBlock.submit();
    expect($rootScope.$emit).toHaveBeenCalledWith('notify', 'chooseOne');
  });

  it('should show an error when server responds with an error', function() {

    isolated.onetimeEventBlock.thisFamily[0].selected = true;
    var toPost = {
        eventId: isolated.onetimeEventBlock.event.eventId,
        groupId: isolated.onetimeEventBlock.group.groupId,
        participants: [
          {participantId: isolated.onetimeEventBlock.thisFamily[0].participantId,
            childcareRequested: false, capacityNeeded: 0, sendConfirmationEmail: true}]
      };

    $httpBackend.expectPOST(window.__env__['CRDS_API_ENDPOINT'] + 'api/event', toPost).respond(500);
    isolated.onetimeEventBlock.submit();
    $httpBackend.flush();
    expect($rootScope.$emit).toHaveBeenCalledWith('notify', 'rsvpFailed');
  });

  it('should save the event data', function() {
    isolated.onetimeEventBlock.thisFamily[0].selected = true;

    var toPost = {
        eventId: isolated.onetimeEventBlock.event.eventId,
        groupId: isolated.onetimeEventBlock.group.groupId,
        participants: [
          {participantId: isolated.onetimeEventBlock.thisFamily[0].participantId,
            childcareRequested: false, capacityNeeded: 0, sendConfirmationEmail: true}]
      };

    $httpBackend.expectPOST(window.__env__['CRDS_API_ENDPOINT'] + 'api/event', toPost)
      .respond(200);

    isolated.onetimeEventBlock.submit();
    $httpBackend.flush();
    expect($rootScope.$emit).toHaveBeenCalledWith('notify', 'rsvpOneTimeEventSuccess');
  });

});
