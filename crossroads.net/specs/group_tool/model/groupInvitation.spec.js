
import GroupInvitation from '../../../app/group_tool/model/groupInvitation';
import constants from 'crds-constants';

describe('Group Invitation', () => {

  let invitation,
    mockJson;

  beforeEach(() => {
    mockJson = {
      'sourceId': 11,
      'groupRoleId': 22,
      'emailAddress': 'me@here.com',
      'recipientName': 'testy mctestface',
      'requestDate': '0001-01-01T00:00:00',
      'invitationType': 'ttt'
    };

    invitation = new GroupInvitation(mockJson);
  });

  describe('creation', () => {
    it('should have the following values with JSON source', () => {
      expect(invitation.sourceId).toEqual(mockJson.sourceId);
      expect(invitation.groupRoleId).toEqual(mockJson.groupRoleId);
      expect(invitation.emailAddress).toEqual(mockJson.emailAddress);
      expect(invitation.recipientName).toEqual(mockJson.recipientName);
      expect(invitation.requestDate).toEqual(mockJson.requestDate);
      expect(invitation.invitationType).toEqual(constants.INVITATION.TYPES.GROUP);
    });

    it('should have the following values with no source', () => {
      invitation = new GroupInvitation();
      expect(invitation.sourceId).toBeUndefined();
      expect(invitation.groupRoleId).toBeUndefined();
      expect(invitation.emailAddress).toBeUndefined();
      expect(invitation.recipientName).toBeUndefined();
      expect(invitation.requestDate).toBeUndefined();
      expect(invitation.invitationType).toEqual(constants.INVITATION.TYPES.GROUP);
    });
    
  });
});