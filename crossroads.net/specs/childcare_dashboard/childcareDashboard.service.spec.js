import constants from 'crds-constants';
import ChildcareDashboardService from '../../app/childcare_dashboard/childcareDashboard.service';

/* jshint unused: false */
import childcareModule from '../../app/childcare_dashboard/childcareDashboard.module';

describe('Childcare Dashboard Service', () => {

  const endpoint = window.__env__['CRDS_API_ENDPOINT'] + 'api';
  const uid = 1234567890;

  let childcareService,
      resource,
      httpBackend,
      session;

  beforeEach(angular.mock.module(constants.MODULES.CHILDCARE_DASHBOARD));

  beforeEach(inject(function($injector) {
    resource = $injector.get('$resource');
    session = $injector.get('Session');
    httpBackend = $injector.get('$httpBackend');
    console.log(ChildcareDashboardService);
    childcareService = new ChildcareDashboardService(resource, session);

    spyOn(session, 'exists').and.returnValue(uid);
  }));

  afterEach(() => {
    httpBackend.verifyNoOutstandingExpectation();
    httpBackend.verifyNoOutstandingRequest();
  });

  it('should get a list of childcare dates', () => {
    expect(childcareService.childcareDates).toBeUndefined();
    httpBackend.expectGET(`${endpoint}/childcare/dashboard/${uid}`)
      .respond(200, {'childcareDates': []});
     childcareService.fetchChildcareDates();
     httpBackend.flush();
  });

  it('should rsvp a child', () => {
    const dto = {
      groupId: 54321,
      childId: 12345,
      registered: true,
      enrolledBy: 2344556
    };

    httpBackend
      .expectPOST(`${endpoint}/childcare/rsvp`, dto)
      .respond(200);
    childcareService.saveRSVP(dto.childId, dto.groupId, dto.enrolledBy, true);
    httpBackend.flush();
  });

  it('should remove an rsvp for a child', () => {
    const dto = {
      groupId: 54321,
      childId: 12345,
      registered: false,
      enrolledBy: 2344556
    };

    httpBackend
      .expectPOST(`${endpoint}/childcare/rsvp`, dto)
      .respond(200);
    childcareService.saveRSVP(dto.childId, dto.groupId, dto.enrolledBy, false);
    httpBackend.flush();
  });

});
