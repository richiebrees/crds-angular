
import Category from '../../../app/group_tool/model/category';


describe('Group Tool Category', () => {

  let category,
    mockJson;

  beforeEach(() => {
    mockJson = {
      'attributeId': 1,
      'name': 'Boxing',
      'description': null,
      'selected': false,
      'startDate': '0001-01-01T00:00:00',
      'endDate': null,
      'notes': null,
      'sortOrder': 0,
      'category': 'Interest',
      'categoryDescription': null
    };
    
    category = new Category(mockJson);
  });

  describe('creation', () => {
    it('should have the following values', () => {
      expect(category.attributeId).toEqual(1);
      expect(category.name).toEqual('Boxing');
      expect(category.category).toEqual('Interest');
    });
  });

  describe('toString()', () => {
    it('should be Interest / Boxing', () => {
      expect(category.toString()).toEqual('Interest / Boxing');
    });
  });

});