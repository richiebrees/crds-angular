
import constants from 'crds-constants';
import GroupResourcesService from '../../../../app/group_tool/group_resources/service/groupResources.service';
import GroupResourceCategory from '../../../../app/group_tool/group_resources/model/groupResourceCategory';

describe('GroupResourcesService', () => {
  let fixture,
    log,
    resource,
    httpBackend;

  const endpoint = `${window.__env__['CRDS_CMS_ENDPOINT']}api`;

  beforeEach(angular.mock.module(constants.MODULES.GROUP_TOOL));

  beforeEach(inject(function ($injector) {
    log = $injector.get('$log');
    resource = $injector.get('$resource');
    httpBackend = $injector.get('$httpBackend');

    fixture = new GroupResourcesService(log, resource);
  }));

  afterEach(() => {
    httpBackend.verifyNoOutstandingExpectation();
    httpBackend.verifyNoOutstandingRequest();
  });  

  describe('getGroupResources() function', () => {
    it('should throw error if error retrieving resources', () => {
      let err = {
        status: 404,
        statusText: 'no groups'
      };
      httpBackend.expectGET(`${endpoint}/groupresourcecategory`).respond(404, err);

      let response = fixture.getGroupResources();
      httpBackend.flush();
      expect(response.$$state.status).toEqual(2);

      response.then(() => {
        expect('success should not have been called').toEqual('failing the test');
      }, (e) => {
        expect(e.data).toBeDefined();
        expect(e.data).toEqual(err);
      });
    });

    it('should get resources successfully', () => {
      let groupresourcecategories = [{
        title: 'title1',
        description: 'description1',
        footerContent: 'footercontent1',
        sortOrder: 1,
        default: true,
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
      },
      {
        title: 'title2',
        description: 'description2',
        footerContent: 'footercontent2',
        sortOrder: 2,
        default: false,
        groupResources: [
          {
            title: 'title4',
            tagline: 'tagline4',
            url: 'url4',
            author: 'author4',
            image: 'image4',
            type: 'type4',
            sortOrder: 4
          },
          {
            title: 'title3',
            tagline: 'tagline3',
            url: 'url3',
            author: 'author3',
            image: 'image3',
            type: 'type3',
            sortOrder: 3
          }
        ]
      }];

      let expectedResult = groupresourcecategories.map((resource) => {
        return new GroupResourceCategory(resource);
      });

      httpBackend.expectGET(`${endpoint}/groupresourcecategory`).respond(200, { groupresourcecategories: groupresourcecategories });

      let response = fixture.getGroupResources();
      httpBackend.flush();
      expect(response.$$state.status).toEqual(1);

      response.then((categories) => {
        expect(categories.length).toEqual(expectedResult.length);
        for(let i = 0; i < expectedResult.length; i++) {
          expect(categories[i]).toEqual(expectedResult[i]);
        }
      });
    });
  });
});
