
import constants from 'crds-constants';
import GroupResourcesController from '../../../app/group_tool/group_resources/groupResources.controller';
import GroupResourceCategory from '../../../app/group_tool/group_resources/model/groupResourceCategory';

describe('GroupResourcesController', () => {
  let fixture,
    groupResourcesService,
    rootScope,
    qApi;

  beforeEach(angular.mock.module(constants.MODULES.GROUP_TOOL));

  beforeEach(inject(function ($injector) {
    groupResourcesService = $injector.get('GroupResourcesService');
    rootScope = $injector.get('$rootScope');
    qApi = $injector.get('$q');

    fixture = new GroupResourcesController(groupResourcesService, rootScope);
  }));

  describe('the constructor', () => {
    it('should initialize properties', () => {
      expect(fixture.categories).toEqual([]);
      expect(fixture.ready).toBeDefined();
      expect(fixture.ready).toBeFalsy();
    });
  });

  describe('$onInit function', () => {
    it('should load all categories', () => {
      let categories = [
        new GroupResourceCategory({
          title: 'cat3',
          active: true,
          resources: [
            { title: 'res3' }
          ],
          sortOrder: 3
        }),
        new GroupResourceCategory({
          title: 'cat2'
        }),
        new GroupResourceCategory({
          title: 'cat1',
          resources: [
            { title: 'res1' }
          ],
          sortOrder: 1
        }),
      ];
      let deferred = qApi.defer();
      deferred.resolve(categories);

      let expectedCategories = categories.filter((cat) => {
        return cat.hasResources() === true;
      }).sort((a, b) => {
        return a.compareTo(b);
      });

      spyOn(groupResourcesService, 'getGroupResources').and.returnValue(deferred.promise);

      fixture.ready = false;
      fixture.categories = [];

      fixture.$onInit();

      rootScope.$apply();
      expect(fixture.ready).toBeTruthy();
      expect(fixture.categories).toEqual(expectedCategories);
      expect(groupResourcesService.getGroupResources).toHaveBeenCalled();
    });

    it('should blank out categories if error loading categories', () => {
      let deferred = qApi.defer();
      deferred.reject({});

      spyOn(groupResourcesService, 'getGroupResources').and.returnValue(deferred.promise);

      fixture.ready = false;
      fixture.categories = [{}, {}, {}];

      fixture.$onInit();

      rootScope.$apply();
      expect(fixture.ready).toBeTruthy();
      expect(fixture.categories).toEqual([]);
      expect(groupResourcesService.getGroupResources).toHaveBeenCalled();
    });
  });

  describe('hasData function', () => {
    it('should return true if there are categories', () => {
      fixture.categories = [{}, {}, {}];
      expect(fixture.hasData()).toBeTruthy();
    });

    it('should return false if there are no categories', () => {
      fixture.categories = [];
      expect(fixture.hasData()).toBeFalsy();
    });
  });

  describe('getCategories function', () => {
    it('should return the categories', () => {
      let categories = [ {}, {}, {} ];
      fixture.categories = categories;

      expect(fixture.getCategories()).toBe(categories);
    });
  });
  
});