
import {SearchFilterValue} from '../../../../app/group_tool/group_search_filter/filter_impl/searchFilter';
import FrequencyFilter from '../../../../app/group_tool/group_search_filter/filter_impl/frequency.filter';

describe('FrequencyFilter', () => {
  describe('the constructor', () => {
    it('should load frequencies', () => {
      let frequencies = [
        { meetingFrequencyDesc: 'Weekly', meetingFrequencyId: 123 },
        { meetingFrequencyDesc: 'Monthly', meetingFrequencyId: 456 }
      ];

      let createGroupService = jasmine.createSpyObj('createGroupServiceMock', ['getMeetingFrequencies']);
      createGroupService.getMeetingFrequencies.and.returnValue(frequencies);

      let filter = new FrequencyFilter('Frequency', createGroupService);
      expect(createGroupService.getMeetingFrequencies).toHaveBeenCalled();
      expect(filter.getValues()).toBeDefined();
      expect(filter.getValues().length).toEqual(frequencies.length);
      for (let i = 0; i < frequencies.length; i++) {
        expect(filter.getValues()[i].getName()).toEqual(frequencies[i].meetingFrequencyDesc);
        expect(filter.getValues()[i].getValue()).toEqual(frequencies[i].meetingFrequencyId);
        expect(filter.getValues()[i].isSelected()).toBeFalsy();
      }
    });
  });

  describe('matches() function', () => {
    let fixture;
    beforeEach(() => {
      let createGroupService = jasmine.createSpyObj('createGroupServiceMock', ['getMeetingFrequencies']);
      createGroupService.getMeetingFrequencies.and.returnValue([]);

      fixture = new FrequencyFilter('Frequency', createGroupService);
    });

    it('should return true if no frequency currently filtered', () => {
      let frequencies = [
        new SearchFilterValue('Weekly', 1, false)
      ];
      let searchResult = {
        meetingFrequencyID: 1
      };
      fixture.filterValues = frequencies;

      expect(fixture.matches(searchResult)).toBeTruthy();
    });

    it('should return true if the search result contains a filtered frequency', () => {
      let frequencies = [
        new SearchFilterValue('Weekly', 1, true),
        new SearchFilterValue('Monthly', 3, true)
      ];
      let searchResult = {
        meetingFrequencyID: 1
      };
      fixture.filterValues = frequencies;

      expect(fixture.matches(searchResult)).toBeTruthy();
    });

    it('should return false if the search result does not contain a filtered frequency', () => {
      let frequencies = [
        new SearchFilterValue('Weekly', 1, false),
        new SearchFilterValue('Monthly', 3, true)
      ];
      let searchResult = {
        meetingFrequencyID: 1
      };
      fixture.filterValues = frequencies;

      expect(fixture.matches(searchResult)).toBeFalsy();
    });

    it('should return false if the search result does not contain an meeting day', () => {
      let frequencies = [
        new SearchFilterValue('Weekly', 1, false),
        new SearchFilterValue('Monthly', 3, true)
      ];
      let searchResult = {};
      fixture.filterValues = frequencies;

      expect(fixture.matches(searchResult)).toBeFalsy();
    });
  });
});
