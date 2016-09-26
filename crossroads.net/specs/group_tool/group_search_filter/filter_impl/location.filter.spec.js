
import LocationFilter from '../../../../app/group_tool/group_search_filter/filter_impl/location.filter';
import SmallGroup from '../../../../app/group_tool/model/smallGroup';

describe('LocationFilter', () => {
  let fixture;

  beforeEach(() => {
    fixture = new LocationFilter('Location');
  });

  describe('matches() function', () => {
    let searchResult;
    beforeEach(() => {
      searchResult = new SmallGroup({ address: { addressLine1: 'line 1', city: 'city', state: 'state', zip: 'zip'}});
    });

    it('should return true if no location currently filtered', () => {
      expect(fixture.matches(searchResult)).toBeTruthy();
    });

    it('should return true if the search result contains a filtered location', () => {
      fixture.getValues().find((f) => {
        return f.getValue() === true;
      }).selected = true;
      expect(fixture.matches(searchResult)).toBeTruthy();
    });

    it('should return false if the search result does not contain a filtered location', () => {
      fixture.getValues().find((f) => {
        return f.getValue() === false;
      }).selected = true;
      expect(fixture.matches(searchResult)).toBeFalsy();
    });

    it('should return false if the search result does not contain an address', () => {
      delete searchResult.address;

      fixture.getValues().find((f) => {
        return f.getValue() === true;
      }).selected = true;
      expect(fixture.matches(searchResult)).toBeFalsy();
    });    
  });
});