import constants from 'crds-constants';
import ChildcareDashboardService from '../../../app/childcare_dashboard/childcareDashboard.service';

import ChildcareDashboardGroupController from 
  '../../../app/childcare_dashboard/childcare_group/childcareDashboardGroup.controller';

/* jshint unused: false */
import childcareModule from '../../../app/childcare_dashboard/childcareDashboard.module';

describe('Childcare Group Component Controller', () => {

  let rootScope,
      log,
      childcareDashboardService,
      resource,
      cookies,
      controller,
      modal,
      scope
      ;

  beforeEach(angular.mock.module(constants.MODULES.CHILDCARE_DASHBOARD));

  beforeEach(inject(function(_$rootScope_, $injector) {
    rootScope = _$rootScope_;
    rootScope.MESSAGES = {
      childcareEventClosed: { content: 'test' },
      noEligibleChildren: { content: 'test2' },
      childcareEventCancelled: { content: 'test3'},
      childcareRsvpError: { content: 'test4'},
      childcareRsvpFull: 'childRsvpFull'
    };

    scope = rootScope.$new();
    log = $injector.get('$log');
    cookies = $injector.get('$cookies');
    modal = $injector.get('$modal');
    resource = $injector.get('$resource');

    childcareDashboardService = new ChildcareDashboardService(resource,cookies);
    childcareDashboardService.congregations = [
      { dp_RecordID: 1, dp_RecordName: 'Whateves' }
    ];

    controller = new ChildcareDashboardGroupController(rootScope, scope, modal, childcareDashboardService);
    controller.communityGroup = {eligibleChildren: [] };
    controller.$onInit();
    spyOn(rootScope, '$emit').and.callThrough();

  }));

  it('should not have eligibile children', () => {
    expect(controller.hasEligibleChildren()).toBe(false);
  });

  it('should display message if message is set', () => {
    controller.message = 'some message';
    controller.communityGroup = fakeCG();
    expect(controller.showMessage()).toBe(true);
  });

  it('event should be closed if it is happening within 7 days of today', () => {
    const today = new Date();
    var nextDate = new Date();
    nextDate.setDate(nextDate.getDate() + 6);
    controller.eventDate = nextDate.toISOString();
    controller.communityGroup = fakeCG();

    expect(controller.isEventClosed()).toBe(true);
    expect(controller.showMessage()).toBe(true);
  });

  it('event should not be closed if the happeing more than 7 days from today', () => {
    const today = new Date();
    var nextDate = new Date();
    nextDate.setDate(nextDate.getDate() + 9);
    controller.eventDate = nextDate.toISOString();
    controller.communityGroup = fakeCG();
    expect(controller.isEventClosed()).toBe(false);
  });

  it('should indicate that the event has been cancelled', () => {
    controller.cancelled = true;
    expect(controller.isEventCancelled()).toBe(true);
    expect(controller.message).toBe(rootScope.MESSAGES.childcareEventCancelled.content);
  });

  it('should get the congregation from the list', () => {
    expect(controller.getCongregation(1)).toBe('Whateves');
  });

  it('should return unknown congregation from the list if the id does not exist', () => {
    expect(controller.getCongregation(2)).toBe('Unknown');
  });

  it('should save the rsvp when toggle is set to on', () => {
    const cg = fakeCG(true);
    controller.communityGroup = fakeCG(true);
    spyOn(childcareDashboardService, 'saveRSVP').and.returnValue({
      $promise: {
        then: (success, error) => {
          success({});
        }
      },
      $resolved: true
    });
    var result = controller.rsvp(cg.eligibleChildren[0], true);
    expect(childcareDashboardService.saveRSVP).toHaveBeenCalledWith(100030266, 1234, 987654321, true);
  });

  it('should cancel the rsvp when toggle is set to off', () => {
    const cg = fakeCG(false);
    controller.communityGroup = fakeCG(true);
    spyOn(childcareDashboardService, 'saveRSVP').and.returnValue({
      $promise: {
        then: (success, error) => {
          success({});
        }
      },
      $resolved: true
    });

    var result = controller.rsvp(cg.eligibleChildren[0]);
    expect(childcareDashboardService.saveRSVP).toHaveBeenCalledWith(100030266, 1234, 987654321, false);
  });

  it('should display an error message when there is an error', () => {
    controller.communityGroup = fakeCG(true);
    spyOn(childcareDashboardService, 'saveRSVP').and.returnValue({
      $promise: {
        then: (success, error) => {
          error({statusCode: 400});
        }
      },
      $resolved: true
    });

    // imitate the behaviour of ngModel...
    controller.communityGroup.eligibleChildren[0].rsvpness = false;
    var result = controller.rsvp(controller.communityGroup.eligibleChildren[0], false);


    expect(childcareDashboardService.saveRSVP).toHaveBeenCalledWith(100030266, 1234, 987654321, false);
    expect(controller.communityGroup.eligibleChildren[0].rsvpness).toBe(true);
    expect(rootScope.$emit).toHaveBeenCalledWith('notify', rootScope.MESSAGES.childcareRsvpError);
  });

  it('should display an error when the capacity is reached', () => {
    controller.communityGroup = fakeCG(true);
    spyOn(childcareDashboardService, 'saveRSVP').and.returnValue({
      $promise: {
        then: (success, error) => {
          error({status: 412});
        }
      },
      $resolved: true
    });

    controller.communityGroup.eligibleChildren[0].rsvpness = false;
    var result = controller.rsvp(controller.communityGroup.eligibleChildren[0], false);

    expect(childcareDashboardService.saveRSVP).toHaveBeenCalledWith(100030266, 1234, 987654321, false);
    expect(controller.communityGroup.eligibleChildren[0].rsvpness).toBe(true);
    expect(rootScope.$emit).toHaveBeenCalledWith('notify', rootScope.MESSAGES.childcareRsvpFull);

  });

  function fakeCG(signedUp = true) {
    return {
     congregationId: 1,
     childcareGroupId: 1234,
     eligibleChildren:
       [
        {
          contactId: 100030266, 
          childName: 'Miles Silbernagel', 
          eligible: true,
          rsvpness: signedUp
        }
     ],
     eventEndTime: '2016-07-12T19:00:00',
     eventStartTime: '2016-07-12T18:00:00',
     groupMemberNamel:'Matthew Silbernagel',
     groupName: '(t) Fathers Oakley CG',
     maxAge: 0,
     remainingCapacity: 0,
     groupParticipantId: 987654321
    };
  }

});

