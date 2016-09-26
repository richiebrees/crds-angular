require('../../../app/common/common.module');
require('../../../app/trips/trips.module');

var tripHelpers = require('../trips.helpers');

(function() {
  'use strict';

  describe('Trip Signup Controller', function() {

    var mockSession;

    beforeEach(angular.mock.module('crossroads.trips'));

    beforeEach(angular.mock.module(function($provide) {
      $provide.value('$state', { go: function() {}, get: function() {} });

      mockSession = jasmine.createSpyObj('Session', ['exists', 'isActive', 'removeRedirectRoute', 'addRedirectRoute']);
      mockSession.exists.and.callFake(function(something) {
        return '12345678';
      });
      $provide.value('Session', mockSession);
      $provide.value('contactId', '12345678');
      $provide.value('Campaign', tripHelpers.Campaign);
      $provide.value('Person', tripHelpers.Person);
    }));

    var $controller;
    var $httpBackend;
    var $log;
    var $rootScope;
    var $scope;
    var $state;
    var AUTH_EVENTS;
    var Session;

    describe('Page 0', function() {

      beforeEach(angular.mock.module(function($provide) {
        $provide.value('pageId', 0);
      }));

      beforeEach(inject(function(_$controller_, _$log_, $injector) {
        $rootScope = $injector.get('$rootScope');
        $scope = $rootScope.$new();
        $controller = _$controller_('TripsSignupController', {$scope: $scope});
        $log = _$log_;
        Session = $injector.get('Session');
        $state = $injector.get('$state');
        $httpBackend = $injector.get('$httpBackend');
        TripParticipant = $injector.get('TripParticipant');
        DonationService = $injector.get('DonationService');
        GiveTransferService = $injector.get('GiveTransferService');
        AUTH_EVENTS = $injector.get('AUTH_EVENTS');
        GiveFlow = $injector.get('GiveFlow');
        TripGiving = $injector.get('TripGiving');

        $controller.initDefaultState();
      }));

    });
  });

})();
