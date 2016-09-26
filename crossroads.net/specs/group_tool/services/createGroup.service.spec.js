
import CONSTANTS from 'crds-constants';
import SmallGroup from '../../../app/group_tool/model/smallGroup';
import Participant from '../../../app/group_tool/model/participant';
import AgeRange from '../../../app/group_tool/model/ageRange';
import Address from '../../../app/group_tool/model/address';
import Category from '../../../app/group_tool/model/category';
import GroupType from '../../../app/group_tool/model/groupType';
import CreateGroupService from '../../../app/group_tool/services/createGroup.service';

describe('Group Tool Group Service', () => {
  let smallGroup,
    mockJson;

  let fixture,
    log,
    mockProfile,
    groupService,
    session,
    rootScope,
    authenticated,
    httpBackend,
    ImageService,
    profile;

  beforeEach(angular.mock.module(CONSTANTS.MODULES.GROUP_TOOL));

  beforeEach(angular.mock.module(($provide) => {
    mockProfile = jasmine.createSpyObj('Profile', ['Personal']);
    $provide.value('Profile', mockProfile);
  }));


  beforeEach(inject(function ($injector) {
    log = $injector.get('$log');
    groupService = $injector.get('GroupService')
    session = $injector.get('Session');
    rootScope = $injector.get('$rootScope');
    httpBackend = $injector.get('$httpBackend');
    ImageService = $injector.get('ImageService');
    profile = $injector.get('Profile');

    smallGroup = new SmallGroup();
    fixture = new CreateGroupService(log, profile, groupService, session, rootScope, ImageService);
  }));


  afterEach(() => {
    httpBackend.verifyNoOutstandingExpectation();
    httpBackend.verifyNoOutstandingRequest();
  });

  // afterEach(function () {
  //   console.log(log.debug.logs); //do it here to output for every test...
  // });

  describe('mapToSmallGroupType() function', () => {
    it('group types are mapped correctly', () => {

      fixture.typeIdLookup = [
        { 'attributeId': 7007, 'name': 'Men and women together (like God intended).' },
        { 'attributeId': 7008, 'name': 'Men only (no girls allowed).' },
        { 'attributeId': 7009, 'name': 'Women only (don\'t be a creeper, dude).' },
        { 'attributeId': 7010, 'name': 'Couples (married, engaged, etc.).' },
      ];
      let model = { group: { 'typeId': 7009 } };
      fixture.model = model;

      fixture.mapToSmallGroupType(smallGroup);
      expect(smallGroup.groupType.attributeId).toEqual(model.group.typeId);
    });

    it('selected group type mapped correctly on save', () => {
      let GROUP_TYPE_ATTRIBUTE_TYPE_ID = 73;
      fixture.originalSingleAttributes = null;
      smallGroup.groupType = { attributeId: 7009, name: 'Women only (don\'t be a creeper, dude).' }

      fixture.mapToSmallGroupSingleAttributes(smallGroup);

      expect(7009).toEqual(smallGroup.groupType.attributeId);
    });
  });

   describe('getCongregationId() function', () => {
    it('editGroupCongregationId is null and congregationId is mapped correctly', () => {

      let model = { profile: { 'congregationId': 0 } };
      fixture.editGroupCongregationId = null;
      fixture.model = model;

      let returnId = fixture.getCongregationId();
      expect(returnId).toEqual(model.profile.congregationId);
    });

    it('editGroupCongregationId is not null and user is leader and congregationId is mapped correctly', () => {

      let model = { profile: { 'congregationId': 1 } };
      fixture.editGroupCongregationId = 2;
      fixture.model = model;
      fixture.primaryContactId = 1234;
      spyOn(fixture.session, 'exists').and.callFake(function(userId) {
        return '1234';
      });

      let returnId = fixture.getCongregationId();
      expect(returnId).toEqual(model.profile.congregationId);
    });

    it('editGroupCongregationId is not null and user is not leader and congregationId is mapped correctly', () => {

      let model = { profile: { 'congregationId': 1 } };
      let editGroupCongregationId = 2;
      fixture.editGroupCongregationId = editGroupCongregationId;
      fixture.model = model;
      fixture.primaryContactId = 1234;
      spyOn(fixture.session, 'exists').and.callFake(function(userId) {
        return '2222';
      });

      let returnId = fixture.getCongregationId();
      expect(returnId).toEqual(editGroupCongregationId);
    });
  });

  describe('mapToSmallGroupMultipleAttributes() function', () => {
    it('age ranges are mapped correctly', () => {
      fixture.ageRangeLookup = [
        { 'attributeId': 111, 'name': '20s' },
        { 'attributeId': 222, 'name': '30s' },
        { 'attributeId': 333, 'name': '40s' },
        { 'attributeId': 444, 'name': '50s' },
      ];
      let model = { groupAgeRangeIds: { selectedRange: 111 } };
      fixture.model = model;

      fixture.mapToSmallGroupMultipleAttributes(smallGroup);
      expect(111).toEqual(model.groupAgeRangeIds.selectedRange);
    });
  });

  describe('mapToSmallGroupCategory() function', () => {
    it('categories are mapped correctly', () => {
      let model = {
        categories: [
          { value: 123, detail: 'My interest' },
        ]
      };
      smallGroup.attributeTypes = {};
      fixture.model = model;
      fixture.mapToSmallGroupCategory(smallGroup);
      expect(123, smallGroup.categories[0].categoryId, 'categories not mapped correctely');
    });
  });

  describe('mapFromSmallGroupMultipleAttributes() function', () => {
    it('age ranges mapped correctly from small group to object', () => {
      smallGroup.attributeTypes = {
        91: {
          attributeTypeId: 91,
          attributes: [
            { 'attributeId': 111, 'name': '20s', selected: false },
            { 'attributeId': 222, 'name': '30s', selected: false },
            { 'attributeId': 333, 'name': '40s', selected: true },
            { 'attributeId': 444, 'name': '50s', selected: false },
          ]
        }
      };

      fixture.mapFromSmallGroupMultipleAttributes(smallGroup);
      expect(333).toEqual(fixture.model.groupAgeRangeIds[0]);
    });
  });

  describe('mapFromSmallGroupCategory() function', () => {
    it('categories are mapped correctly', () => {
      smallGroup.attributeTypes
        = {
          90: {
            attributeTypeId: 90,
            attributes: [{ attributeId: 123, name: 'My interest', selected: true },]
          }
        };
      fixture.mapFromSmallGroupCategory(smallGroup);
      expect(123, fixture.model.categories[0].value, 'categories not mapped correctely');
    });
  });

});