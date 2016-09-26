
import {SearchFilterValue} from '../../../../app/group_tool/group_search_filter/filter_impl/searchFilter';
import CategoryFilter from '../../../../app/group_tool/group_search_filter/filter_impl/category.filter';

describe('CategoryFilter', () => {
  let qApi, rootScope;

  beforeEach(inject(function ($injector) {
    qApi = $injector.get('$q');
    rootScope = $injector.get('$rootScope');
  }));
  
  describe('the constructor', () => {
    it('should load categories', () => {
      let categories = [
        {label: 'Interest', categoryId: 123, labelDesc: 'interest123'},
        {label: 'Neighborhoods', categoryId: 456, labelDesc: 'neighborhoods456'},
      ];

      let deferred = qApi.defer();
      deferred.resolve(categories);
      let groupService = jasmine.createSpyObj('groupServiceMock', ['getGroupCategories']);
      groupService.getGroupCategories.and.returnValue(deferred.promise);

      let filter = new CategoryFilter('Category', groupService);
      rootScope.$apply();
      expect(groupService.getGroupCategories).toHaveBeenCalled();
      expect(filter.getValues()).toBeDefined();
      expect(filter.getValues().length).toEqual(categories.length);
      for(let i = 0; i < categories.length; i++) {
        expect(filter.getValues()[i].getName()).toEqual(categories[i].label);
        expect(filter.getValues()[i].getValue()).toEqual(categories[i].categoryId);
        expect(filter.getValues()[i].getHelpText()).toEqual(categories[i].labelDesc);
        expect(filter.getValues()[i].isSelected()).toBeFalsy();
      }
    });
  });

  describe('matches() function', () => {
    let fixture;

    beforeEach(() => {
      let deferred = qApi.defer();
      deferred.resolve([]);

      let groupService = jasmine.createSpyObj('groupServiceMock', ['getGroupCategories']);
      groupService.getGroupCategories.and.returnValue(deferred.promise);
      fixture = new CategoryFilter('Category', groupService);
      rootScope.$apply();
    });
    
    it('should return true if no category currently filtered', () => {
      let categories = [
        new SearchFilterValue('Interest', 123, false)
      ];
      let searchResult = {
        categories: [
          { categoryId: 456 }
        ]
      };
      fixture.filterValues = categories;

      expect(fixture.matches(searchResult)).toBeTruthy();
    });

    it('should return true if the search result contains a filtered category', () => {
      let categories = [
        new SearchFilterValue('Interest', 123, false),
        new SearchFilterValue('Neighborhoods', 456, true)
      ];
      let searchResult = {
        categories: [
          { categoryId: 456 }
        ]
      };
      fixture.filterValues = categories;

      expect(fixture.matches(searchResult)).toBeTruthy();
    });

    it('should return false if the search result does not contain a filtered category', () => {
      let categories = [
        new SearchFilterValue('Interest', 123, false),
        new SearchFilterValue('Neighborhoods', 456, true)
      ];
      let searchResult = {
        categories: [
          { categoryId: 789 }
        ]
      };
      fixture.filterValues = categories;

      expect(fixture.matches(searchResult)).toBeFalsy();
    });

    it('should return false if the search result does not contain a category', () => {
      let categories = [
        new SearchFilterValue('Interest', 123, false),
        new SearchFilterValue('Neighborhoods', 456, true)
      ];
      let searchResult = {
        categories: [ ]
      };
      fixture.filterValues = categories;

      expect(fixture.matches(searchResult)).toBeFalsy();
    });
  });
});
