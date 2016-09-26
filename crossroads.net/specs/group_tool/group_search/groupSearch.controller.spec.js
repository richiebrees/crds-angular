
import constants from 'crds-constants';
import GroupSearchController from '../../../app/group_tool/group_search/groupSearch.controller';
import Address from '../../../app/group_tool/model/address';

describe('GroupSearchController', () => {
  let fixture,
    addressValidationService,
    state,
    rootScope,
    qApi;

  beforeEach(angular.mock.module(constants.MODULES.GROUP_TOOL));

  beforeEach(inject(function ($injector) {
    addressValidationService = jasmine.createSpyObj('addressValidationService', ['validateAddressString']);
    state = $injector.get('$state');
    rootScope = $injector.get('$rootScope');
    rootScope.MESSAGES = {
      groupToolSearchInvalidAddressGrowler: '123'
    };
    qApi = $injector.get('$q');
    fixture = new GroupSearchController(addressValidationService, state, rootScope);
  }));

  describe('the constructor', () => {
    it('should initialize properties', () => {
      expect(fixture.search).toEqual({});
      expect(fixture.processing).toBeFalsy();
    });
  });

  describe('submit function', () => {
    it('should go directly to search results with no location', () => {
      fixture.search.query = 'query1';
      spyOn(state, 'go').and.callFake(() => {});

      fixture.submit();

      expect(state.go).toHaveBeenCalledWith('grouptool.search-results', {query: fixture.search.query, location: undefined});
      expect(addressValidationService.validateAddressString).not.toHaveBeenCalled();
    });

    it('should validate address and go to search results with location', () => {
      fixture.processing = true;

      let deferred = qApi.defer();
      let addressResponse = {addressLine1: 'line1', city: 'city', state: 'state', zip: 'zip'};
      let address = new Address(addressResponse);
      deferred.resolve(addressResponse);
      deferred.promise.then(() => {
        return address;
      });

      fixture.search.query = 'query1';
      fixture.search.location = 'location1';
      spyOn(state, 'go').and.callFake(() => {});
      addressValidationService.validateAddressString.and.returnValue(deferred.promise);

      let form = {
        location: {
          $setValidity: function() {}
        }
      };
      spyOn(form.location, '$setValidity');

      fixture.submit(form);
      rootScope.$digest();

      expect(addressValidationService.validateAddressString).toHaveBeenCalledWith('location1');
      expect(state.go).toHaveBeenCalledWith('grouptool.search-results', {query: 'query1', location: address.toSearchString()});
      expect(form.location.$setValidity).toHaveBeenCalledWith('pattern', true);
      expect(fixture.processing).toBeFalsy();
    });

    it('should validate address and emit error with bad location', () => {
      fixture.processing = true;

      let deferred = qApi.defer();
      let addressResponse = {status: 404, statusText: 'not found'};
      deferred.reject(addressResponse);

      fixture.search.query = 'query1';
      fixture.search.location = 'location1';
      spyOn(state, 'go').and.callFake(() => {});
      addressValidationService.validateAddressString.and.returnValue(deferred.promise);

      let form = {
        location: {
          $setValidity: function() {}
        }
      };
      spyOn(form.location, '$setValidity');

      spyOn(rootScope, '$emit').and.callFake(() => {});

      fixture.submit(form);
      rootScope.$digest();

      expect(addressValidationService.validateAddressString).toHaveBeenCalledWith('location1');
      expect(state.go).not.toHaveBeenCalled();
      expect(form.location.$setValidity).toHaveBeenCalledWith('pattern', false);
      expect(rootScope.$emit).toHaveBeenCalledWith('notify', rootScope.MESSAGES.groupToolSearchInvalidAddressGrowler)
      expect(fixture.processing).toBeFalsy();
    });
  });
});