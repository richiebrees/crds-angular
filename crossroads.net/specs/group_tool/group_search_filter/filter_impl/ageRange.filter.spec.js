
import {SearchFilterValue} from '../../../../app/group_tool/group_search_filter/filter_impl/searchFilter';
import AgeRangeFilter from '../../../../app/group_tool/group_search_filter/filter_impl/ageRange.filter';

describe('AgeRangeFilter', () => {
  let qApi, rootScope;

  beforeEach(inject(function ($injector) {
    qApi = $injector.get('$q');
    rootScope = $injector.get('$rootScope');
  }));
  
  describe('the constructor', () => {
    it('should load age ranges', () => {
      let ageRanges = [
        {name: '40s', attributeId: 123},
        {name: '50s', attributeId: 456},
      ];

      let deferred = qApi.defer();
      deferred.resolve({ 
        attributes: ageRanges
      });
      let groupService = jasmine.createSpyObj('groupServiceMock', ['getAgeRanges']);
      groupService.getAgeRanges.and.returnValue(deferred.promise);

      let filter = new AgeRangeFilter('Age Range', groupService);
      rootScope.$apply();
      expect(groupService.getAgeRanges).toHaveBeenCalled();
      expect(filter.getValues()).toBeDefined();
      expect(filter.getValues().length).toEqual(ageRanges.length);
      for(let i = 0; i < ageRanges.length; i++) {
        expect(filter.getValues()[i].getName()).toEqual(ageRanges[i].name);
        expect(filter.getValues()[i].getValue()).toEqual(ageRanges[i].attributeId);
        expect(filter.getValues()[i].isSelected()).toBeFalsy();
      }
    });
  });

  describe('matches() function', () => {
    let fixture;

    beforeEach(() => {
      let deferred = qApi.defer();
      deferred.resolve({attributes: []});

      let groupService = jasmine.createSpyObj('groupServiceMock', ['getAgeRanges']);
      groupService.getAgeRanges.and.returnValue(deferred.promise);
      fixture = new AgeRangeFilter('Age Range', groupService);
      rootScope.$apply();
    });

    it('should return true if no age range currently filtered', () => {
      let ageRanges = [
        new SearchFilterValue('40s', 123, false)
      ];
      let searchResult = {
        ageRange: [
          { attributeId: 456 },
          { attributeId: 789 }
        ]
      };
      fixture.filterValues = ageRanges;

      expect(fixture.matches(searchResult)).toBeTruthy();
    });

    it('should return true if the search result contains a filtered age range', () => {
      let ageRanges = [
        new SearchFilterValue('40s', 123, false),
        new SearchFilterValue('50s', 456, true)
      ];
      let searchResult = {
        ageRange: [
          { attributeId: 456 },
          { attributeId: 789 }
        ]
      };
      fixture.filterValues = ageRanges;

      expect(fixture.matches(searchResult)).toBeTruthy();
    });

    it('should return false if the search result does not contain a filtered age range', () => {
      let ageRanges = [
        new SearchFilterValue('40s', 123, false),
        new SearchFilterValue('50s', 456, true)
      ];  
      let searchResult = {
        ageRange: [
          { attributeId: 234 },
          { attributeId: 567 }
        ]
      };
      fixture.filterValues = ageRanges;

      expect(fixture.matches(searchResult)).toBeFalsy();
    });

    it('should return false if the search result does not contain an age range', () => {
      let ageRanges = [
        new SearchFilterValue('40s', 123, false),
        new SearchFilterValue('50s', 456, true)
      ];  
      let searchResult = { };
      fixture.filterValues = ageRanges;
      
      expect(fixture.matches(searchResult)).toBeFalsy();
    });
  });
});