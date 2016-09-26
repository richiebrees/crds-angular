import constants from 'crds-constants';
import ParticipantService from '../../../app/group_tool/services/participant.service'


describe('Group Tool Participant Service', () => {
  let fixture,
    log,
    resource,
    deferred,
    AuthService,
    authenticated,
    httpBackend;

  const endpoint = window.__env__['CRDS_API_ENDPOINT'] + 'api';

  beforeEach(angular.mock.module(constants.MODULES.GROUP_TOOL));

  beforeEach(inject(function($injector) {
    log = $injector.get('$log');
    resource = $injector.get('$resource');
    deferred = $injector.get('$q');
    AuthService = $injector.get('AuthService');
    httpBackend = $injector.get('$httpBackend');

    authenticated = false;
    spyOn(AuthService, 'isAuthenticated').and.callFake(function() {
        return authenticated;
    });

    fixture = new ParticipantService(log, resource, deferred, AuthService);
  }));

  afterEach(() => {
    httpBackend.verifyNoOutstandingExpectation();
    httpBackend.verifyNoOutstandingRequest();
  });

  describe('get() participant', () => {
    it('should return participant for authenticated user', () => {
        authenticated = true;

        var participant = { 'ApprovedSmallGroupLeader': true };
        httpBackend.expectGET(`${endpoint}/participant`).respond(200, { 'participant': participant });

        var promise = fixture.get();
        httpBackend.flush();
        expect(promise.$$state.status).toEqual(1);
        promise.then(function(data) {
            expect(data.participant).toEqual(participant);
        });
    });

    it('should return unapproved participant for unauthenticated user', () => {
        authenticated = false;

        var promise = fixture.get();
        expect(promise.$$state.status).toEqual(1);
        promise.then(function(data) {
            expect(_.get(data, 'participant.ApprovedSmallGroupLeader')).toBeFalsy();
        });
    });
  });
  
  describe('acceptDenyInvitation(groupId, invitationGUID, accept) function', () => {
    it('get the group', () => {
      httpBackend.expectPOST(`${endpoint}/grouptool/group/123/invitation/1232131231312`).
                  respond(200, {});

      var promise = fixture.acceptDenyInvitation(123, 1232131231312, true);
      httpBackend.flush();
      expect(promise.$$state.status).toEqual(1);
    });
  });
});