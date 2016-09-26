
import CONSTANTS from 'crds-constants';
import GroupService from '../../../app/group_tool/services/group.service'
import SmallGroup from '../../../app/group_tool/model/smallGroup';
import GroupInquiry from '../../../app/group_tool/model/groupInquiry';
import GroupInvitation from '../../../app/group_tool/model/groupInvitation';
import Participant from '../../../app/group_tool/model/participant';

describe('Group Tool Group Service', () => {
  let fixture,
    log,
    resource,
    deferred,
    AuthService,
    authenticated,
    httpBackend,
    ImageService;

  const endpoint = `${window.__env__['CRDS_API_ENDPOINT']}api`;

  beforeEach(angular.mock.module(CONSTANTS.MODULES.GROUP_TOOL));

  beforeEach(inject(function($injector) {
    log = $injector.get('$log');
    resource = $injector.get('$resource');
    deferred = $injector.get('$q');
    AuthService = $injector.get('AuthService');
    httpBackend = $injector.get('$httpBackend');
    ImageService = $injector.get('ImageService');

    fixture = new GroupService(log, resource, deferred, AuthService, ImageService);
  }));

  afterEach(() => {
    httpBackend.verifyNoOutstandingExpectation();
    httpBackend.verifyNoOutstandingRequest();
  });

  describe('getMyGroups() groups', () => {
    it('should return groups for authenticated user', () => {
        let groups = [{
          'groupName': 'Learning and Growing In Life',
          'groupDescription': 'Learn about Jesus and Life Managment',
          'groupId': 172272,
          'groupTypeId': 1,
          'ministryId': 0,
          'congregationId': 0,
          'contactId': 0,
          'contactName': null,
          'primaryContactEmail': null,
          'startDate': '0001-01-01T00:00:00',
          'endDate': null,
          'availableOnline': false,
          'remainingCapacity': 0,
          'groupFullInd': false,
          'waitListInd': false,
          'waitListGroupId': 0,
          'childCareInd': false,
          'minAge': 0,
          'SignUpFamilyMembers': null,
          'events': null,
          'meetingDayId': null,
          'meetingDay': 'Friday',
          'meetingTime': '12:30:00',
          'meetingFrequency': 'Every Week',
          'meetingTimeFrequency': 'Friday\'s at 12:30 PM, Every Week',
          'groupRoleId': 0,
          'address': {
            'addressId': null,
            'addressLine1': 'Fake Street 98th',
            'addressLine2': null,
            'city': 'Madison',
            'state': 'IN',
            'zip': '47250',
            'foreignCountry': null,
            'county': null
          },
          'attributeTypes': {},
          'singleAttributes': {},
          'maximumAge': 0,
          'minimumParticipants': 0,
          'maximumParticipants': 0,
          'Participants': [
            {
              'participantId': 7537153,
              'contactId': 2562378,
              'groupParticipantId': 14581869,
              'nickName': 'Dustin',
              'lastName': 'Kocher',
              'groupRoleId': 22,
              'groupRoleTitle': 'Leader',
              'email': 'dtkocher@callibrity.com',
              'attributeTypes': null,
              'singleAttributes': null
            },
            {
              'participantId': 7547422,
              'contactId': 7654100,
              'groupParticipantId': 14581873,
              'nickName': 'Jim',
              'lastName': 'Kriz',
              'groupRoleId': 21,
              'groupRoleTitle': 'Leader',
              'email': 'jim.kriz@ingagepartners.com',
              'attributeTypes': null,
              'singleAttributes': null
            }
          ]
        },{
          'groupName': 'Bible Study',
          'groupDescription': 'Learn',
          'groupId': 172,
          'groupTypeId': 1,
          'ministryId': 0,
          'congregationId': 0,
          'contactId': 0,
        }];

        let groupsObj = groups.map((group) => {
          return new SmallGroup(group);
        });

        httpBackend.expectGET(`${endpoint}/group/mine/${CONSTANTS.GROUP.GROUP_TYPE_ID.SMALL_GROUPS}`).
                    respond(200, groups);

        var promise = fixture.getMyGroups();
        httpBackend.flush();
        expect(promise.$$state.status).toEqual(1);
        promise.then(function(data) {
        	expect(data[0].groupName).toEqual(groupsObj[0].groupName);
        	expect(data[0].address.length).toEqual(groupsObj[0].address.length);
        	expect(data[0].participants.length).toEqual(groupsObj[0].groupName.participants.length);
        });
    });
  });

  describe('getInvities() inquires', () => {
    it('should return all invities assocated to the group', () => {
      let mockInvities = [
        {
          "sourceId": 172286,
          "groupRoleId": 16,
          "emailAddress": "for@me.com",
          "recipientName": "Knowledge Man",
          "requestDate": "2016-07-14T11:00:00",
          "invitationType": 1,
          "invitationId": 0,
          "invitationGuid": null
        },
        {
          "sourceId": 172286,
          "groupRoleId": 16,
          "emailAddress": "really@fast.com",
          "recipientName": "Buffer Dude",
          "requestDate": "2016-07-14T11:00:00",
          "invitationType": 1,
          "invitationId": 0,
          "invitationGuid": null
        }
      ];

      let groupId = 172286;

      let invities = mockInvities.map((invitation) => {
        return new GroupInvitation(invitation);
      });

      httpBackend.expectGET(`${endpoint}/grouptool/invitations/${groupId}/1`).
                  respond(200, mockInvities);

      var promise = fixture.getInvities(groupId);
      httpBackend.flush();
      //expect(promise.$$state.status).toEqual(1);
      promise.then(function(data) {
        expect(data[1].sourceId).toEqual(invities[1].sourceId);
        expect(data[1].groupRoleId).toEqual(invities[1].groupRoleId);
        expect(data[1].emailAddress).toEqual(invities[1].emailAddress);
        expect(data[1].recipientName).toEqual(invities[1].recipientName);
        expect(data[1].requestDate).toEqual(invities[1].requestDate);
        expect(data[1].invitationType).toEqual(invities[1].invitationType);
        expect(data[1].invitationId).toEqual(invities[1].invitationId);
        expect(data[1].invitationGuid).toEqual(invities[1].invitationGuid);
      });
    });
  });

  describe('getInquires() inquires', () => {
    it('should return all inquiries assocated to the group', () => {
      let mockInquires = [
        {
          "groupId": 172286,
          "emailAddress": "jim.kriz@ingagepartners.com",
          "phoneNumber": "513-432-1973",
          "firstName": "Dustin",
          "lastName": "Kocher",
          "requestDate": "2016-07-14T10:00:00",
          "placed": false,
          "inquiryId": 19,
          "contactId": 123
        },
        {
          "groupId": 172286,
          "emailAddress": "jkerstanoff@callibrity.com",
          "phoneNumber": "513-987-1983",
          "firstName": "Joe",
          "lastName": "Kerstanoff",
          "requestDate": "2016-07-14T10:00:00",
          "placed": false,
          "inquiryId": 20,
          "contactId": 124
        },
        {
          "groupId": 172286,
          "emailAddress": "kim.farrow@thrivecincinnati.com",
          "phoneNumber": "513-874-6947",
          "firstName": "Kim",
          "lastName": "Farrow",
          "requestDate": "2016-07-14T10:00:00",
          "placed": true,
          "inquiryId": 21,
          "contactId": 124
        }
      ];

      let groupId = 172286;

      let inquires = mockInquires.map((inquiry) => {
        return new GroupInquiry(inquiry);
      });

      httpBackend.expectGET(`${endpoint}/grouptool/inquiries/${groupId}`).
                  respond(200, mockInquires);

      var promise = fixture.getInquiries(groupId);
      httpBackend.flush();
      //expect(promise.$$state.status).toEqual(1);
      promise.then(function(data) {
        expect(data[0].groupId).toEqual(inquires[0].groupId);
        expect(data[0].emailAddress).toEqual(inquires[0].emailAddress);
        expect(data[0].phoneNumber).toEqual(groupsObj[0].phoneNumber);
        expect(data[0].firstName).toEqual(inquires[0].firstName);
        expect(data[0].lastName).toEqual(inquires[0].lastName);
        expect(data[0].requestDate).toEqual(inquires[0].requestDate);
        expect(data[0].placed).toEqual(inquires[0].placed);
        expect(data[0].inquiryId).toEqual(inquires[0].inquiryId);
      });
    });
  });

  describe('getGroupParticipants() function', () => {
    it('should throw error in case of failure', () => {
      let groupId = 172286;

      let errObj = { status: 500, statusText: 'nonononononono' };

      httpBackend.expectGET(`${endpoint}/group/mine/${CONSTANTS.GROUP.GROUP_TYPE_ID.SMALL_GROUPS}/${groupId}`).
                  respond(500, errObj);

      var promise = fixture.getGroupParticipants(groupId);
      httpBackend.flush();
      expect(promise.$$state.status).toEqual(2);

      let callbacks = jasmine.createSpyObj('callbacks', ['onSuccess', 'onFailure']);

      promise.then((data) => {
        callbacks.onSuccess(data);
      },
      (err) => {
        callbacks.onFailure(err.data);
      }).finally(() => {
        expect(callbacks.onSuccess).not.toHaveBeenCalled();
        expect(callbacks.onFailure).toHaveBeenCalledWith(errObj);
      });
    });

    it('should throw error in case group not found in returned data', () => {
      let groupId = 172286;

      let responseData = [];

      httpBackend.expectGET(`${endpoint}/group/mine/${CONSTANTS.GROUP.GROUP_TYPE_ID.SMALL_GROUPS}/${groupId}`).
                  respond(200, responseData);

      var promise = fixture.getGroupParticipants(groupId);
      httpBackend.flush();
      expect(promise.$$state.status).toEqual(2);

      let callbacks = jasmine.createSpyObj('callbacks', ['onSuccess', 'onFailure']);

      promise.then((data) => {
        callbacks.onSuccess(data);
      },
      (err) => {
        callbacks.onFailure(err);
      }).finally(() => {
        expect(callbacks.onSuccess).not.toHaveBeenCalled();
        expect(callbacks.onFailure).toHaveBeenCalled();
      });

    });

    it('should get all participants when successful', () => {
      let mockGroup = [{
        contactId: 5224083,
        Participants: [
          {
            "participantId": 4188863,
            "contactId": 1670863,
            "groupParticipantId": 14581967,
            "nickName": "Jim",
            "lastName": "Kriz",
            "groupRoleId": 22,
            "groupRoleTitle": "Leader",
            "email": "jim.kriz@ingagepartners.com"
          },
          {
            "participantId": 7537153,
            "contactId": 2562378,
            "groupParticipantId": 14581917,
            "nickName": "Joe",
            "lastName": "Kerstanoff",
            "groupRoleId": 22,
            "groupRoleTitle": "Leader",
            "email": "jkerstanoff@callibrity.com"
          },
          {
            "participantId": 5102871,
            "contactId": 5224083,
            "groupParticipantId": 14581913,
            "nickName": "Sara",
            "lastName": "Seissiger",
            "groupRoleId": 22,
            "groupRoleTitle": "Leader",
            "email": "sara.seissiger@ingagepartners.com"
          },
          {
            "participantId": 7433010,
            "contactId": 7539207,
            "groupParticipantId": 14582025,
            "nickName": "Dave",
            "lastName": "Miyamasu",
            "groupRoleId": 16,
            "groupRoleTitle": "Member",
            "email": "dmiyamasu@gmail.com"
          },
          {
            "participantId": 7534950,
            "contactId": 7641599,
            "groupParticipantId": 14581914,
            "nickName": "Markku",
            "lastName": "Koistila",
            "groupRoleId": 16,
            "groupRoleTitle": "Member",
            "email": "markku.koistila@ingagepartners.com"
          }
        ]
      }];

      let groupId = 172286;

      let participants = mockGroup[0].Participants.map((p) => {
        return new Participant(p);
      });

      httpBackend.expectGET(`${endpoint}/group/mine/${CONSTANTS.GROUP.GROUP_TYPE_ID.SMALL_GROUPS}/${groupId}`).
                  respond(200, mockGroup);

      var promise = fixture.getGroupParticipants(groupId);
      httpBackend.flush();
      expect(promise.$$state.status).toEqual(1);
      promise.then(function(data) {
        expect(data).toBeDefined();
        expect(data.length).toEqual(participants.length);
        for(let i = 0; i < data.length; i++) {
          expect(data[i].participantId).toEqual(participants[i].participantId);
          expect(data[i].contactId).toEqual(participants[i].contactId);
          expect(data[i].groupParticipantId).toEqual(participants[i].groupParticipantId);
          expect(data[i].nickName).toEqual(participants[i].nickName);
          expect(data[i].lastName).toEqual(participants[i].lastName);
          expect(data[i].groupRoleId).toEqual(participants[i].groupRoleId);
          expect(data[i].groupRoleTitle).toEqual(participants[i].groupRoleTitle);
          expect(data[i].email).toEqual(participants[i].email);
          if(data[i].contactId === mockGroup[0].contactId) {
            expect(data[i].primary).toBeTruthy();
          } else {
            expect(data[i].primary).toBeFalsy();
          }
        }
      });
    });
  });

  describe('approveDenyInquiry(groupId, approve, inquiry) function', () => {
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

    it('approve the inquirier', () => {
      let groupId = 172286;
     
      httpBackend.expectPOST(`${endpoint}/grouptool/grouptype/${CONSTANTS.GROUP.GROUP_TYPE_ID.SMALL_GROUPS}/group/${groupId}/inquiry/approve/true`, inquires[0]).
                  respond(200, {});

      var promise = fixture.approveDenyInquiry(groupId, true, inquires[0]);
      httpBackend.flush();
      expect(promise.$$state.status).toEqual(1);
    });
  });
  
  describe('getGroupByInvitationGUID(invitationGUID) function', () => {
    it('get the group', () => {
      httpBackend.expectGET(`${endpoint}/group/invitation/123212312`).
                  respond(200, {});

      var promise = fixture.getGroupByInvitationGUID(123212312);
      httpBackend.flush();
      expect(promise.$$state.status).toEqual(2);
    });
  });

  describe('search() function', () => {
    let groups = [{
      'groupName': 'Learning and Growing In Life',
    },{
      'groupName': 'Bible Study',
    },{
      'groupName': 'Bible Study 2',
    }];

    it('should search by keywords and location', () => {
      let keyword = 'keywords';
      let loc = 'oakley';
      httpBackend.expectGET(`${endpoint}/grouptool/grouptype/${CONSTANTS.GROUP.GROUP_TYPE_ID.SMALL_GROUPS}/group/search?loc=${loc}&s=${keyword}`).
                  respond(200, groups);
      let promise = fixture.search(keyword, loc);
      httpBackend.flush();
      expect(promise.$$state.status).toEqual(1);
      promise.then(function(data) {
        expect(data).toBeDefined();
        expect(data.length).toEqual(groups.length);
        for(let i = 0; i < data.length; i++) {
          expect(data[i] instanceof SmallGroup).toBeTruthy();
          expect(data[i].groupName).toEqual(groups[i].groupName);
        }
      });
    });

    it('should throw 404 error if no groups found', () => {
      let keyword = 'keywords';
      let loc = 'oakley';
      httpBackend.expectGET(`${endpoint}/grouptool/grouptype/${CONSTANTS.GROUP.GROUP_TYPE_ID.SMALL_GROUPS}/group/search?loc=${loc}&s=${keyword}`).
                  respond(200, []);
      let promise = fixture.search(keyword, loc);
      httpBackend.flush();
      expect(promise.$$state.status).toEqual(2);
      promise.then((data) => {
        expect('This should never be called - if it is, it means our 404 error was not thrown').toEqual('');
      }, (err) => {
        expect(err).toBeDefined();
        expect(err.status).toBeDefined();
        expect(err.status).toEqual(404);
      });
    });

    it('should rethrow error if backend call fails', () => {
      let keyword = 'keywords';
      let loc = 'oakley';
      httpBackend.expectGET(`${endpoint}/grouptool/grouptype/${CONSTANTS.GROUP.GROUP_TYPE_ID.SMALL_GROUPS}/group/search?loc=${loc}&s=${keyword}`).
                  respond(500);
      let promise = fixture.search(keyword, loc);
      httpBackend.flush();
      expect(promise.$$state.status).toEqual(2);
      promise.then((data) => {
        expect('This should never be called - if it is, it means our error was not rethrown').toEqual('');
      }, (err) => {
        expect(err).toBeDefined();
        expect(err.status).toBeDefined();
        expect(err.status).toEqual(500);
      });
    });
  });
  
  describe('getIsLeader(groupId) function', () => {
    it('they are a leader', () => {
      httpBackend.expectGET(`${endpoint}/grouptool/123212312/${CONSTANTS.GROUP.GROUP_TYPE_ID.SMALL_GROUPS}/isleader`).
                  respond(200, {Group: 'hi'});

      
      var promise = fixture.getIsLeader(123212312);
      httpBackend.flush();
      
      promise.then(function(data) {
        expect(data).toEqual(true);
      });
    });
    
    it('they are not a leader', () => {
      httpBackend.expectGET(`${endpoint}/grouptool/123212312/${CONSTANTS.GROUP.GROUP_TYPE_ID.SMALL_GROUPS}/isleader`).
                  respond(200, {});

      
      var promise = fixture.getIsLeader(123212312);
      httpBackend.flush();
      
      promise.then(function(data) {
        expect(data).toEqual(false);
      });
    });
  });
});