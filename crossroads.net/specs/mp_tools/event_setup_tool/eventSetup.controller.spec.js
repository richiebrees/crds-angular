require('../../../app/common/common.module');
require('../../../app/app');

describe('EventSetupController', function() {

  var httpBackend;
  var scope;
  var $rootScope;
  var AuthService;
  var CRDS_TOOLS_CONSTANTS;
  var EventService;
  var vm;

  var mockEventTemplateResponse = [
    {
      EventId: 5,
      EventTitle: '(Template) Mason Saturday 6:30 pm'
    },
    {
      EventId: 6,
      EventTitle: '(Template) Mason Sunday 9:00 am'
    },
    {
      EventId: 7,
      EventTitle: '(Template) Mason Sunday 10:00 am'
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
    $rootScope = $injector.get('$rootScope');
    scope = $rootScope.$new();
    httpBackend = $injector.get('$httpBackend');
    AuthService = $injector.get('AuthService');
    CRDS_TOOLS_CONSTANTS = $injector.get('CRDS_TOOLS_CONSTANTS');
    EventService = $injector.get('EventService');

    vm = _$controller_('EventSetupController',
                           {$rootScope: $rootScope,
                             AuthService: AuthService,
                             EventService: EventService,
                             CRDS_TOOLS_CONSTANTS: CRDS_TOOLS_CONSTANTS});
  })
  );

  afterEach(function() {
    httpBackend.verifyNoOutstandingExpectation();
    httpBackend.verifyNoOutstandingRequest();
  });

  describe('loadEvents()', function() {
    beforeEach(function() {
      vm.site = {id: 1};
      vm.startDate = new Date('2016-05-10T17:30:06.445Z');
      vm.endDate = new Date('2016-05-11T17:30:06.445Z');
      vm.loadEvents();
      httpBackend.expectGET(window.__env__['CRDS_API_ENDPOINT'] + 'api/event/eventtemplatesbysite/1')
                             .respond(mockEventTemplateResponse);

      httpBackend.expectGET(window.__env__['CRDS_API_ENDPOINT'] + 'api/event/eventsbysite/1?endDate=2016-05-11T17:30:06.445Z&startDate=2016-05-10T17:30:06.445Z')
                             .respond(mockEventResponse);

      httpBackend.flush();
    });

    it('should recieve the events Templates for the site', function() {
      expect(vm.eventTemplates.length).toBe(3);
      expect(vm.eventTemplates[1].EventId).toEqual(6);
      expect(vm.eventTemplates[1].EventTitle).toEqual('(Template) Mason Sunday 9:00 am');
    });

    it('should recieve the events for the site', function() {
      expect(vm.events.length).toBe(4);
      expect(vm.events[1].EventId).toEqual(2);
      expect(vm.events[1].EventTitle).toEqual('Mason Sunday 9:00 am');
    });
  });

  describe('setup()', function() {
    beforeEach(function() {
      spyOn($rootScope, '$emit').and.callThrough();

      vm.template = {id: 2};
      vm.event = {id: 1};
      var postData = {eventtemplateid: vm.template.id, eventid: vm.event.id};
      vm.setup();
      httpBackend.expectPOST(window.__env__['CRDS_API_ENDPOINT'] + 'api/event/copyeventsetup', postData)
                             .respond({});

      httpBackend.flush();
    });

    it('should save', function() {
      expect(vm.saving).toEqual(false);
      expect($rootScope.$emit).toHaveBeenCalledWith('notify', undefined);
    });
  });

  describe('reset()', function() {
    beforeEach(function() {
      vm.reset();
    });

    it('should reset loading variables', function() {
      expect(vm.eventsReady).toBe(true);
      expect(vm.eventsLoading).toBe(true);
      expect(vm.eventTemplatesLoading).toBe(true);
      expect(vm.eventTemplates.length).toBe(0);
      expect(vm.events.length).toBe(0);
    });
  });
});
