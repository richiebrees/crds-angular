
import MeetingTimeFilter, {TimeRange} from '../../../../app/group_tool/group_search_filter/filter_impl/meetingTime.filter';

describe('MeetingTimeFilter', () => {
  let fixture;

  beforeEach(() => {
    fixture = new MeetingTimeFilter('Time');
  });

  describe('the constructor', () => {
    it('should initialize with proper time ranges', () => {
      expect(fixture.getValues().length).toEqual(3);
      let morning = fixture.getValues()[0].getValue();
      let afternoon = fixture.getValues()[1].getValue();
      let evening = fixture.getValues()[2].getValue();

      expect(morning.beginTime).toEqual(moment('00:00:00', 'HH:mm:ss'));
      expect(morning.endTime).toEqual(moment('11:59:59', 'HH:mm:ss'));
      expect(morning.toString()).toEqual('0000-1159');

      expect(afternoon.beginTime).toEqual(moment('12:00:00', 'HH:mm:ss'));
      expect(afternoon.endTime).toEqual(moment('17:00:00', 'HH:mm:ss'));
      expect(afternoon.toString()).toEqual('1200-1700');
      
      expect(evening.beginTime).toEqual(moment('17:00:01', 'HH:mm:ss'));
      expect(evening.endTime).toEqual(moment('23:59:59', 'HH:mm:ss'));
      expect(evening.toString()).toEqual('1700-2359');
    });
  });

  describe('the "Mornings" TimeRange', () => {
    let timeRange;
    beforeEach(() => {
      timeRange = fixture.getValues()[0].getValue();
    });

    it('should not match 23:59:59', () => {
      expect(timeRange.isWithinTimeRange('23:59:59')).toBeFalsy();
    });

    it('should match 00:00:00', () => {
      expect(timeRange.isWithinTimeRange('00:00:00')).toBeTruthy();
    });

    it('should match 10:00:00', () => {
      expect(timeRange.isWithinTimeRange('10:00:00')).toBeTruthy();
    });

    it('should match 11:59:59', () => {
      expect(timeRange.isWithinTimeRange('11:59:59')).toBeTruthy();
    });

    it('should not match 12:00:00', () => {
      expect(timeRange.isWithinTimeRange('12:00:00')).toBeFalsy();
    });
  });

  describe('the "Afternoons" TimeRange', () => {
    let timeRange;
    beforeEach(() => {
      timeRange = fixture.getValues()[1].getValue();
    });

    it('should not match 11:59:59', () => {
      expect(timeRange.isWithinTimeRange('11:59:59')).toBeFalsy();
    });

    it('should match 12:00:00', () => {
      expect(timeRange.isWithinTimeRange('12:00:00')).toBeTruthy();
    });

    it('should match 15:00:00', () => {
      expect(timeRange.isWithinTimeRange('15:00:00')).toBeTruthy();
    });

    it('should match 17:00:00', () => {
      expect(timeRange.isWithinTimeRange('17:00:00')).toBeTruthy();
    });

    it('should not match 17:00:01', () => {
      expect(timeRange.isWithinTimeRange('17:00:01')).toBeFalsy();
    });
  });

  describe('the "Evenings" TimeRange', () => {
    let timeRange;
    beforeEach(() => {
      timeRange = fixture.getValues()[2].getValue();
    });

    it('should not match 17:00:00', () => {
      expect(timeRange.isWithinTimeRange('17:00:00')).toBeFalsy();
    });

    it('should match 17:00:01', () => {
      expect(timeRange.isWithinTimeRange('17:00:01')).toBeTruthy();
    });

    it('should match 19:00:00', () => {
      expect(timeRange.isWithinTimeRange('19:00:00')).toBeTruthy();
    });

    it('should match 23:59:59', () => {
      expect(timeRange.isWithinTimeRange('23:59:59')).toBeTruthy();
    });

    it('should not match 00:00:00', () => {
      expect(timeRange.isWithinTimeRange('00:00:00')).toBeFalsy();
    });
  });

  describe('matches() function', () => {
    it('should return true if no meeting time currently filtered', () => {
      let searchResult = {
        meetingTime: '17:00:00'
      };

      expect(fixture.matches(searchResult)).toBeTruthy();
    });

    it('should return true if the search result contains a filtered meeting time', () => {
      let searchResult = {
        meetingTime: '10:00:00'
      };

      fixture.getValues()[0].selected = true;
      expect(fixture.matches(searchResult)).toBeTruthy();
    });

    it('should return false if the search result does not contain a filtered meeting time', () => {
      let searchResult = {
        meetingTime: '17:00:00'
      };

      fixture.getValues()[0].selected = true;
      expect(fixture.matches(searchResult)).toBeFalsy();
    });

    it('should return false if the search result does not contain a meeting time', () => {
      let searchResult = { };

      fixture.getValues()[0].selected = true;
      expect(fixture.matches(searchResult)).toBeFalsy();
    });
  });
});
