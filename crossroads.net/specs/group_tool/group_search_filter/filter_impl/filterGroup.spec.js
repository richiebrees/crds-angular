
import FilterGroup from '../../../../app/group_tool/group_search_filter/filter_impl/filterGroup';
import {SearchFilter, SearchFilterValue} from '../../../../app/group_tool/group_search_filter/filter_impl/searchFilter';

describe('FilterGroup', () => {
  let fixture, filter1, filter2, matchingFunction1, matchingFunction2;
  beforeEach(() => {
    matchingFunction1 = jasmine.createSpy('matchingFunction1');
    matchingFunction2 = jasmine.createSpy('matchingFunction2');
    filter1 = new SearchFilter('filter1', [new SearchFilterValue('value1', 1, false)], matchingFunction1);
    filter2 = new SearchFilter('filter2', [new SearchFilterValue('value2', 2, false)], matchingFunction2);

    fixture = new FilterGroup('fixture', [filter1, filter2], false);
  });

  describe('the constructor', () => {
    it('should set properties if top level', () => {
      spyOn(filter1, 'setFilterGroup');
      spyOn(filter2, 'setFilterGroup');
      let filters = [filter1, filter2];
      fixture = new FilterGroup('group name', filters, true);

      expect(fixture.getName()).toEqual('group name');
      expect(fixture.getValues()).toEqual(filters);
      expect(fixture.getSelectedValues()).toEqual([]);
      expect(filter1.setFilterGroup).not.toHaveBeenCalled();
      expect(filter2.setFilterGroup).not.toHaveBeenCalled();
    });

    it('should set properties and filter group if not top level', () => {
      spyOn(filter1, 'setFilterGroup');
      spyOn(filter2, 'setFilterGroup');
      let filters = [filter1, filter2];
      fixture = new FilterGroup('group name', filters, false);

      expect(fixture.getName()).toEqual('group name');
      expect(fixture.getValues()).toEqual(filters);
      expect(fixture.getSelectedValues()).toEqual([]);
      expect(filter1.setFilterGroup).toHaveBeenCalled();
      expect(filter2.setFilterGroup).toHaveBeenCalled();
    });
  });

  describe('getCurrentFilters function', () => {
    it('should return nothing if no active filters', () => {
      spyOn(filter1, 'isActive').and.returnValue(false);
      spyOn(filter2, 'isActive').and.returnValue(false);

      expect(fixture.getCurrentFilters()).toEqual([]);
    });

    it('should return current values for active filters', () => {
      filter1.getValues()[0].selected = true;
      filter2.getValues()[0].selected = true;
      expect(fixture.getCurrentFilters().length).toEqual(2);
      expect(fixture.getCurrentFilters()).toEqual([filter1, filter2]);
    });
  });

  describe('matches() function', () => {
    it('should be false if none of the contained filters match', () => {
      spyOn(filter1, 'matches').and.returnValue(false);
      spyOn(filter2, 'matches').and.returnValue(false);

      let result = { p1: 1, p2: 2};
      expect(fixture.matches(result)).toBeFalsy();
      expect(filter1.matches).toHaveBeenCalledWith(result);
      expect(filter2.matches).not.toHaveBeenCalled();
    });

    it('should be false if only some of the contained filters match', () => {
      spyOn(filter1, 'matches').and.returnValue(true);
      spyOn(filter2, 'matches').and.returnValue(false);

      let result = { p1: 1, p2: 2};
      expect(fixture.matches(result)).toBeFalsy();
      expect(filter1.matches).toHaveBeenCalledWith(result);
      expect(filter2.matches).toHaveBeenCalledWith(result);
    });

    it('should be true if all of the contained filters match', () => {
      spyOn(filter1, 'matches').and.returnValue(true);
      spyOn(filter2, 'matches').and.returnValue(true);

      let result = { p1: 1, p2: 2};
      expect(fixture.matches(result)).toBeTruthy();
      expect(filter1.matches).toHaveBeenCalledWith(result);
      expect(filter2.matches).toHaveBeenCalledWith(result);
    });
  });

  describe('hasFilters() function', () => {
    it('should delegate to the isActive() function', () => {
      spyOn(fixture, 'isActive').and.returnValue(true);

      expect(fixture.hasFilters()).toBeTruthy();
      expect(fixture.isActive).toHaveBeenCalled();
    });
  });

  describe('isActive() function', () => {
    it('should be false if none of the contained filters are active', () => {
      spyOn(filter1, 'isActive').and.returnValue(false);
      spyOn(filter2, 'isActive').and.returnValue(false);

      expect(fixture.isActive()).toBeFalsy();
      expect(filter1.isActive).toHaveBeenCalled();
      expect(filter2.isActive).toHaveBeenCalled();
    });

    it('should be true if any of the contained filters are active', () => {
      spyOn(filter1, 'isActive').and.returnValue(true);
      spyOn(filter2, 'isActive').and.returnValue(false);

      expect(fixture.isActive()).toBeTruthy();
      expect(filter1.isActive).toHaveBeenCalled();
      expect(filter2.isActive).not.toHaveBeenCalled();
    });
  });

  describe('clear() function', () => {
    it('should clear all contained filters', () => {
      spyOn(filter1, 'clear').and.callFake(() => {});
      spyOn(filter2, 'clear').and.callFake(() => {});

      fixture.clear();
      expect(filter1.clear).toHaveBeenCalled();
      expect(filter2.clear).toHaveBeenCalled();
    });
  });

  describe('filterGroup function', () => {
    it('setFilterGroup() should set the filter group', () => {
      let filterGroup = {group: 1};
      fixture.setFilterGroup(filterGroup);
      expect(fixture.getFilterGroup()).toBe(filterGroup);
    });

    it('belongsToFilterGroup() should return true if it has a filter group', () => {
      let filterGroup = {group: 1};
      fixture.setFilterGroup(filterGroup);
      expect(fixture.belongsToFilterGroup()).toBeTruthy();
    });

    it('belongsToFilterGroup() should return false if it does not have a filter group', () => {
      fixture.setFilterGroup(undefined);
      expect(fixture.belongsToFilterGroup()).toBeFalsy();
    });
  });
});