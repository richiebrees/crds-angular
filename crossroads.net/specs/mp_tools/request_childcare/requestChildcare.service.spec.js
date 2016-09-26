import constants from 'crds-constants';
import RequestChildcareService from '../../../app/mp_tools/request_childcare/requestChildcare.service';

describe('Request Childcare Service', () => {
  let requestChildcareService, lookupService, log, httpBackend, rootScope, resource;

  const endpoint = window.__env__['CRDS_API_ENDPOINT'] + 'api';

  beforeEach(angular.mock.module(constants.MODULES.MPTOOLS));

  beforeEach(inject(function($injector) {
    lookupService = $injector.get('LookupService');
    log = $injector.get('$log');
    rootScope = $injector.get('$rootScope');
    resource = $injector.get('$resource');
    httpBackend = $injector.get('$httpBackend');
    requestChildcareService = new RequestChildcareService(log, lookupService, rootScope, resource);
  }));

  afterEach(() => {
    httpBackend.verifyNoOutstandingExpectation();
    httpBackend.verifyNoOutstandingRequest();
  });

  it('should get congregations for childcare', () => {
    httpBackend.expectGET(`${endpoint}/lookup/childcarelocations`).respond(200,[] );
    var request = requestChildcareService.getCongregations();
    httpBackend.flush();
  });

  it('should get ministries for childcare', () => {
    httpBackend.expectGET(`${endpoint}/lookup/ministries`).respond(200,[] );
    var request = requestChildcareService.getMinistries();
    httpBackend.flush();
  });

  it('should get preferred childcare times for congregation', () => {
    const congregation = 4321;
    httpBackend.expectGET(`${endpoint}/lookup/childcaretimes/${congregation}`).respond(200, []);
    var request = requestChildcareService.getPreferredTimes(congregation);
    httpBackend.flush();
  });

  it('should post to childcare/request', () => {
    const dto = { data: 1234, whatever: 'hi' };
    httpBackend.expectPOST(`${endpoint}/childcare/request`, dto).respond(200, {});
    var request = requestChildcareService.saveRequest(dto);
    httpBackend.flush();
  });

  it('should get the groups for a congregation and ministry', () => {
    const ministry = 1234;
    const congregation = 4321;
    httpBackend.expectGET(`${endpoint}/lookup/group/${congregation}/${ministry}`).respond(200, [] );
    var request = requestChildcareService.getGroups(congregation, ministry);
    httpBackend.flush();
  });

  it('should handle getCongregations error', () => {   
    httpBackend.expectGET(window.__env__['CRDS_API_ENDPOINT'] +
                          'api/lookup/childcarelocations').respond(500,[] );
    var request = requestChildcareService.getCongregations();
    httpBackend.flush();
  });

});
