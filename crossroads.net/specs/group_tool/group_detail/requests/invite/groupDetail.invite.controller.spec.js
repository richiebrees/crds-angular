import constants from 'crds-constants';
import GroupDetailInviteController from '../../../../../app/group_tool/group_detail/requests/invite/groupDetail.invite.controller'
import GroupInquiry from '../../../../../app/group_tool/model/groupInquiry';
import GroupInvitation from '../../../../../app/group_tool/model/groupInvitation';

describe('GroupDetailInviteController', () => {
  let fixture,
      groupService,
      rootScope,
      qApi;

  var mockProfile;

  beforeEach(angular.mock.module(constants.MODULES.GROUP_TOOL));

  beforeEach(angular.mock.module(($provide)=> {
    mockProfile = jasmine.createSpyObj('Profile', ['Personal']);
    $provide.value('Profile', mockProfile);
  }));

  beforeEach(inject(function($injector) {
    groupService = $injector.get('GroupService'); 
    rootScope = $injector.get('$rootScope');
    qApi = $injector.get('$q');

    rootScope.MESSAGES = {
      generalError: 'general error',
      emailSent: 'email sent',
      emailSendingError: 'email sending error'
    };

    fixture = new GroupDetailInviteController(groupService, rootScope);
    fixture.groupId = 123
  }));

  describe('the constructor', () => {
    it('should initialize properties', () => {
      expect(fixture.groupId).toEqual(123);
      expect(fixture.invite).toBe(null);
      expect(fixture.processing).toBeFalsy();
    });
  });

  describe('beginInvitation() function', () => {
    it('should setup invitation appropriately', () => {
      fixture.beginInvitation();
      expect(fixture.processing).toBeFalsy();
      expect(fixture.invite).toBeDefined();
      expect(fixture.invite.invitationType).toEqual(constants.INVITATION.TYPES.GROUP);
      expect(fixture.invite.sourceId).toEqual(123);
      expect(fixture.invite.groupRoleId).toEqual(constants.GROUP.ROLES.MEMBER);
    });
  });

  describe('sendInvitation() function', () => {
    let form = {
      $valid: true
    };

    let invitation = {
      'sourceId': 11,
      'groupRoleId': 22,
      'emailAddress': 'email',
      'recipientName': 'recipient',
      'requestDate': '2016-07-14T04:03:11.223Z',
      'invitationType': 33,
    };

    it('should emit a message if the form is invalid', () => {
      spyOn(groupService, 'sendGroupInvitation').and.callFake(() => { });
      spyOn(rootScope, '$emit').and.callFake(() => { });
      form.$valid = false;

      fixture.sendInvitation(form, invitation);
      expect(groupService.sendGroupInvitation).not.toHaveBeenCalled();
      expect(fixture.processing).toBeFalsy();
      expect(rootScope.$emit).toHaveBeenCalledWith('notify', rootScope.MESSAGES.generalError);
    });

    it('should emit a message if there is an error sending the invite', () => {
      var deferred = qApi.defer();
      deferred.reject({ status: 500, statusText: 'doh!'});

      spyOn(groupService, 'sendGroupInvitation').and.callFake(() => { return deferred.promise;});
      spyOn(rootScope, '$emit').and.callFake(() => { });
      form.$valid = true;

      fixture.sendInvitation(form, invitation);
      rootScope.$digest();
      expect(groupService.sendGroupInvitation).toHaveBeenCalledWith(invitation);
      expect(fixture.processing).toBeFalsy();
      expect(rootScope.$emit).toHaveBeenCalledWith('notify', rootScope.MESSAGES.emailSendingError);
    });
  });
});
