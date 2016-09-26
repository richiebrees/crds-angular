import constants from 'crds-constants';
import ChildcareDecisionService from '../../../app/mp_tools/childcare_decision/childcareDecision.service';
import ChildcareDecisionController from '../../../app/mp_tools/childcare_decision/childcareDecision.controller';

describe('Chilcare Decision Controller', () => {
  let rootScope,
      MPTools,
      CRDS_TOOLS_CONSTANTS,
      log,
      controller,
      childcareDecisionService ,
      validation,
      cookies,
      _window;

  const dto = {
    EndDate: '2016-06-30T00:00:00',
    Frequency: 'Once',
    GroupId: 10000001,
    GroupName: '(t) Fathers Oakley CG',
    LocationId: 1,
    MinistryId: 8,
    Notes: 'Testing',
    PreferredTime: 'Wednesday, 1:30PM - 4:30PM',
    RequesterId: 3717387,
    StartDate: '2016-06-10T00:00:00',
    $promise: {
      then: function(fn) { fn(); }
    }
  };

  beforeEach(angular.mock.module(constants.MODULES.MPTOOLS));

  beforeEach(inject(function(_$rootScope_, $injector) {
    rootScope = _$rootScope_;
    MPTools = $injector.get('MPTools');
    CRDS_TOOLS_CONSTANTS = $injector.get('CRDS_TOOLS_CONSTANTS');
    log = $injector.get('$log');
    validation = $injector.get('Validation'); 
    cookies = $injector.get('$cookies');
    _window = $injector.get('$window');
    let resource = $injector.get('$resource');
    childcareDecisionService = new ChildcareDecisionService(log, rootScope, resource );

    // SPYS
    spyOn(childcareDecisionService, 'getChildcareRequest').and.returnValue(dto);

    spyOn(childcareDecisionService, 'saveRequest').and.returnValue({
      $promise: {
        then: function(fn) {
          fn();
        }
      }
    });
  }));

  it('should indicate if at least one date is selected', () => {
    let requestId = 200;
    allowAccess(requestId);
    commonExpectations();

    controller.datesList = [ 
      { selected: false, date: new Date(2016, 0, 1) },
      { selected: true, date: new Date(2017, 0, 1) }
    ];

    expect(controller.validDates()).toBe(true);
  });

  it('should return false if not dates are selected', () => {
    let requestId = 200;
    allowAccess(requestId);
    commonExpectations();

    controller.datesList = [ 
      { selected: false, date: new Date(2016, 0, 1) },
      { selected: false, date: new Date(2017, 0, 1) }
    ];
    expect(controller.validDates()).toBe(false);
  });

  it('should return false if there are no dates', () => {
    let requestId = 200;
    allowAccess(requestId);
    commonExpectations();

    expect(controller.validDates()).toBe(false);
  });

  it('should not submit a request unless at least one date is checked', () => {
    let requestId = 200;
    allowAccess(requestId);
    commonExpectations();
    expect(controller.submit()).toBe(false);
  });

 it('should submit a request if at least one date had been checked', () => {
    let requestId = 200;
    allowAccess(requestId);
    commonExpectations();

    controller.datesList = [
      { selected: false, date: moment(new Date(2016, 0, 1)) },
      { selected: true, date: moment(new Date(2017, 0, 1)) }
    ];
    controller.submit();
    expect(childcareDecisionService.saveRequest).toHaveBeenCalled();
 });

  it('should format the missing event content correctly', () => {
    let requestId = 200;
    allowAccess(requestId);
    commonExpectations();
    var dateList = [
      new Date(2016,0,1),
      new Date(2016,1,1),
      new Date(2016,2,1)
    ];
    expect(controller.missingEventContent(dateList))
    .toBe(
      '<p><strong>Missing Childcare Events</strong>' +
      '<ul> <li> 01/01/2016 </li> '+
      '<li> 02/01/2016 </li> ' +
      '<li> 03/01/2016 </li> </ul></p>'
    );
  });

  it('should make a request to get childcare request', () => {
    let requestId = 200;
    allowAccess(requestId);
    commonExpectations();
    expect(childcareDecisionService.getChildcareRequest).toHaveBeenCalled();
    expect(controller.viewReady).toBe(true);
  });

  it('should show an error message if a record has not been chosen', () => {
    allowAccess(-1);
    commonExpectations();
    expect(controller.error).toBe(true);
    expect(controller.showError()).toBe(true);
  });

  it('should not allow access if not authorized', () => {
    noAccess();
    commonExpectations();
    expect(controller.allowAccess).toBe(false);
  });

  function commonExpectations() {
    controller = new ChildcareDecisionController(rootScope,
                                                 MPTools,
                                                 CRDS_TOOLS_CONSTANTS,
                                                 log,
                                                 _window,
                                                 childcareDecisionService);

  }

  function noAccess() {
    spyOn(MPTools, 'allowAccess').and.returnValue(false);
  }

  function allowAccess(recordId = 100) {
    spyOn(MPTools, 'allowAccess').and.returnValue(true);
    spyOn(MPTools, 'getParams').and.returnValue({ recordId });

  }
});
