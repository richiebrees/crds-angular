
import {SearchFilterValue} from '../../../../app/group_tool/group_search_filter/filter_impl/searchFilter';
import MeetingDayFilter from '../../../../app/group_tool/group_search_filter/filter_impl/meetingDay.filter';

describe('MeetingDayFilter', () => {
  let qApi, rootScope;

  beforeEach(inject(function ($injector) {
    qApi = $injector.get('$q');
    rootScope = $injector.get('$rootScope');
  }));
  
  describe('the constructor', () => {
    it('should load days of the week', () => {
      let days = [
        {dp_RecordName: 'Sunday', dp_RecordID: 123},
        {dp_RecordName: 'Monday', dp_RecordID: 456},
      ];

      let deferred = qApi.defer();
      deferred.resolve(days);
      let groupService = jasmine.createSpyObj('groupServiceMock', ['getDaysOfTheWeek']);
      groupService.getDaysOfTheWeek.and.returnValue(deferred.promise);

      let filter = new MeetingDayFilter('Days', groupService);
      rootScope.$apply();
      expect(groupService.getDaysOfTheWeek).toHaveBeenCalled();
      expect(filter.getValues()).toBeDefined();
      expect(filter.getValues().length).toEqual(days.length + 1);
      for(let i = 0; i < days.length; i++) {
        expect(filter.getValues()[i].getName()).toEqual(days[i].dp_RecordName);
        expect(filter.getValues()[i].getValue()).toEqual(days[i].dp_RecordName);
        expect(filter.getValues()[i].isSelected()).toBeFalsy();
      }
      expect(filter.getValues()[days.length].getName()).toEqual('Flexible');
      expect(filter.getValues()[days.length].getValue()).toEqual('Flexible Meeting Time');
      expect(filter.getValues()[days.length].isSelected()).toBeFalsy();
    });
  });

  describe('matches() function', () => {
    let fixture;

    beforeEach(() => {
      let deferred = qApi.defer();
      deferred.resolve({attributes: []});

      let groupService = jasmine.createSpyObj('groupServiceMock', ['getDaysOfTheWeek']);
      groupService.getDaysOfTheWeek.and.returnValue(deferred.promise);
      fixture = new MeetingDayFilter('Days', groupService);
      rootScope.$apply();
    });

    it('should return true if no meeting day currently filtered', () => {
      let meetingDays = [
        new SearchFilterValue('Sunday', 'Sunday', false)
      ];
      let searchResult = {
        meetingDay: 'Saturday'
      };
      fixture.filterValues = meetingDays;

      expect(fixture.matches(searchResult)).toBeTruthy();
    });

    it('should return true if the search result contains a filtered meeting day', () => {
      let meetingDays = [
        new SearchFilterValue('Sunday', 'Sunday', false),
        new SearchFilterValue('Monday', 'Monday', true)
      ];
      let searchResult = {
        meetingDay: 'Monday'
      };
      fixture.filterValues = meetingDays;

      expect(fixture.matches(searchResult)).toBeTruthy();
    });

    it('should return false if the search result does not contain a filtered meeting day', () => {
      let meetingDays = [
        new SearchFilterValue('Sunday', 'Sunday', false),
        new SearchFilterValue('Monday', 'Monday', true)
      ];
      let searchResult = {
        meetingDay: 'Tuesday'
      };
      fixture.filterValues = meetingDays;

      expect(fixture.matches(searchResult)).toBeFalsy();
    });

    it('should return false if the search result does not contain an meeting day', () => {
      let meetingDays = [
        new SearchFilterValue('Sunday', 'Sunday', false),
        new SearchFilterValue('Monday', 'Monday', true)
      ];
      let searchResult = { };
      fixture.filterValues = meetingDays;

      expect(fixture.matches(searchResult)).toBeFalsy();
    });
  });
});
