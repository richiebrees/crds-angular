
import Participant from '../../../app/group_tool/model/participant';
import constants from 'crds-constants';

describe('Participant', () => {

  let participant,
    mockJson;

  beforeEach(() => {
    mockJson = {
      'nickName': 'first',
      'lastName': 'last',
      'groupRoleId': constants.GROUP.ROLES.LEADER
    };
  });

  describe('creation', () => {
    it('should have the following values when created with json', () => {
      participant = new Participant(mockJson);

      expect(participant.nickName).toEqual(mockJson.nickName);
      expect(participant.lastName).toEqual(mockJson.lastName);
      expect(participant.groupRoleId).toEqual(mockJson.groupRoleId);
      expect(participant.displayName()).toEqual(`${mockJson.nickName} ${mockJson.lastName}`);
    });

    it('should have the following values when created without json', () => {
      participant = new Participant();

      expect(participant.nickName).toEqual('');
      expect(participant.lastName).toEqual('');
      expect(participant.groupRoleId).toEqual(-1);
    });
  });

  describe('isLeader', () => {
    it('should be true', () => {
      participant = new Participant();
      participant.groupRoleId = constants.GROUP.ROLES.LEADER;
      expect(participant.isLeader()).toBeTruthy();
    });

    it('should be false', () => {
      participant = new Participant();
      participant.groupRoleId = constants.GROUP.ROLES.APPRENTICE;
      expect(participant.isLeader()).toBeFalsy();
    });
  });

  describe('isApprentice', () => {
    it('should be true', () => {
      participant = new Participant();
      participant.groupRoleId = constants.GROUP.ROLES.APPRENTICE;
      expect(participant.isApprentice()).toBeTruthy();
    });

    it('should be false', () => {
      participant = new Participant();
      participant.groupRoleId = constants.GROUP.ROLES.LEADER;
      expect(participant.isApprentice()).toBeFalsy();
    });
  });

  describe('displayName', () => {
    it('should be set properly', () => {
      participant = new Participant();
      participant.nickName = 'first';
      participant.lastName = 'last';
      participant.groupRoleId = constants.GROUP.ROLES.APPRENTICE;
      expect(participant.displayName()).toEqual('first last');
    });

    it('should be blank', () => {
      participant = new Participant();
      participant.groupRoleId = constants.GROUP.ROLES.LEADER;
      expect(participant.displayName()).toEqual('');
    });
  });

  describe('compareTo() function', () => {
    it('same name, should compare a leader above an apprentice', () => {
      let p1 = new Participant({nickName: 'first', lastName: 'last', groupRoleId: constants.GROUP.ROLES.APPRENTICE});
      let p2 = new Participant({nickName: 'first', lastName: 'last', groupRoleId: constants.GROUP.ROLES.LEADER});
      expect(p2.compareTo(p1)).toBe(-1);
      expect(p1.compareTo(p2)).toBe(1);
    });

    it('same name, should compare a leader above a member', () => {
      let p1 = new Participant({nickName: 'first', lastName: 'last', groupRoleId: constants.GROUP.ROLES.MEMBER});
      let p2 = new Participant({nickName: 'first', lastName: 'last', groupRoleId: constants.GROUP.ROLES.LEADER});
      expect(p2.compareTo(p1)).toBe(-1);
      expect(p1.compareTo(p2)).toBe(1);
    });

    it('same name, should compare an apprentice above a member', () => {
      let p1 = new Participant({nickName: 'first', lastName: 'last', groupRoleId: constants.GROUP.ROLES.MEMBER});
      let p2 = new Participant({nickName: 'first', lastName: 'last', groupRoleId: constants.GROUP.ROLES.APPRENTICE});
      expect(p2.compareTo(p1)).toBe(-1);
      expect(p1.compareTo(p2)).toBe(1);
    });

    it('same name, same role, should compare properly', () => {
      let p1 = new Participant({nickName: 'first', lastName: 'last'});
      let p2 = new Participant({nickName: 'first', lastName: 'last'});
      _.forEach(constants.GROUP.ROLES, (key, role) => {
        p1.groupRoleId = p2.groupRoleId = role;
        expect(p2.compareTo(p1)).toBe(0);
        expect(p1.compareTo(p2)).toBe(0);
      });
    });
    
    it('different last name, same role, should compare properly', () => {
      let p1 = new Participant({nickName: 'first', lastName: 'zlast'});
      let p2 = new Participant({nickName: 'first', lastName: 'alast'});
      _.forEach(constants.GROUP.ROLES, (key, role) => {
        p1.groupRoleId = p2.groupRoleId = role;
        expect(p2.compareTo(p1)).toBe(-1);
        expect(p1.compareTo(p2)).toBe(1);
      });
    });

    it('different first name, same role, should compare properly', () => {
      let p1 = new Participant({nickName: 'zfirst', lastName: 'last'});
      let p2 = new Participant({nickName: 'afirst', lastName: 'last'});
      _.forEach(constants.GROUP.ROLES, (key, role) => {
        p1.groupRoleId = p2.groupRoleId = role;
        expect(p2.compareTo(p1)).toBe(-1);
        expect(p1.compareTo(p2)).toBe(1);
      });
    });

  });
});
