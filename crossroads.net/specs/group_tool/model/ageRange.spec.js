
import AgeRange from '../../../app/group_tool/model/ageRange';

describe('AgeRange', () => {

  let ageRange,
    mockJson;

  beforeEach(() => {
    mockJson = {
      'name': '40s',
      'description': '40-somethings',
    };
  });

  describe('creation', () => {
    it('should have the following values when created with json', () => {
      ageRange = new AgeRange(mockJson);

      expect(ageRange.name).toEqual(mockJson.name);
      expect(ageRange.description).toEqual(mockJson.description);
    });

    it('should have the following values when created without json', () => {
      ageRange = new AgeRange();

      expect(ageRange.name).toEqual('');
      expect(ageRange.description).toEqual('');
    });
  });

});
