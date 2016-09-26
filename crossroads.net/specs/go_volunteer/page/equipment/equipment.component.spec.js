require('../../../../app/common/common.module');
require('../../../../app/go_volunteer/goVolunteer.module');

describe('Go Volunteer Equipment Component', function() {

  var CONSTANTS = require('crds-constants');
  var MODULE = CONSTANTS.MODULES.GO_VOLUNTEER;

  var helpers = require('../../goVolunteer.helpers');

  var $compile;
  var $rootScope;
  var element;
  var scope;
  var $httpBackend;
  var GoVolunteerService;
  var isolated;

  beforeEach(function() {
    angular.mock.module(MODULE);
  });

  beforeEach(angular.mock.module(function($provide) {
    $provide.value('$state', { get: function() {} });
  }));

  beforeEach(inject(function(_$compile_, _$rootScope_, $injector) {
    $compile = _$compile_;
    $rootScope = _$rootScope_;
    $httpBackend = $injector.get('$httpBackend');

    GoVolunteerService = $injector.get('GoVolunteerService');
    GoVolunteerService.availableEquipment = angular.copy(helpers.equipment);
    GoVolunteerService.otherEquipment = [];
    scope = $rootScope.$new();

    scope.ctrl = {
      onSubmit: jasmine.createSpy('onSubmit').and.callThrough()
    };

    element = '<go-volunteer-equipment on-submit="ctrl.onSubmit(nextState)"></go-volunteer-equipment>';
    element = $compile(element)(scope);

  }));

  it('should have a list of equipment options', function() {
    scope.$digest();
    isolated = element.isolateScope().goEquipment;
    expect(isolated.equipment.length).toEqual(helpers.equipment.length);
  });

  it('should set my equipment and continue to additional info', function() {
    scope.$digest();
    isolated = element.isolateScope().goEquipment;
    isolated.equipment[1].checked = true;
    isolated.submit();
    expect(GoVolunteerService.equipment.length).toEqual(1);
    expect(scope.ctrl.onSubmit).toHaveBeenCalledWith('additional-info');
  });

  it('should set my other equipment and continue to additional info', function() {
    scope.$digest();
    isolated = element.isolateScope().goEquipment;
    isolated.otherEquipment.push({equipment: {name: 'test shovel'}});
    isolated.submit();
    expect(GoVolunteerService.otherEquipment.length).toEqual(1);
    expect(GoVolunteerService.otherEquipment[0].equipment.name).toEqual('test shovel');
    expect(scope.ctrl.onSubmit).toHaveBeenCalledWith('additional-info');
  });
});
