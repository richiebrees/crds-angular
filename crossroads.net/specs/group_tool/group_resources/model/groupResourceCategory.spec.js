
import GroupResource from '../../../../app/group_tool/group_resources/model/groupResource';
import GroupResourceCategory from '../../../../app/group_tool/group_resources/model/groupResourceCategory';

describe('GroupResourceCategory model', () => {
  describe('the constructor', () => {
    it('should populate an empty GroupResourceCategory with no JSON', () => {
      let fixture = new GroupResourceCategory();
      expect(fixture.getTitle()).not.toBeDefined();
      expect(fixture.getDescription()).not.toBeDefined();
      expect(fixture.getFooterContent()).not.toBeDefined();
      expect(fixture.hasFooterContent()).toBeFalsy();
      expect(fixture.getSortOrder()).not.toBeDefined();
      expect(fixture.isActive()).toBeFalsy();
      expect(fixture.getResources()).toEqual([]);
      expect(fixture.hasResources()).toBeFalsy();
    });

    it('should populate GroupResourceCategory object with JSON', () => {
      let category = {
        title: 'title1',
        description: 'description1',
        footerContent: 'footercontent1',
        sortOrder: 1,
        default: '1',
        groupResources: [
          {
            title: 'title2',
            tagline: 'tagline2',
            url: 'url2',
            author: 'author2',
            image: 'image2',
            type: 'type2',
            sortOrder: 2
          },
          {
            title: 'title1',
            tagline: 'tagline1',
            url: 'url1',
            author: 'author1',
            image: 'image1',
            type: 'type1',
            sortOrder: 1
          }
        ]
      };

      let fixture = new GroupResourceCategory(category);
      expect(fixture.getTitle()).toEqual(category.title);
      expect(fixture.getDescription()).toEqual(category.description);
      expect(fixture.getFooterContent()).toEqual(category.footerContent);
      expect(fixture.hasFooterContent()).toBeTruthy();
      expect(fixture.getSortOrder()).toEqual(category.sortOrder);
      expect(fixture.isActive()).toBeTruthy();
      expect(fixture.getResources()).toEqual([ 
        new GroupResource(category.groupResources[1]),
        new GroupResource(category.groupResources[0]) 
      ]);
      expect(fixture.hasResources()).toBeTruthy();
    });
  });

  describe('compareTo function', () => {
    it('should return + if other is undefined', () => {
      let r1 = new GroupResourceCategory({sortOrder: 1});
      let r2;
      expect(r1.compareTo(r2)).toEqual(1);
    });

    it('should return + if other is null', () => {
      let r1 = new GroupResourceCategory({sortOrder: 1});
      let r2 = null;
      expect(r1.compareTo(r2)).toEqual(1);
    });

    it('should return 0 if sort orders are undefined', () => {
      let r1 = new GroupResourceCategory();
      let r2 = new GroupResourceCategory();
      expect(r1.compareTo(r2)).toEqual(0);
    });
    
    it('should return - if this sort order is undefined', () => {
      let r1 = new GroupResourceCategory();
      let r2 = new GroupResourceCategory({sortOrder: 1});
      expect(r1.compareTo(r2)).toEqual(-1);
    });
    
    it('should return + if other sort order is undefined', () => {
      let r1 = new GroupResourceCategory({sortOrder: 1});
      let r2 = new GroupResourceCategory();
      expect(r1.compareTo(r2)).toEqual(1);
    });

    it('should return appropriately for sort orders', () => {
      let r1 = new GroupResourceCategory({sortOrder: 1});
      let r2 = new GroupResourceCategory({sortOrder: 1});
      expect(r1.compareTo(r2)).toEqual(0);

      r2.sortOrder = 2;
      expect(r1.compareTo(r2)).toEqual(-1);

      r1.sortOrder = 3;
      expect(r1.compareTo(r2)).toEqual(1);
    });
  });
});