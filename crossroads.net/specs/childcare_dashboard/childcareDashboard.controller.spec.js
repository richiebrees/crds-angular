import constants from 'crds-constants';
import ChildcareDashboardService from '../../app/childcare_dashboard/childcareDashboard.service';
import ChildcareDashboardController from '../../app/childcare_dashboard/childcareDashboard.controller';

describe('Childcare Dashboard Controller', () => {

  const uid = 1234567890;
  let rootScope,
      log,
      controller,
      resource,
      cookies,
      childcareDashboardService;

  beforeEach(angular.mock.module(constants.MODULES.CHILDCARE_DASHBOARD));

  beforeEach(inject(function(_$rootScope_, $injector) {
   rootScope = _$rootScope_;
   cookies = $injector.get('$cookies');
   resource = $injector.get('$resource');
   log = $injector.get('$log');

   childcareDashboardService = new ChildcareDashboardService(resource, cookies);
   spyOn(cookies, 'get').and.returnValue(uid);
  }));

  it('should show the "No Groups" message if the dashboard call is empty', () => {
    spyOn(childcareDashboardService, 'getChildcareDates').and.returnValue(
      {'childcareDates': [] }
    );
    controller = new ChildcareDashboardController(childcareDashboardService);
    expect(controller.isGroupsEmpty()).toBe(true);
  });

});

