
import GroupType from '../../../app/group_tool/model/groupType';

describe('GroupType', () => {

  let groupType,
    mockJson;

  beforeEach(() => {
    mockJson = {
      'name': 'Men only',
      'description': 'Men\'s Group',
    };
  });

  describe('creation', () => {
    it('should have the following values when created with json', () => {
      groupType = new GroupType(mockJson);

      expect(groupType.name).toEqual(mockJson.name);
      expect(groupType.description).toEqual(mockJson.description);
    });

    it('should have the following values when created without json', () => {
      groupType = new GroupType();

      expect(groupType.name).toEqual('');
      expect(groupType.description).toEqual('');
    });
  });

});
