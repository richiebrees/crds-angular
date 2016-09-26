
import SmallGroup from '../../../app/group_tool/model/smallGroup';

describe('Group Tool SmallGroup', () => {

  let smallGroup,
    mockJson;

  beforeEach(() => {
    mockJson = {
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
      'kidsWelcome': false,
      'minAge': 0,
      'SignUpFamilyMembers': null,
      'events': null,
      'meetingDayId': null,
      'meetingDay': 'Friday',
      'meetingTime': '12:30:00',
      'meetingFrequency': 'Every Week',
      'meetingTimeFrequency': 'Fridays at 12:30 PM, Every Week',
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
      ],
      'attributeTypes': {
        '90': {
          'attributeTypeId': 1,
          'name': 'Group Attributes',
          'attributes': [
            {
              'attributeId': 1,
              'name': 'Boxing',
              'description': null,
              'selected': true,
              'startDate': '0001-01-01T00:00:00',
              'endDate': null,
              'notes': null,
              'sortOrder': 0,
              'category': 'Interest',
              'categoryDescription': null
            },
            {
              'attributeId': 1,
              'name': 'Father\'s',
              'description': null,
              'selected': true,
              'startDate': '0001-01-01T00:00:00',
              'endDate': null,
              'notes': null,
              'sortOrder': 0,
              'category': 'Men\'s',
              'categoryDescription': null
            }
          ]
        }
      }
    };

    smallGroup = new SmallGroup(mockJson);
  });

  describe('creation', () => {
    it('should have the following values', () => {
      expect(smallGroup.groupName).toEqual('Learning and Growing In Life');
      expect(smallGroup.groupDescription).toEqual('Learn about Jesus and Life Managment');
      expect(smallGroup.groupId).toEqual(172272);
      expect(smallGroup.meetingDay).toEqual('Friday');
      expect(smallGroup.meetingTime).toEqual('12:30:00');
    });

    it('should have an address value', () => {
      expect(smallGroup.address.constructor.name).toEqual('Address');
      expect(smallGroup.meetingLocation()).toEqual('Fake Street 98th, Madison IN, 47250');
    });

    it('should have an leaders', () => {
      expect(smallGroup.participants.length).toEqual(2);
      expect(smallGroup.participants[0].constructor.name).toEqual('Participant');
    });

    it('should have an leaders', () => {
      expect(smallGroup.categories.length).toEqual(2);
      expect(smallGroup.categories[0].name).toEqual('Boxing');
    });
  });

  describe('role()', () => {
    it('Leader role', () => {
      smallGroup.groupRoleId = 22;
      expect(smallGroup.role()).toEqual('Leader');
    });

    it('Apprentice role', () => {
      smallGroup.groupRoleId = 66;
      expect(smallGroup.role()).toEqual('Apprentice');
    });

    it('Participant role', () => {
      smallGroup.groupRoleId = 16;
      expect(smallGroup.role()).toEqual('Participant');
    });
  });

  describe('isLeader()', () => {
    it('is a Leader', () => {
      smallGroup.groupRoleId = 22;
      expect(smallGroup.isLeader()).toBeTruthy();
    });

    it('is not a Leader', () => {
      smallGroup.groupRoleId = 66;
      expect(smallGroup.isLeader()).toBeFalsy();
    });
  });

  describe('meetingLocation()', () => {
    it('there is an address', () => {
      expect(smallGroup.meetingLocation()).toEqual('Fake Street 98th, Madison IN, 47250');
    });

    it('address is null', () => {
      smallGroup.address = null;
      expect(smallGroup.meetingLocation()).toEqual('Online');
    });

    it('address is undefined', () => {
      smallGroup.address = undefined;
      expect(smallGroup.meetingLocation()).toEqual('Online');
    });
  });

  describe('visibility()', () => {
    it('is visible online', () => {
      smallGroup.availableOnline = true;
      expect(smallGroup.visibility()).toEqual('Public');
    });

    it('is not visible online', () => {
      smallGroup.address = null;
      expect(smallGroup.visibility()).toEqual('Private');
    });

    it('is undefined', () => {
      smallGroup.address = undefined;
      expect(smallGroup.visibility()).toEqual('Private');
    });

    it('is null', () => {
      smallGroup.address = undefined;
      expect(smallGroup.visibility()).toEqual('Private');
    });
  });

  describe('participantInGroup()', () => {
    it('participant is in group', () => {
      expect(smallGroup.participantInGroup(2562378)).toEqual(true);
    });

    it('participant is not in group', () => {
      expect(smallGroup.participantInGroup(2233445)).toEqual(false);
    });

    it('participant contactID is null', () => {
      var nullThing = null;
      expect(smallGroup.participantInGroup(nullThing)).toEqual(false);
    });

    it('participant contactID is undefined', () => {
      var undefinedThing = undefined;
      expect(smallGroup.participantInGroup(undefinedThing)).toEqual(false);
    });
  });

  describe('hasAddress()', () => {
    it('should return true if address components are set', () => {
      let group = new SmallGroup({address: {
        addressLine1: 'line1',
        city: 'the city',
        state: 'the state',
        zip: 'the zip'
      }});
      expect(group.hasAddress()).toBeTruthy();
    });

    it('should return false if addressLine1 is missing', () => {
      let group = new SmallGroup({address: {
        city: 'the city',
        state: 'the state',
        zip: 'the zip'
      }});
      expect(group.hasAddress()).toBeFalsy();
    });

    it('should return false if city is missing', () => {
      let group = new SmallGroup({address: {
        addressLine1: 'line1',
        state: 'the state',
        zip: 'the zip'
      }});
      expect(group.hasAddress()).toBeFalsy();
    });

    it('should return false if state is missing', () => {
      let group = new SmallGroup({address: {
        addressLine1: 'line1',
        city: 'the city',
        zip: 'the zip'
      }});
      expect(group.hasAddress()).toBeFalsy();
    });

    it('should return false if zip is missing', () => {
      let group = new SmallGroup({address: {
        addressLine1: 'line1',
        city: 'the city',
        state: 'the state'
      }});
      expect(group.hasAddress()).toBeFalsy();
    });

    it('should return false if address is missing', () => {
      let group = new SmallGroup();
      group.address = undefined;
      expect(group.hasAddress()).toBeFalsy();
    });
  });

  describe('categoriesToString()', () => {
    it('is Interest / Boxing, Men\'s / Father\'s', () => {
      expect(smallGroup.categoriesToString()).toEqual('Interest / Boxing, Men\'s / Father\'s');
    });
  });

  describe('emailList()', () => {
    it('is should return a list of the emails', () => {
      expect(smallGroup.emailList()).toEqual('dtkocher@callibrity.com,jim.kriz@ingagepartners.com,');
    });
  });

  describe('getGroupCardWhenField', () => {
    it('should return a group location string for display', () => {
      expect(smallGroup.getGroupCardWhenField()).toEqual('Fridays at 12:30 pm, Every Week');
    });

    it('should return a group location string for display', () => {
      smallGroup.meetingTime = "19:30:00";
      expect(smallGroup.getGroupCardWhenField()).toEqual('Fridays at 7:30 pm, Every Week');
    });

    it('should return a group location string for display', () => {
      smallGroup.meetingTime = "4:30:00";
      expect(smallGroup.getGroupCardWhenField()).toEqual('Fridays at 4:30 am, Every Week');
    });

    it('should return every month', () => {
      smallGroup.meetingFrequencyText = 'Every month';
      expect(smallGroup.getGroupCardWhenField()).toEqual('Fridays at 12:30 pm, Every month');
    });

    it('should return a group location string for display', () => {
      smallGroup.meetingDay = undefined;
      expect(smallGroup.getGroupCardWhenField()).toEqual('Flexible Meeting Time');
    });

    it('should return a group location string for display', () => {
      smallGroup.meetingDay = null;
      expect(smallGroup.getGroupCardWhenField()).toEqual('Flexible Meeting Time');
    });
  });
});
