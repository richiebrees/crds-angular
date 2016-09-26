
import KidsWelcomeFilter from '../../../../app/group_tool/group_search_filter/filter_impl/kidsWelcome.filter';

describe('KidsWelcomeFilter', () => {
  let fixture;
  beforeEach(() => {
    fixture = new KidsWelcomeFilter('Kids Welcome');
  });

  describe('matches() function', () => {
    it('should return true if no kids welcome currently filtered', () => {
      let searchResult = {
        kidsWelcome: false
      };

      expect(fixture.matches(searchResult)).toBeTruthy();
    });

    it('should return true if the search result contains a filtered kids welcome', () => {
      let searchResult = {
        kidsWelcome: true
      };

      fixture.getValues().find((f) => {
        return f.getValue() === true;
      }).selected = true;
      expect(fixture.matches(searchResult)).toBeTruthy();
    });

    it('should return false if the search result does not contain a filtered kids welcome', () => {
      let searchResult = {
        kidsWelcome: true
      };

      fixture.getValues().find((f) => {
        return f.getValue() === false;
      }).selected = true;
      expect(fixture.matches(searchResult)).toBeFalsy();
    });

    it('should return false if the search result does not contain a kids welcome', () => {
      let searchResult = { };

      fixture.getValues().find((f) => {
        return f.getValue() === true;
      }).selected = true;
      expect(fixture.matches(searchResult)).toBeFalsy();
    });    
  });
});