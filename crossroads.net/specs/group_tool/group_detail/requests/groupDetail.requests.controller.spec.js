import constants from 'crds-constants';
import GroupDetailRequestsController from '../../../../app/group_tool/group_detail/requests/groupDetail.requests.controller'
import GroupInquiry from '../../../../app/group_tool/model/groupInquiry';
import GroupInvitation from '../../../../app/group_tool/model/groupInvitation';

describe('GroupDetailRequestsController', () => {
  let fixture,
      groupService,
      state,
      rootScope,
      log,
      stateParams,
      qApi;

  var mockProfile;

  beforeEach(angular.mock.module(constants.MODULES.GROUP_TOOL));

  beforeEach(angular.mock.module(($provide)=> {
    mockProfile = jasmine.createSpyObj('Profile', ['Personal']);
    $provide.value('Profile', mockProfile);
  }));

  beforeEach(inject(function($injector) {
    groupService = $injector.get('GroupService'); 
    state = $injector.get('$state');
    rootScope = $injector.get('$rootScope');
    log = $injector.get('$log');
    qApi = $injector.get('$q');
    stateParams = $injector.get('$stateParams');

    rootScope.MESSAGES = {
      generalError: 'general error',
      emailSent: 'email sent',
      emailSendingError: 'email sending error'
    };

    state.params = {
      groupId: 123
    };

    fixture = new GroupDetailRequestsController(groupService, state, stateParams, rootScope, log);
  }));

  describe('the constructor', () => {
    it('should initialize properties', () => {
      expect(fixture.groupId).toEqual(state.params.groupId);
      expect(fixture.ready).toBeFalsy();
      expect(fixture.error).toBeFalsy();
      expect(fixture.currentView).toEqual('List');

      expect(fixture.invited.length).toEqual(0);
      expect(fixture.inquired.length).toEqual(0);
    });
  });

  describe('setView(newView, refresh) function', () => {
    it('should set current view', () => {
      fixture.setView('Invite', false);
      expect(fixture.currentView).toEqual('Invite');
      fixture.setView('List', false);
      expect(fixture.currentView).toEqual('List');
    });
  });

  describe('$onInit() function', () => {
    it('should get invited and inquiries', () => {
      let mockInvities = [
        {
          "sourceId": 123,
          "groupRoleId": 16,
          "emailAddress": "for@me.com",
          "recipientName": "Knowledge Man",
          "requestDate": "2016-07-14T11:00:00",
          "invitationType": 1,
          "invitationId": 0,
          "invitationGuid": null
        },
        {
          "sourceId": 123,
          "groupRoleId": 16,
          "emailAddress": "really@fast.com",
          "recipientName": "Buffer Dude",
          "requestDate": "2016-07-14T11:00:00",
          "invitationType": 1,
          "invitationId": 0,
          "invitationGuid": null
        }
      ];

      let mockInquires = [
        {
          "groupId": 123,
          "emailAddress": "jim.kriz@ingagepartners.com",
          "phoneNumber": "513-432-1973",
          "firstName": "Dustin",
          "lastName": "Kocher",
          "requestDate": "2016-07-14T10:00:00",
          "placed": null,
          "inquiryId": 19
        },
        {
          "groupId": 123,
          "emailAddress": "jkerstanoff@callibrity.com",
          "phoneNumber": "513-987-1983",
          "firstName": "Joe",
          "lastName": "Kerstanoff",
          "requestDate": "2016-07-14T10:00:00",
          "placed": false,
          "inquiryId": 20
        },
        {
          "groupId": 123,
          "emailAddress": "kim.farrow@thrivecincinnati.com",
          "phoneNumber": "513-874-6947",
          "firstName": "Kim",
          "lastName": "Farrow",
          "requestDate": "2016-07-14T10:00:00",
          "placed": true,
          "inquiryId": 21
        }
      ];

      //Invities setup
      let invities = mockInvities.map((invitation) => {
        return new GroupInvitation(invitation);
      });

      let deferredInvities = qApi.defer();
      deferredInvities.resolve(mockInvities);
      deferredInvities.promise.then(() => {
        return invities;
      });

      //Inquiries setup
      let inquires = mockInquires.map((inquiry) => {
        return new GroupInquiry(inquiry);
      });

      let deferredInquiries = qApi.defer();
      deferredInquiries.resolve(mockInquires);
      deferredInquiries.promise.then(() => {
        return inquires;
      });

      spyOn(groupService, 'getInvities').and.callFake(function(groupId) {
        return(deferredInvities.promise);
      });

      spyOn(groupService, 'getInquiries').and.callFake(function(groupId) {
        return(deferredInquiries.promise);
      });

      fixture.$onInit();
      rootScope.$digest();
      expect(groupService.getInvities).toHaveBeenCalledWith(state.params.groupId);
      expect(groupService.getInquiries).toHaveBeenCalledWith(state.params.groupId);
      expect(fixture.invited).toBeDefined();
      expect(fixture.inquired).toBeDefined()
      expect(fixture.groupId).toBeDefined();
      expect(fixture.groupId).toEqual(state.params.groupId);
      expect(fixture.invited.length).toEqual(invities.length);
      expect(fixture.invited[0].emailAddress).toEqual(invities[0].emailAddress);
      expect(fixture.inquired.length).toEqual(1);
      expect(fixture.inquired[0].emailAddress).toEqual('jim.kriz@ingagepartners.com');
      expect(fixture.ready).toBeTruthy();
      expect(fixture.error).toBeFalsy();
    });

    it('should set error state if trouble getting inquiries', () => {
      let deferred = qApi.defer();
      let error = {
        status: 500,
        statusText: 'oops'
      };
      deferred.reject(error);

      spyOn(groupService, 'getInquiries').and.callFake(function(groupId) {
        return(deferred.promise);
      });

      fixture.$onInit();
      rootScope.$digest();

      expect(groupService.getInquiries).toHaveBeenCalledWith(state.params.groupId);
      expect(fixture.ready).toBeTruthy();
      expect(fixture.error).toBeTruthy();
    });
  });

  describe('methods', () => {
    let mockInquires,
      inquires;
    
    beforeEach(()=> {
      mockInquires = [
        {
          "groupId": 123,
          "emailAddress": "jim.kriz@ingagepartners.com",
          "phoneNumber": "513-432-1973",
          "firstName": "Dustin",
          "lastName": "Kocher",
          "requestDate": "2016-07-14T10:00:00",
          "placed": null,
          "inquiryId": 19
        },
        {
          "groupId": 123,
          "emailAddress": "jkerstanoff@callibrity.com",
          "phoneNumber": "513-987-1983",
          "firstName": "Joe",
          "lastName": "Kerstanoff",
          "requestDate": "2016-07-14T10:00:00",
          "placed": false,
          "inquiryId": 20
        },
        {
          "groupId": 123,
          "emailAddress": "kim.farrow@thrivecincinnati.com",
          "phoneNumber": "513-874-6947",
          "firstName": "Kim",
          "lastName": "Farrow",
          "requestDate": "2016-07-14T10:00:00",
          "placed": true,
          "inquiryId": 21
        }
      ];

      //Inquiries setup
      inquires = mockInquires.map((inquiry) => {
        return new GroupInquiry(inquiry);
      });
    });


    describe('approve(inquiry)', () => {
      it('should do the following', () => {
        fixture.approve(inquires[0]);

        expect(fixture.selectedInquiry).toEqual(inquires[0]);
	      expect(fixture.selectedInquiry.message).toEqual('');
        expect(fixture.currentView).toEqual('Approve');
      });
    });

    describe('deny(inquiry)', () => {
      it('should do the following', () => {
        fixture.deny(inquires[0]);

        expect(fixture.selectedInquiry).toEqual(inquires[0]);
	      expect(fixture.selectedInquiry.message).toEqual('');
        expect(fixture.currentView).toEqual('Deny');
      });
    });

    describe('cancel(inquiry)', () => {
      it('should do the following', () => {
        fixture.cancel(inquires[0]);

        expect(fixture.selectedInquiry).not.toBeDefined();
	      expect(inquires[0].message).not.toBeDefined();
        expect(fixture.currentView).toEqual('List');
      });
    });

    describe('submitApprove(person)', () => {
      it('should succeed', () => {
        let deferred = qApi.defer();
        deferred.resolve({});

        spyOn(groupService, 'approveDenyInquiry').and.callFake(function() {
          return(deferred.promise);
        });

        spyOn(fixture, 'setView').and.callFake(function() {});

        spyOn(rootScope, '$emit').and.callFake(() => { });

        fixture.submitApprove(inquires[0]);
        rootScope.$digest();

        expect(groupService.approveDenyInquiry).toHaveBeenCalledWith(fixture.groupId, true, inquires[0]);
        expect(rootScope.$emit).toHaveBeenCalledWith('notify', rootScope.MESSAGES.groupToolApproveInquirySuccessGrowler);
      });

      it('should fail', () => {
        let deferred = qApi.defer();
        deferred.reject({status: 500, statusText: 'Oh no!'});

        spyOn(groupService, 'approveDenyInquiry').and.callFake(function() {
          return(deferred.promise);
        });

        spyOn(fixture, 'setView').and.callFake(function() {});

        spyOn(rootScope, '$emit').and.callFake(() => { });

        fixture.submitApprove(inquires[0]);
        rootScope.$digest();

        expect(groupService.approveDenyInquiry).toHaveBeenCalledWith(fixture.groupId, true, inquires[0]);
        expect(rootScope.$emit).toHaveBeenCalledWith('notify', rootScope.MESSAGES.groupToolApproveInquiryFailureGrowler);
      });
    });

    describe('submitDeny(person)', () => {
      it('should succeed', () => {
        let deferred = qApi.defer();
        deferred.resolve({});

        spyOn(groupService, 'approveDenyInquiry').and.callFake(function() {
          return(deferred.promise);
        });

        spyOn(fixture, 'setView').and.callFake(function() {});

        spyOn(rootScope, '$emit').and.callFake(() => { });

        fixture.submitDeny(inquires[0]);
        rootScope.$digest();

        expect(groupService.approveDenyInquiry).toHaveBeenCalledWith(fixture.groupId, false, inquires[0]);
        expect(rootScope.$emit).toHaveBeenCalledWith('notify', rootScope.MESSAGES.groupToolDenyInquirySuccessGrowler);
      });

      it('should fail', () => {
        let deferred = qApi.defer();
        deferred.reject({status: 500, statusText: 'Oh no!'});

        spyOn(groupService, 'approveDenyInquiry').and.callFake(function() {
          return(deferred.promise);
        });

        spyOn(fixture, 'setView').and.callFake(function() {});

        spyOn(rootScope, '$emit').and.callFake(() => { });

        fixture.submitDeny(inquires[0]);
        rootScope.$digest();

        expect(groupService.approveDenyInquiry).toHaveBeenCalledWith(fixture.groupId, false, inquires[0]);
        expect(rootScope.$emit).toHaveBeenCalledWith('notify', rootScope.MESSAGES.groupToolDenyInquiryFailureGrowler);
      });
    });

    describe('Request and invite method', () => {
      it('hasRequests() should be false with no requests', () => {
        fixture.inquired = [];
        expect(fixture.hasRequests()).toBeFalsy();
      });

      it('hasRequests() should be true with some requests', () => {
        fixture.inquired = [ {} ];
        expect(fixture.hasRequests()).toBeTruthy();
      });

      it('hasInvites() should be false with no invites', () => {
        fixture.invited = [];
        expect(fixture.hasInvites()).toBeFalsy();
      });

      it('hasInvites() should be true with some invites', () => {
        fixture.invited = [ {} ];
        expect(fixture.hasInvites()).toBeTruthy();
      });

      it('hasRequestsOrInvites() should be false with no requests or invites', () => {
        fixture.invited = [];
        fixture.inquired = [];
        expect(fixture.hasRequestsOrInvites()).toBeFalsy();
      });

      it('hasRequestsOrInvites() should be true with no requests but some invites', () => {
        fixture.invited = [ {} ];
        fixture.inquired = [];
        expect(fixture.hasRequestsOrInvites()).toBeTruthy();
      });

      it('hasRequestsOrInvites() should be true with no invites but some requests', () => {
        fixture.invited = [ ];
        fixture.inquired = [ {} ];
        expect(fixture.hasRequestsOrInvites()).toBeTruthy();
      });

      it('hasRequestsOrInvites() should be true with requests and invites', () => {
        fixture.invited = [ {} ];
        fixture.inquired = [ {} ];
        expect(fixture.hasRequestsOrInvites()).toBeTruthy();
      });
    });
  });
});
