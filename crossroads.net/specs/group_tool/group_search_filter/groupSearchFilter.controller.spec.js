
import constants from 'crds-constants';
import GroupSearchFilter from '../../../app/group_tool/group_search_filter/groupSearchFilter.controller';
import AgeRangeFilter from '../../../app/group_tool/group_search_filter/filter_impl/ageRange.filter';
import CategoryFilter from '../../../app/group_tool/group_search_filter/filter_impl/category.filter';
import KidsWelcomeFilter from '../../../app/group_tool/group_search_filter/filter_impl/kidsWelcome.filter';
import LocationFilter from '../../../app/group_tool/group_search_filter/filter_impl/location.filter';
import GroupTypeFilter from '../../../app/group_tool/group_search_filter/filter_impl/groupType.filter';
import MeetingDayFilter from '../../../app/group_tool/group_search_filter/filter_impl/meetingDay.filter';
import MeetingTimeFilter from '../../../app/group_tool/group_search_filter/filter_impl/meetingTime.filter';
import FrequencyFilter from '../../../app/group_tool/group_search_filter/filter_impl/frequency.filter';
import LeadersSiteFilter from '../../../app/group_tool/group_search_filter/filter_impl/leadersSite.filter';
import FilterGroup from '../../../app/group_tool/group_search_filter/filter_impl/filterGroup';

describe('GroupSearchFilter', () => {
  let fixture, groupService, createGroupService, qApi;

  beforeEach(angular.mock.module(constants.MODULES.GROUP_TOOL));

  beforeEach(inject(function ($injector) {
    groupService = jasmine.createSpyObj('groupServiceMock', [ 'getAgeRanges', 
                                                              'getGroupGenderMixType', 
                                                              'getDaysOfTheWeek', 
                                                              'getGroupCategories', 
                                                              'getSites']);

    createGroupService = jasmine.createSpyObj('createGroupServiceMock', ['getMeetingFrequencies']);

    qApi = $injector.get('$q');

    fixture = new GroupSearchFilter(groupService, createGroupService);
  }));

  describe('the constructor', () => {
    it('should initialize properties', () => {
      expect(fixture.expanded).toBeFalsy();
      expect(fixture.allFilters).not.toBeDefined();
      expect(fixture.expandedFilter).toBe(null);
    });
  });

  describe('$onInit function', () => {
    it('should initialize filters', () => {
      spyOn(fixture, 'initializeFilters').and.callFake(() => {});
      fixture.$onInit();
      expect(fixture.initializeFilters).toHaveBeenCalled();
    });
  });

  describe('$onChanges function', () => {
    it('should reset search results and re-apply filters', () => {
      let changes = {
        searchResults: {
          currentValue: {
            p1: '1',
            p2: '2'
          }
        }
      };
      spyOn(fixture, 'applyFilters').and.callFake(() => {});
      fixture.$onChanges(changes);
      expect(fixture.applyFilters).toHaveBeenCalled();
      expect(fixture.searchResults).toBe(changes.searchResults.currentValue);
    });
  });

  describe('initializeFilters function', () => {
    it('should initialize all filters', () => {
      groupService.getAgeRanges.and.callFake(() => { let d = qApi.defer(); d.reject({}); return d.promise; });
      groupService.getGroupGenderMixType.and.callFake(() => { let d = qApi.defer(); d.reject({}); return d.promise; });
      groupService.getDaysOfTheWeek.and.callFake(() => { let d = qApi.defer(); d.reject({}); return d.promise; });
      groupService.getGroupCategories.and.callFake(() => { let d = qApi.defer(); d.reject({}); return d.promise; });
      createGroupService.getMeetingFrequencies.and.callFake(() => { let d = qApi.defer(); d.reject({}); return d.promise; });
      groupService.getSites.and.callFake(() => { let d = qApi.defer(); d.reject({}); return d.promise; });

      fixture.allFilters = undefined;

      fixture.initializeFilters();

      expect(fixture.allFilters.getValues().length).toEqual(7);

      let i = 0;

      let ageRangeFilter = fixture.allFilters.getValues()[i++];
      expect(ageRangeFilter instanceof AgeRangeFilter).toBeTruthy();
      expect(ageRangeFilter.getName()).toEqual('Age Range');
      expect(groupService.getAgeRanges).toHaveBeenCalled();

      let categoryFilter = fixture.allFilters.getValues()[i++];
      expect(categoryFilter instanceof CategoryFilter).toBeTruthy();
      expect(categoryFilter.getName()).toEqual('Category');
      expect(groupService.getGroupCategories).toHaveBeenCalled();

      let groupTypeFilter = fixture.allFilters.getValues()[i++];
      expect(groupTypeFilter instanceof GroupTypeFilter).toBeTruthy();
      expect(groupTypeFilter.getName()).toEqual('Group Type');
      expect(groupService.getGroupGenderMixType).toHaveBeenCalled();

      let kidsWelcomeFilter = fixture.allFilters.getValues()[i++];
      expect(kidsWelcomeFilter instanceof KidsWelcomeFilter).toBeTruthy();
      expect(kidsWelcomeFilter.getName()).toEqual('Kids Welcome');

      let locationFilter = fixture.allFilters.getValues()[i++];
      expect(locationFilter instanceof LocationFilter).toBeTruthy();
      expect(locationFilter.getName()).toEqual('Location');

      let dayTimeFrequencyFilter = fixture.allFilters.getValues()[i++];
      expect(dayTimeFrequencyFilter instanceof FilterGroup).toBeTruthy();
      expect(dayTimeFrequencyFilter.getValues().length).toEqual(3);

      let j = 0;

      let meetingDayFilter = dayTimeFrequencyFilter.getValues()[j++];
      expect(meetingDayFilter instanceof MeetingDayFilter).toBeTruthy();
      expect(meetingDayFilter.getName()).toEqual('Day');
      expect(groupService.getDaysOfTheWeek).toHaveBeenCalled();

      let meetingTimeFilter = dayTimeFrequencyFilter.getValues()[j++];
      expect(meetingTimeFilter instanceof MeetingTimeFilter).toBeTruthy();
      expect(meetingTimeFilter.getName()).toEqual('Time');

      let frequencyFilter = dayTimeFrequencyFilter.getValues()[j++];
      expect(frequencyFilter instanceof FrequencyFilter).toBeTruthy();
      expect(frequencyFilter.getName()).toEqual('Frequency');

      let leadersSiteFilter = fixture.allFilters.getValues()[i++];
      expect(leadersSiteFilter instanceof LeadersSiteFilter).toBeTruthy();
      expect(leadersSiteFilter.getName()).toEqual('Leaders Site');
      expect(groupService.getSites).toHaveBeenCalled();
    });
  });

  describe('applyFilters function', () => {
    it('should apply filters and reload ngTable', () => {
      fixture.expanded = true;

      fixture.searchResults = [
        { 'age': 1, 'kids': false },
        { 'age': 2, 'kids': true },
        { 'age': 3, 'kids': true },
      ];

      fixture.allFilters = jasmine.createSpyObj('allFiltersMock', ['getValues']);
      fixture.allFilters.getValues.and.returnValue(
        [
          {
            matches: function(r) {
              return r.age === 2;
            }
          },
          {
            matches: function(r) {
              return r.kids === true;
            }
          }
        ]
      );

      let settings = {
            dataset: [{ 'age': 5 }],
            someOtherSettingThatShouldNotChange: true
      };

      fixture.tableParams = {
        settings: function() {
          return settings;
        },
        reload: function() {}
      };

      spyOn(fixture.tableParams, 'reload').and.callFake(() => {});

      fixture._internalApplyFilters();

      expect(fixture.tableParams.reload).toHaveBeenCalled();
      expect(fixture.expanded).toBeTruthy();
      expect(fixture.tableParams.settings().dataset).toEqual([{ 'age': 2, 'kids': true }]);
      expect(fixture.tableParams.settings().someOtherSettingThatShouldNotChange).toBeTruthy();
    });
  });

  describe('filter manipulation function', () => {
    it('clearFilters should clear and re-apply all filters', () => {
      fixture.allFilters = jasmine.createSpyObj('allFiltersMock', ['clear']);
      spyOn(fixture, 'applyFilters').and.callFake(() => {});

      fixture.clearFilters();
      expect(fixture.allFilters.clear).toHaveBeenCalled();
      expect(fixture.applyFilters).toHaveBeenCalled();
    });

    it('openFilters should set expanded to true', () => {
      fixture.expanded = false;
      fixture.openFilters();

      expect(fixture.expanded).toBeTruthy();
    });
    
    it('closeFilters should set expanded to false', () => {
      fixture.expanded = true;
      let form = {
      };
      fixture.closeFilters(form);

      expect(fixture.expanded).toBeFalsy();
    });

    it('hasFilters should return false if no active filters', () => {
      fixture.allFilters = jasmine.createSpyObj('allFiltersMock', ['hasFilters']);
      fixture.allFilters.hasFilters.and.returnValue(false);

      expect(fixture.hasFilters()).toBeFalsy();
      expect(fixture.allFilters.hasFilters).toHaveBeenCalled();
    });    

    it('hasFilters should return true if one or more active filters', () => {
      fixture.allFilters = jasmine.createSpyObj('allFiltersMock', ['hasFilters']);
      fixture.allFilters.hasFilters.and.returnValue(true);

      expect(fixture.hasFilters()).toBeTruthy();
      expect(fixture.allFilters.hasFilters).toHaveBeenCalled();
    });    
  });
});
