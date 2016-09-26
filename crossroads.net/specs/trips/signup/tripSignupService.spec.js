require('../../../app/common/common.module');
require('../../../app/trips/trips.module');

var tripHelpers = require('../trips.helpers');

describe('TripSignupService', () => {

  const endpoint = window.__env__['CRDS_API_ENDPOINT'] + 'api';

  let rootScope,
      resource,
      location,
      log,
      stateParams,
      httpBackend,
      signupService;

  let AppSave = jasmine.createSpyObj('AppSave', ['success', 'error']);

  beforeEach(angular.mock.module('crossroads.trips'));

  beforeEach(inject( ($injector) => {
    rootScope = $injector.get('$rootScope');
    resource = $injector.get('$resource');
    location = $injector.get('$location');
    log = $injector.get('$log');
    stateParams = $injector.get('$stateParams');
    httpBackend = $injector.get('$httpBackend');
    signupService = $injector.get('TripsSignupService');
    AppSave = {
      success: (data) => {
        console.log(data);
      },
      error: () => {

      }
    };
    spyOn(AppSave, 'success');
    spyOn(AppSave, 'error');
  }));

  it('should activate a new application', () => {
    expect(signupService.page2).toBeUndefined();
    expect(signupService.page3).toBeUndefined();
    expect(signupService.page4).toBeUndefined();
    expect(signupService.page5).toBeUndefined();
    expect(signupService.page6).toBeUndefined();

    signupService.activate();

    expect(signupService.page2).toBeDefined();
    expect(signupService.page3).toBeDefined();
    expect(signupService.page4).toBeDefined();
    expect(signupService.page5).toBeDefined();
    expect(signupService.page6).toBeDefined();
  });

  it('should reset the application', () => {
    signupService.activate();
    signupService.page2 = tripHelpers.Application.page2;
    signupService.page3 = tripHelpers.Application.page3;
    signupService.page4 = tripHelpers.Application.page4;
    signupService.page5 = tripHelpers.Application.page5;
    signupService.page6 = tripHelpers.Application.page6;

    expect(signupService.page2.guardianFirstName)
      .toBe(tripHelpers.Application.page2.guardianFirstName);

    let campaign = {
      campaignId: tripHelpers.Trip.campaignId,
      campaignName: tripHelpers.Trip.campaignName,
      pledgeDonorId: tripHelpers.Trip.pledgeDonorId
    };

    signupService.reset(campaign);

    expect(signupService.page2.guardianFirstName).toBe(null);
    expect(signupService.campaign).toEqual(campaign);
    expect(signupService.ageLimitReached).toBeFalsy();
    expect(signupService.contactId).toBe('');
    expect(signupService.pageHasErrors).toBe(true);
  });

  it('should save the application', () => {
    let campaign = {
      id: tripHelpers.Trip.campaignId,
      name: tripHelpers.Trip.campaignName,
      pledgeDonorId: tripHelpers.Trip.pledgeDonorId
    };

    signupService.reset(campaign);
    signupService.page2 = tripHelpers.Application.page2;
    signupService.page3 = tripHelpers.Application.page3;
    signupService.page4 = tripHelpers.Application.page4;
    signupService.page5 = tripHelpers.Application.page5;
    signupService.page6 = tripHelpers.Application.page6;
    signupService.person = tripHelpers.Person;
    signupService.depositInfo = tripHelpers.Application.depositInformation;

    let mockObj = {
      contactId: tripHelpers.Person.contactId,
      pledgeCampaignId: tripHelpers.Trip.campaignId,
      pageTwo: signupService.page2,
      pageThree: signupService.page3,
      pageFour: signupService.page4,
      pageFive: signupService.page5,
      pageSix: signupService.page6,
      inviteGUID: undefined,
      depositInformation: signupService.depositInfo
    };

    httpBackend.expectPOST(`${endpoint}/trip-application`,
                           mockObj).respond(200, { donorId: 1234 });

    signupService.saveApplication( AppSave.success, AppSave.error );
    httpBackend.flush();
    expect(AppSave.success).toHaveBeenCalled();
    expect(AppSave.error).not.toHaveBeenCalled();
  });

  it('should not save the application', () => {
    let campaign = {
      id: tripHelpers.Trip.campaignId,
      name: tripHelpers.Trip.campaignName,
      pledgeDonorId: tripHelpers.Trip.pledgeDonorId
    };

    signupService.reset(campaign);
    signupService.page2 = tripHelpers.Application.page2;
    signupService.page3 = tripHelpers.Application.page3;
    signupService.page4 = tripHelpers.Application.page4;
    signupService.page5 = tripHelpers.Application.page5;
    signupService.page6 = tripHelpers.Application.page6;
    signupService.person = tripHelpers.Person;
    signupService.depositInfo = tripHelpers.Application.depositInformation;

    let mockObj = {
      contactId: tripHelpers.Person.contactId,
      pledgeCampaignId: tripHelpers.Trip.campaignId,
      pageTwo: signupService.page2,
      pageThree: signupService.page3,
      pageFour: signupService.page4,
      pageFive: signupService.page5,
      pageSix: signupService.page6,
      inviteGUID: undefined,
      depositInformation: signupService.depositInfo
    };

    httpBackend.expectPOST(`${endpoint}/trip-application`,
                           mockObj).respond(500);

    signupService.saveApplication( AppSave.success, AppSave.error );
    httpBackend.flush();
    expect(AppSave.success).not.toHaveBeenCalled();
    expect(AppSave.error).toHaveBeenCalled();
  });

});
