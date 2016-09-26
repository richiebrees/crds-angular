import constants from 'crds-constants';
import ChildcareDecisionService from '../../../app/mp_tools/childcare_decision/childcareDecision.service';

describe('Childcare Decision Service', () => {
  let childcareDecisionService,
      log,
      httpBackend,
      rootScope,
      resource;

  const endpoint = window.__env__['CRDS_API_ENDPOINT'] + 'api';

  beforeEach(angular.mock.module(constants.MODULES.MPTOOLS));

  beforeEach(inject(function($injector) {
    log = $injector.get('$log');
    rootScope = $injector.get('$rootScope');
    resource = $injector.get('$resource');
    httpBackend = $injector.get('$httpBackend');
    childcareDecisionService = new ChildcareDecisionService(
      log,
      rootScope,
      resource
    );
  }));

  afterEach(()=> {
    httpBackend.verifyNoOutstandingExpectation();
    httpBackend.verifyNoOutstandingRequest();
  });

  it('should get a childcare request', () => {
    let requestId = 200;
    httpBackend.expectGET(`${endpoint}/childcare/getrequest/${requestId}`)
      .respond(200, []);
    childcareDecisionService.getChildcareRequest(requestId);
    httpBackend.flush();
  });

  it('should save a request', () => {
    let requestDTO = {};
    let requestId = 2345;
    httpBackend.expectPOST(`${endpoint}/childcare/request/approve/${requestId}`, requestDTO).respond(200, {});
    childcareDecisionService.saveRequest(requestId, requestDTO);
    httpBackend.flush();
  });
});
