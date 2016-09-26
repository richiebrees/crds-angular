
import {SearchFilterValue} from '../../../../app/group_tool/group_search_filter/filter_impl/searchFilter';
import LeadersSiteFilter from '../../../../app/group_tool/group_search_filter/filter_impl/leadersSite.filter';
import SmallGroup from '../../../../app/group_tool/model/smallGroup';

describe('LeadersSiteFilter', () => {
  let qApi, rootScope;

  beforeEach(inject(function ($injector) {
    qApi = $injector.get('$q');
    rootScope = $injector.get('$rootScope');
  }));
  
  describe('the constructor', () => {
    it('should load sites', () => {
      let sites = [
        {dp_RecordName: 'Oakley', dp_RecordID: 123},
        {dp_RecordName: 'Mason', dp_RecordID: 456},
      ];

      let deferred = qApi.defer();
      deferred.resolve(sites);
      let groupService = jasmine.createSpyObj('groupServiceMock', ['getSites']);
      groupService.getSites.and.returnValue(deferred.promise);

      let filter = new LeadersSiteFilter('Site', groupService);
      rootScope.$apply();
      expect(groupService.getSites).toHaveBeenCalled();
      expect(filter.getValues()).toBeDefined();
      expect(filter.getValues().length).toEqual(sites.length);
      for(let i = 0; i < sites.length; i++) {
        expect(filter.getValues()[i].getName()).toEqual(sites[i].dp_RecordName);
        expect(filter.getValues()[i].getValue()).toEqual(sites[i].dp_RecordID);
        expect(filter.getValues()[i].isSelected()).toBeFalsy();
      }
    });
  });

  describe('matches() function', () => {
    let fixture;

    beforeEach(() => {
      let deferred = qApi.defer();
      deferred.resolve([]);

      let groupService = jasmine.createSpyObj('groupServiceMock', ['getSites']);
      groupService.getSites.and.returnValue(deferred.promise);
      fixture = new LeadersSiteFilter('Site', groupService);
      rootScope.$apply();
    });

    it('should return true if no leaders site range currently filtered', () => {
      let leadersSite = [
        new SearchFilterValue('Oakley', 123, false)
      ];
      let searchResult = {};
      fixture.filterValues = leadersSite;

      expect(fixture.matches(searchResult)).toBeTruthy();
    });

    it('should return true if the search result contains a filtered leaders site range', () => {
      let leadersSite = [
        new SearchFilterValue('Oakley', 123, false),
        new SearchFilterValue('Anywhere', 456, true)
      ];
      let searchResult = new SmallGroup({});

      spyOn(searchResult, 'leaders').and.callFake(() => {
        return [{ congregation: 'Oakley' }, { congregation: 'Anywhere' }];
      });
      fixture.filterValues = leadersSite;

      expect(fixture.matches(searchResult)).toBeTruthy();
    });

    it('should return false if the search result does not contain a filtered leaders site', () => {
      let leadersSite = [
        new SearchFilterValue('Oakley', 123, false),
        new SearchFilterValue('Anywhere', 456, true)
      ];
      let searchResult = new SmallGroup({});

      spyOn(searchResult, 'leaders').and.callFake(() => {
        return [{ congregation: 'Florence' }, { congregation: 'Uptown' }];
      });
      fixture.filterValues = leadersSite;

      expect(fixture.matches(searchResult)).toBeFalsy();
    });

    it('should return false if the search result does not contain an leaders site', () => {
      let leadersSite = [
        new SearchFilterValue('Oakley', 123, false),
        new SearchFilterValue('Anywhere', 456, true)
      ];
      let searchResult = new SmallGroup({});
      fixture.filterValues = leadersSite;

      expect(fixture.matches(searchResult)).toBeFalsy();
    });
  });
});
