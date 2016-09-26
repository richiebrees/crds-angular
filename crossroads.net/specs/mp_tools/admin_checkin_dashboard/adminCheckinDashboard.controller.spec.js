require('../../../app/common/common.module');
require('../../../app/app');

describe('AdminCheckinDashboard', function() {

  var httpBackend;
  var scope;
  var controllerConstructor;
  var AuthService;
  var CRDS_TOOLS_CONSTANTS;
  var AdminCheckinDashboardService;
  var EventService;
  var vm;

  var mockRoomResponse = [
    {
      name: 'KC101',
      label: 'Age 0-1 year olds',
      checkinAllowed: true,
      volunteers: 3,
      capacity: 21,
      participantsAssigned: 3,
    },
    {
      name: 'KC201',
      label: 'Age 2-3 year olds',
      checkinAllowed: false,
      volunteers: 1,
      capacity: 21,
      participantsAssigned: 10,
    },
    {
      name: 'KC301',
      label: 'Age 4-5 year olds',
      checkinAllowed: true,
      volunteers: 2,
      capacity: 21,
      participantsAssigned: 14,
    },
  ];

  var mockEventResponse = [
    {
      EventId: 1,
      EventTitle: 'Mason Saturday 6:30 pm'
    },
    {
      EventId: 2,
      EventTitle: 'Mason Sunday 9:00 am'
    },
    {
      EventId: 3,
      EventTitle: 'Mason Sunday 10:00 am'
    },
    {
      EventId: 4,
      EventTitle: 'Mason Sunday 11:00 am'
    },
  ];

  beforeEach(angular.mock.module('crossroads'));

  beforeEach(inject(function($injector, _$controller_) {
    var $rootScope = $injector.get('$rootScope');
    scope = $rootScope.$new();
    httpBackend = $injector.get('$httpBackend');
    AuthService = $injector.get('AuthService');
    CRDS_TOOLS_CONSTANTS = $injector.get('CRDS_TOOLS_CONSTANTS');
    AdminCheckinDashboardService = $injector.get('AdminCheckinDashboardService');
    EventService = $injector.get('EventService');

    vm = _$controller_('AdminCheckinDashboardController',
                           {$scope: scope,
                             AuthService: AuthService,
                             CRDS_TOOLS_CONSTANTS: CRDS_TOOLS_CONSTANTS,
                             AdminCheckinDashboardService: AdminCheckinDashboardService,
                             EventService: EventService});
  })
  );

  afterEach(function() {
    httpBackend.verifyNoOutstandingExpectation();
    httpBackend.verifyNoOutstandingRequest();
  });

  describe('loadRooms()', function() {
    beforeEach(function() {
      vm.event = {id: 1};
      vm.loadRooms();
      httpBackend.expectGET(window.__env__['CRDS_API_ENDPOINT'] + 'api/eventTool/1/rooms')
                             .respond({rooms: mockRoomResponse});
      httpBackend.flush();
    });

    it('should recieve the rooms for the event', function() {
      expect(vm.eventRooms.length).toBe(3);
      expect(vm.eventRooms[1].name).toEqual('KC201');
      expect(vm.eventRooms[1].label).toEqual('Age 2-3 year olds');
      expect(vm.eventRooms[1].checkinAllowed).toEqual(false);
      expect(vm.eventRooms[1].volunteers).toEqual(1);
      expect(vm.eventRooms[1].capacity).toEqual(21);
      expect(vm.eventRooms[1].participantsAssigned).toEqual(10);
      expect(vm.roomsLoading).toEqual(false);
    });
  });

  describe('loadEvents()', function() {
    it('should recieve the events for the site', function() {
      vm.site.id = 1;
      vm.startDate = new Date('2016-05-10T17:30:06.445Z');
      vm.endDate = new Date('2016-05-11T17:30:06.445Z');
      vm.loadEvents();
      httpBackend.expectGET(window.__env__['CRDS_API_ENDPOINT'] + 
                            `api/event/eventsbysite/1?endDate=2016-05-11T17:30:06.445Z&startDate=2016-05-10T17:30:06.445Z`)
        .respond(mockEventResponse);
      httpBackend.flush();

      expect(vm.events.length).toBe(4);
      expect(vm.events[1].EventId).toEqual(2);
      expect(vm.events[1].EventTitle).toEqual('Mason Sunday 9:00 am');
      expect(vm.eventsLoading).toEqual(false);
    });

    it('should not recieve the events for the site', function() {
      vm.site.id = undefined;
      vm.loadEvents();

      expect(vm.events.length).toBe(0);
      expect(vm.eventsReady).toEqual(false);
      expect(vm.eventsLoading).toEqual(false);
    });
  });

  describe('reset()', function() {
    beforeEach(function() {
      vm.reset();
    });

    it('should reset loading variables', function() {
      expect(vm.eventsReady).toBe(true);
      expect(vm.eventsLoading).toBe(true);
      expect(vm.roomsLoading).toBe(false);
      expect(vm.eventRooms.length).toBe(0);
    });
  });
});
