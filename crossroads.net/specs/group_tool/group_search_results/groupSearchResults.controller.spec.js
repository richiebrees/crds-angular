
import constants from 'crds-constants';
import GroupSearchResultsController from '../../../app/group_tool/group_search_results/groupSearchResults.controller';
import Address from '../../../app/group_tool/model/address';

describe('GroupSearchResultsController', () => {
  let fixture,
    ngTableParams,
    groupService,
    state,
    qApi,
    modal,
    rootScope,
    addressValidationService,
    locationService;

  beforeEach(angular.mock.module(constants.MODULES.GROUP_TOOL));

  beforeEach(inject(function ($injector) {
    ngTableParams = $injector.get('NgTableParams');
    groupService = {
      search: function() {}
    };
    state = $injector.get('$state');
    state.params = {
      query: 'kw1 kw2 kw3',
      location: 'oakley'
    };
    qApi = $injector.get('$q');
    rootScope = $injector.get('$rootScope');
    rootScope.MESSAGES = {
      groupToolSearchInvalidAddressGrowler: '123'
    };    
    addressValidationService = jasmine.createSpyObj('addressValidationService', ['validateAddressString']);
    locationService = $injector.get('$location');
    modal = $injector.get('$modal');
    fixture = new GroupSearchResultsController(ngTableParams, groupService, state, modal, rootScope, addressValidationService, locationService);
  }));

  describe('the constructor', () => {
    it('should initialize properties', () => {
      expect(fixture.search).toBe(null);
      expect(fixture.processing).toBeFalsy();
      expect(fixture.ready).toBeFalsy();
      expect(fixture.results).toEqual([]);
      expect(fixture.showLocationInput).toBeFalsy();
      expect(fixture.searchedWithLocation).toBeFalsy();
      expect(fixture.tableParams instanceof ngTableParams).toBeTruthy();
      expect(fixture.tableParams.settings().dataset).toBe(null);
    });
  });

  describe('$onInit() function', () => {
    it('should set search model and call doSearch', () => {
      spyOn(fixture, 'doSearch').and.callFake(() => {});
      fixture.$onInit();
      expect(fixture.search.query).toEqual(state.params.query);
      expect(fixture.search.location).toEqual(state.params.location);
      expect(fixture.doSearch).toHaveBeenCalledWith(state.params.query, state.params.location);
    });
  });

  describe('submit() function', () => {
    it('should call doSearch with search model', () => {
      spyOn(fixture, 'doSearch').and.callFake(() => {});
      fixture.search = {
        query: '123',
        location: '456'
      };
      fixture.submit();
      expect(fixture.doSearch).toHaveBeenCalledWith('123', '456');
    });

    it('should validate address and call doSearch with search model', () => {
      let deferred = qApi.defer();
      let addressResponse = {addressLine1: 'line1', city: 'city', state: 'state', zip: 'zip'};
      let address = new Address(addressResponse);
      deferred.resolve(addressResponse);
      deferred.promise.then(() => {
        return address;
      });

      addressValidationService.validateAddressString.and.returnValue(deferred.promise);
      spyOn(fixture, 'doSearch').and.callFake(() => {});
      fixture.search = {
        query: '123',
        location: '456'
      };

      let form = {
        location: {
          $setValidity: function() {}
        }
      };
      spyOn(form.location, '$setValidity');

      spyOn(state, 'go').and.callFake(() => {});

      fixture.processing = true;

      fixture.submit(form);
      rootScope.$digest();

      expect(fixture.doSearch).toHaveBeenCalledWith('123', address.toSearchString());
      expect(addressValidationService.validateAddressString).toHaveBeenCalledWith('456');
      expect(form.location.$setValidity).toHaveBeenCalledWith('pattern', true);
      expect(fixture.processing).toBeFalsy();
    });

    it('should validate address and emit error with bad location', () => {
      let deferred = qApi.defer();
      let addressResponse = {status: 404, statusText: 'not found'};
      deferred.reject(addressResponse);


      addressValidationService.validateAddressString.and.returnValue(deferred.promise);
      spyOn(fixture, 'doSearch').and.callFake(() => {});
      fixture.search = {
        query: '123',
        location: '456'
      };

      let form = {
        location: {
          $setValidity: function() {}
        }
      };
      spyOn(form.location, '$setValidity');

      spyOn(state, 'go').and.callFake(() => {});

      spyOn(rootScope, '$emit').and.callFake(() => {});

      fixture.processing = true;

      fixture.submit(form);
      rootScope.$digest();

      expect(fixture.doSearch).not.toHaveBeenCalled();
      expect(addressValidationService.validateAddressString).toHaveBeenCalledWith('456');
      expect(form.location.$setValidity).toHaveBeenCalledWith('pattern', false);
      expect(rootScope.$emit).toHaveBeenCalledWith('notify', rootScope.MESSAGES.groupToolSearchInvalidAddressGrowler)
      expect(fixture.processing).toBeFalsy();
    });
  });

  describe('doSearch() function', () => {
    it('should replace the results on successful service call', () => {
      let originalResults = fixture.results;
      fixture.results.length = 0;
      fixture.results.push({groupName: 'name'});
      fixture.showLocationInput = true;
      fixture.ready = false;
      fixture.tableParams.parameters().count = 1;

      let groups = [{groupName: 'group1'},{groupName: 'group2'}];
      let deferred = qApi.defer();
      deferred.resolve(groups);
      spyOn(groupService, 'search').and.callFake(() => {
        return deferred.promise;
      });
      spyOn(locationService, 'search').and.callFake(() => {});
      fixture.doSearch('123', '456');
      rootScope.$apply();

      expect(groupService.search).toHaveBeenCalledWith('123', '456');
      expect(locationService.search).toHaveBeenCalledWith({query: '123', location: '456'});
      expect(fixture.showLocationInput).toBeFalsy();
      expect(fixture.searchedWithLocation).toBeTruthy();
      expect(fixture.ready).toBeTruthy();
      expect(fixture.results).not.toBe(originalResults);
      expect(fixture.results.length).toEqual(groups.length);
      expect(fixture.tableParams.settings().dataset).toBe(fixture.results);
      expect(fixture.tableParams.parameters().count).toEqual(groups.length);
      expect(fixture.tableParams.parameters().sorting.proximity).toEqual('asc');
    });

    it('should reset results if error calling service', () => {
      let originalResults = fixture.results;
      fixture.results.length = 0;
      fixture.results.push({meetingDay: 'name'});
      fixture.showLocationInput = true;
      fixture.ready = false;
      fixture.tableParams.parameters().count = 1;

      let deferred = qApi.defer();
      deferred.reject({});
      spyOn(groupService, 'search').and.callFake(() => {
        return deferred.promise;
      });
      spyOn(locationService, 'search').and.callFake(() => {});
      fixture.doSearch('123', '');
      rootScope.$apply();

      expect(groupService.search).toHaveBeenCalledWith('123', '');
      expect(locationService.search).toHaveBeenCalledWith({query: '123'});
      expect(fixture.showLocationInput).toBeFalsy();
      expect(fixture.searchedWithLocation).toBeFalsy();
      expect(fixture.ready).toBeTruthy();
      expect(fixture.results).not.toBe(originalResults);
      expect(fixture.results.length).toEqual(0);
      expect(fixture.tableParams.settings().dataset).toBe(fixture.results);
      expect(fixture.tableParams.parameters().count).toEqual(0);
      expect(fixture.tableParams.parameters().sorting.meetingDay).toEqual('asc');
    });
  });

  describe('showLocationForm function', () => {
    it('should reset the view value and set the show property to true', () => {
      let form = {
        location: {
          $rollbackViewValue: function() {}
        }
      };
      spyOn(form.location, '$rollbackViewValue');

      fixture.showLocationInput = false;

      fixture.showLocationForm(form);
      expect(form.location.$rollbackViewValue).toHaveBeenCalled();
      expect(fixture.showLocationInput).toBeTruthy();
    });
  });

  describe('hideLocationForm function', () => {
    it('should reset the view value and set the show property to false if value is valid', () => {
      let form = {
        location: {
          $rollbackViewValue: function() {},
          $invalid: false,
          $setValidity: function() {}
        }
      };
      spyOn(form.location, '$rollbackViewValue');
      spyOn(form.location, '$setValidity');

      fixture.showLocationInput = true;

      fixture.search = {
        location: 'value'
      };

      fixture.hideLocationForm(form);
      expect(form.location.$rollbackViewValue).toHaveBeenCalled();
      expect(form.location.$setValidity).not.toHaveBeenCalled();
      expect(fixture.showLocationInput).toBeFalsy();
      expect(fixture.search.location).toEqual('value');
    });

    it('should reset the view value, the location, and set the show property to false if value is invalid', () => {
      let form = {
        location: {
          $rollbackViewValue: function() {},
          $invalid: true,
          $setValidity: function() {}
        }
      };
      spyOn(form.location, '$rollbackViewValue');
      spyOn(form.location, '$setValidity');

      fixture.showLocationInput = true;

      fixture.search = {
        location: 'value'
      };

      fixture.hideLocationForm(form);
      expect(form.location.$rollbackViewValue).toHaveBeenCalled();
      expect(form.location.$setValidity).toHaveBeenCalledWith('pattern', true);
      expect(fixture.showLocationInput).toBeFalsy();
      expect(fixture.search.location).toEqual('');
    });
  });
});