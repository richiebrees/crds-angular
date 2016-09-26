
import {SearchFilterValue} from '../../../../app/group_tool/group_search_filter/filter_impl/searchFilter';
import GroupTypeFilter from '../../../../app/group_tool/group_search_filter/filter_impl/groupType.filter';

describe('GroupTypeFilter', () => {
  let qApi, rootScope;

  beforeEach(inject(function ($injector) {
    qApi = $injector.get('$q');
    rootScope = $injector.get('$rootScope');
  }));
  
  describe('the constructor', () => {
    it('should load group types', () => {
      let types = [
        {name: 'Couples', attributeId: 123},
        {name: 'Men', attributeId: 456},
      ];

      let deferred = qApi.defer();
      deferred.resolve({ 
        attributes: types
      });
      let groupService = jasmine.createSpyObj('groupServiceMock', ['getGroupGenderMixType']);
      groupService.getGroupGenderMixType.and.returnValue(deferred.promise);

      let filter = new GroupTypeFilter('Group Type', groupService);
      rootScope.$apply();
      expect(groupService.getGroupGenderMixType).toHaveBeenCalled();
      expect(filter.getValues()).toBeDefined();
      expect(filter.getValues().length).toEqual(types.length);
      for(let i = 0; i < types.length; i++) {
        expect(filter.getValues()[i].getName()).toEqual(types[i].name);
        expect(filter.getValues()[i].getValue()).toEqual(types[i].attributeId);
        expect(filter.getValues()[i].isSelected()).toBeFalsy();
      }
    });
  });

  describe('matches() function', () => {
    let fixture;

    beforeEach(() => {
      let deferred = qApi.defer();
      deferred.resolve({attributes: []});

      let groupService = jasmine.createSpyObj('groupServiceMock', ['getGroupGenderMixType']);
      groupService.getGroupGenderMixType.and.returnValue(deferred.promise);
      fixture = new GroupTypeFilter('Group Type', groupService);
      rootScope.$apply();
    });

    it('should return true if no group type currently filtered', () => {
      let groupTypes = [
        new SearchFilterValue('Couples', 123, false)
      ];
      let searchResult = {
        groupType: { attributeId: 456 }
      };
      fixture.filterValues = groupTypes;

      expect(fixture.matches(searchResult)).toBeTruthy();
    });

    it('should return true if the search result contains a filtered group type', () => {
      let groupTypes = [
        new SearchFilterValue('Couples', 123, false),
        new SearchFilterValue('Men', 456, true)
      ];
      let searchResult = {
        groupType: { attributeId: 456 }
      };
      fixture.filterValues = groupTypes;

      expect(fixture.matches(searchResult)).toBeTruthy();
    });

    it('should return false if the search result does not contain a filtered group type', () => {
      let groupTypes = [
        new SearchFilterValue('Couples', 123, false),
        new SearchFilterValue('Men', 456, true)
      ];
      let searchResult = {
        groupType: { attributeId: 234 }
      };
      fixture.filterValues = groupTypes;

      expect(fixture.matches(searchResult)).toBeFalsy();
    });

    it('should return false if the search result does not contain a group type', () => {
      let groupTypes = [
        new SearchFilterValue('Couples', 123, false),
        new SearchFilterValue('Men', 456, true)
      ];
      let searchResult = { };
      fixture.filterValues = groupTypes;

      expect(fixture.matches(searchResult)).toBeFalsy();
    });
  });
});