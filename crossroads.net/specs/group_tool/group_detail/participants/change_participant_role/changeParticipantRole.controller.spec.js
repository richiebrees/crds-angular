
import constants from 'crds-constants';
import ChangeParticipantRoleController from '../../../../../app/group_tool/group_detail/participants/change_participant_role/changeParticipantRole.controller';
import Participant from '../../../../../app/group_tool/model/participant';

describe('ChangeParticipantRoleController', () => {
    let fixture,
        groupService,
        anchorScroll,
        groupDetailService,
        rootScope;

    beforeEach(angular.mock.module(constants.MODULES.GROUP_TOOL));

    var mockProfile;

    beforeEach(angular.mock.module(($provide) => {
        mockProfile = jasmine.createSpyObj('Profile', ['Personal']);
        $provide.value('Profile', mockProfile);
    }));

    beforeEach(inject((_$rootScope_, $injector) => {
        rootScope = _$rootScope_;
        groupService = $injector.get('GroupService');
        anchorScroll = $injector.get('$anchorScroll');
        groupDetailService = $injector.get('GroupDetailService');
        fixture = new ChangeParticipantRoleController(groupService, anchorScroll, rootScope, groupDetailService);
    }));

    describe('the constructor', () => {
        it('should initialize properties', () => {
            expect(fixture.processing).toBeFalsy();
        });
    });

    describe('warningLeaderMax', () => {
        it('should return false when less than 5', () => {
            let participants = [
                new Participant({ nickName: 'f1', lastName: 'l1', groupRoleId: constants.GROUP.ROLES.LEADER, participantId: 11 }),
                new Participant({ nickName: 'f2', lastName: 'l2', groupRoleId: constants.GROUP.ROLES.LEADER, participantId: 22 }),
                new Participant({ nickName: 'f3', lastName: 'l3', groupRoleId: constants.GROUP.ROLES.LEADER, participantId: 33 }),
                new Participant({ nickName: 'f4', lastName: 'l4', groupRoleId: constants.GROUP.ROLES.LEADER, participantId: 44 }),
                new Participant({ nickName: 'f5', lastName: 'l5', groupRoleId: constants.GROUP.ROLES.MEMBER, participantId: 55 }),
                new Participant({ nickName: 'f6', lastName: 'l6', groupRoleId: constants.GROUP.ROLES.APPRENTICE, participantId: 66 })
            ];
            fixture.participants = participants;
            expect(fixture.warningLeaderMax(), false);
        });

        it('should return true when greater than 5', () => {
            let participants = [
                new Participant({ nickName: 'f1', lastName: 'l1', groupRoleId: constants.GROUP.ROLES.LEADER, participantId: 11 }),
                new Participant({ nickName: 'f2', lastName: 'l2', groupRoleId: constants.GROUP.ROLES.LEADER, participantId: 22 }),
                new Participant({ nickName: 'f3', lastName: 'l3', groupRoleId: constants.GROUP.ROLES.LEADER, participantId: 33 }),
                new Participant({ nickName: 'f4', lastName: 'l4', groupRoleId: constants.GROUP.ROLES.LEADER, participantId: 44 }),
                new Participant({ nickName: 'f5', lastName: 'l5', groupRoleId: constants.GROUP.ROLES.MEMBER, participantId: 55 }),
                new Participant({ nickName: 'f6', lastName: 'l6', groupRoleId: constants.GROUP.ROLES.APPRENTICE, participantId: 66 }),
                new Participant({ nickName: 'f7', lastName: 'l1', groupRoleId: constants.GROUP.ROLES.LEADER, participantId: 11 }),
                new Participant({ nickName: 'f8', lastName: 'l2', groupRoleId: constants.GROUP.ROLES.LEADER, participantId: 22 }),
            ];
            fixture.participants = participants;
            expect(fixture.warningLeaderMax(), true);
        });
    });

    describe('warningApprenticeMax', () => {
        it('should return false when less than 5', () => {
            let participants = [
                new Participant({ nickName: 'f1', lastName: 'l1', groupRoleId: constants.GROUP.ROLES.LEADER, participantId: 11 }),
                new Participant({ nickName: 'f2', lastName: 'l2', groupRoleId: constants.GROUP.ROLES.LEADER, participantId: 22 }),
                new Participant({ nickName: 'f3', lastName: 'l3', groupRoleId: constants.GROUP.ROLES.LEADER, participantId: 33 }),
                new Participant({ nickName: 'f4', lastName: 'l4', groupRoleId: constants.GROUP.ROLES.LEADER, participantId: 44 }),
                new Participant({ nickName: 'f5', lastName: 'l5', groupRoleId: constants.GROUP.ROLES.MEMBER, participantId: 55 }),
                new Participant({ nickName: 'f6', lastName: 'l6', groupRoleId: constants.GROUP.ROLES.APPRENTICE, participantId: 66 })
            ];
            fixture.participants = participants;
            expect(fixture.warningApprenticeMax(), false);
        });

        it('should return true when greater than 5', () => {
            let participants = [
                new Participant({ nickName: 'f1', lastName: 'l1', groupRoleId: constants.GROUP.ROLES.APPRENTICE, participantId: 11 }),
                new Participant({ nickName: 'f2', lastName: 'l2', groupRoleId: constants.GROUP.ROLES.APPRENTICE, participantId: 22 }),
                new Participant({ nickName: 'f3', lastName: 'l3', groupRoleId: constants.GROUP.ROLES.APPRENTICE, participantId: 33 }),
                new Participant({ nickName: 'f4', lastName: 'l4', groupRoleId: constants.GROUP.ROLES.APPRENTICE, participantId: 44 }),
                new Participant({ nickName: 'f5', lastName: 'l5', groupRoleId: constants.GROUP.ROLES.APPRENTICE, participantId: 55 }),
                new Participant({ nickName: 'f6', lastName: 'l6', groupRoleId: constants.GROUP.ROLES.APPRENTICE, participantId: 66 }),
                new Participant({ nickName: 'f7', lastName: 'l1', groupRoleId: constants.GROUP.ROLES.LEADER, participantId: 11 }),
                new Participant({ nickName: 'f8', lastName: 'l2', groupRoleId: constants.GROUP.ROLES.LEADER, participantId: 22 }),
            ];
            fixture.participants = participants;
            expect(fixture.warningApprenticeMax(), true);
        });
    });

    describe('isApprovedLeader() function', () => {
      it('should return true if participant is an approved leader', () => {
        fixture.participant = {
          isApprovedLeader: true
        };
        expect(fixture.isApprovedLeader()).toBeTruthy();
      });

      it('should return false if participant is not an approved leader', () => {
        fixture.participant = {
          isApprovedLeader: false
        };
        expect(fixture.isApprovedLeader()).toBeFalsy();
      });
    });

    describe('isLeaderDisabled() function', () => {
      beforeEach(() => {
        fixture.isLeader = jasmine.createSpy('isLeader');
        fixture.isApprovedLeader = jasmine.createSpy('isApprovedLeader');
        fixture.warningLeaderMax = jasmine.createSpy('warningLeaderMax');
      });

      it('should be false if participant is already a leader', () => {
        fixture.isLeader.and.returnValue(true);
        expect(fixture.isLeaderDisabled()).toBeFalsy();
      });

      it('should be false if participant is an approved leader and group not at max leaders', () => {
        fixture.isLeader.and.returnValue(false);
        fixture.isApprovedLeader.and.returnValue(true);
        fixture.warningLeaderMax.and.returnValue(false);
        expect(fixture.isLeaderDisabled()).toBeFalsy();
      });

      it('should be true if participant is not an approved leader', () => {
        fixture.isLeader.and.returnValue(false);
        fixture.isApprovedLeader.and.returnValue(false);
        fixture.warningLeaderMax.and.returnValue(false);
        expect(fixture.isLeaderDisabled()).toBeTruthy();
      });

      it('should be true if group has max leaders', () => {
        fixture.isLeader.and.returnValue(false);
        fixture.isApprovedLeader.and.returnValue(true);
        fixture.warningLeaderMax.and.returnValue(true);
        expect(fixture.isLeaderDisabled()).toBeTruthy();
      });
    });

    describe('isApprenticeDisabled() function', () => {
      beforeEach(() => {
        fixture.isApprentice = jasmine.createSpy('isApprentice');
        fixture.warningApprenticeMax = jasmine.createSpy('warningApprenticeMax');
      });

      it('should be false if participant is already an apprentice', () => {
        fixture.isApprentice.and.returnValue(true);
        expect(fixture.isApprenticeDisabled()).toBeFalsy();
      });

      it('should be false if participant group not at max apprentices', () => {
        fixture.isApprentice.and.returnValue(false);
        fixture.warningApprenticeMax.and.returnValue(false);
        expect(fixture.isApprenticeDisabled()).toBeFalsy();
      });

      it('should be true if group has max apprentices', () => {
        fixture.isApprentice.and.returnValue(false);
        fixture.warningApprenticeMax.and.returnValue(true);
        expect(fixture.isApprenticeDisabled()).toBeTruthy();
      });
    });

    describe('submit', function () {
        beforeEach(() => {
            let participant = new Participant({ nickName: 'f1', lastName: 'l1', groupRoleId: constants.GROUP.ROLES.LEADER, participantId: 11 });
            fixture.participant = participant;
        });

        it('should return false if role not changed', function () {
            fixture.currentRole = constants.GROUP.ROLES.LEADER;
            expect(fixture.hasRoleChanged()).toBe(false);
        });

        it('should return true if role changed', function () {
            fixture.currentRole = constants.GROUP.ROLES.PARTICIPANT;
            expect(fixture.hasRoleChanged()).toBe(true);
        });

    });
});
