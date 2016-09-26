
import constants from 'crds-constants';
import GroupInvitationController from '../../../app/group_tool/group_invitation/groupInvitation.controller';

describe('GroupInvitationController', () => {
    let fixture,
        groupService,
        participantService,
        state,
        rootScope,
        log,
        location,
        qApi,
        mockProfile,
        cookies;


    beforeEach(angular.mock.module(constants.MODULES.GROUP_TOOL));

    beforeEach(angular.mock.module(($provide)=> {
      mockProfile = jasmine.createSpyObj('Profile', ['Personal']);
      $provide.value('Profile', mockProfile);
    }));

    beforeEach(inject(function($injector) {
        groupService = $injector.get('GroupService');
        participantService = $injector.get('ParticipantService');
        state = $injector.get('$state');
        rootScope = $injector.get('$rootScope');
        log = $injector.get('$log');
        location = $injector.get('$location');
        qApi = $injector.get('$q');

        state.params = {
          invitationGUID: 123
        };

        fixture = new GroupInvitationController(groupService, participantService, state, rootScope, log, location);
    }));

    describe('the constructor', () => {
        it('should initialize properties', () => {
            expect(fixture.ready).toBeFalsy;
            expect(fixture.error).toBeFalsy();
            expect(fixture.processing).toBeFalsy();
            expect(fixture.group).toEqual(null);
        });
    });

    describe('$onInit() function', () => {
      it('should get group and set invitation up', () => {
        let groupData = {
          contactId: 987
        };

        let deferred = qApi.defer();
        deferred.resolve(groupData);

        spyOn(groupService, 'getGroupByInvitationGUID').and.callFake(function(invitationGUID) {
          return(deferred.promise);
        });

        fixture.$onInit();
        rootScope.$digest();

        expect(fixture.invitationGUID).toEqual(state.params.invitationGUID);
        expect(groupService.getGroupByInvitationGUID).toHaveBeenCalledWith(state.params.invitationGUID);
        expect(fixture.group).toBeDefined();
        expect(fixture.ready).toBeTruthy();
        expect(fixture.error).toBeFalsy();
        expect(fixture.invitationExists()).toBeTruthy();
      });
    });
    
    describe('accept() function', () => {
      it('should accept an invitation', () => {
        let deferred = qApi.defer();
        deferred.resolve({});

        fixture.group = { groupId: 123 };
        fixture.invitationGUID = 111;

        spyOn(participantService, 'acceptDenyInvitation').and.callFake(function(groupId, invitationGUID, accept) {
          return(deferred.promise);
        });

        fixture.accept();

        expect(participantService.acceptDenyInvitation).toHaveBeenCalledWith(123, 111, true);
      });
    });
    
    describe('deny() function', () => {
      it('should deny an invitation', () => {
        let deferred = qApi.defer();
        deferred.resolve({});

        fixture.group = { groupId: 123 };
        fixture.invitationGUID = 111;

        spyOn(participantService, 'acceptDenyInvitation').and.callFake(function(groupId, invitationGUID, accept) {
          return(deferred.promise);
        });

        fixture.deny();

        expect(participantService.acceptDenyInvitation).toHaveBeenCalledWith(123, 111, false);
      });
    });
});