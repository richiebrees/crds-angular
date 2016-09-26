require('../../../app/common/common.module');
require('../../../app/trips/trips.module');

(function() {
  'use strict';

  var tripHelpers = require('../trips.helpers');
  var $compile;
  var $rootScope;
  var $httpBackend;
  var scope;
  var element;
  var isolateScope;
  var tripDonations;
  var emptyFunction = function() {};

  describe('Trip Donate Card Directive', function() {

    beforeEach(angular.mock.module('crossroads.trips'));

    beforeEach(angular.mock.module(function($provide) {
      $provide.value('$state', { get: function() {} });
    }));

    beforeEach(inject(function(_$compile_, _$rootScope_, _$httpBackend_) {
      $compile = _$compile_;
      $rootScope = _$rootScope_;
      $httpBackend = _$httpBackend_;
      scope = $rootScope.$new();
      element = '<trip-donations donation=\'donation\' trip-title=\'tripTitle\'></trip-donations>';
    }));

    describe('Anonymous Donor', function() {
      beforeEach(function() {
        scope.donation = tripHelpers.MyTrips[1].tripGifts[0];
        element = $compile(element)(scope);
        scope.$digest();
        tripDonations = element.isolateScope().tripDonations;
      });

      it('should not show reply button', function() {
        expect(tripDonations.showReplyButton()).toBe(false);
      });

    });

    describe('Transfer', function() {
      beforeEach(function() {
        scope.donation = tripHelpers.MyTrips[1].tripGifts[2];
        element = $compile(element)(scope);
        scope.$digest();
        tripDonations = element.isolateScope().tripDonations;
      });

      it('should not show reply button', function() {
        expect(tripDonations.showReplyButton()).toBe(false);
      });

    });

    describe('Scholorship', function() {
      beforeEach(function() {
        scope.donation = tripHelpers.MyTrips[1].tripGifts[1];
        element = $compile(element)(scope);
        scope.$digest();
        tripDonations = element.isolateScope().tripDonations;
      });

      it('should not show reply button', function() {
        expect(tripDonations.showReplyButton()).toBe(false);
      });

    });

    describe('Non Anonymous Donor', function() {
      beforeEach(function() {
        scope.donation = tripHelpers.MyTrips[0].tripGifts[0];
        element = $compile(element)(scope);
        scope.$digest();
        tripDonations = element.isolateScope().tripDonations;
      });

      it('should show the reply button', function() {
        expect(tripDonations.showReplyButton()).toBe(true);
      });
    });

    describe('General Functionality', function() {

      beforeEach(function() {
        scope.donation = tripHelpers.MyTrips[0].tripGifts[0];
        scope.tripTitle = tripHelpers.MyTrips[0].tripName;
        element = $compile(element)(scope);
        scope.$digest();
        tripDonations = element.isolateScope().tripDonations;
      });

      afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
      });

      it('should have the donation information passed in', function() {
        expect(tripDonations.donation).toEqual(tripHelpers.MyTrips[0].tripGifts[0]);
        expect(tripDonations.tripTitle).toEqual(tripHelpers.MyTrips[0].tripName);
      });

      it('should toggle the message', function() {
        expect(tripDonations.isMessageToggled).toBe(false);
        tripDonations.toggleMessage();
        expect(tripDonations.isMessageToggled).toBe(true);
      });

      it('should display the full name for a registered donor', function() {
        expect(tripDonations.getDisplayName()).toEqual('TJ Maddox');
      });

      it('should send the message', function() {
        var message = 'test message';
        tripDonations.sendMessage(message, emptyFunction, emptyFunction);
        var postData = {
          donorId: tripHelpers.MyTrips[0].tripGifts[0].donorId,
          message: message,
          tripName: tripHelpers.MyTrips[0].tripName,
          donationDistributionId: tripHelpers.MyTrips[0].tripGifts[0].donationDistributionId
        };
        $httpBackend.expectPOST(__API_ENDPOINT__ + 'api/donation/message', postData).respond(200);
        $httpBackend.flush();
      });

      it('should display call notify when the message was sent successfully', function() {
        spyOn($rootScope, '$emit').and.callThrough();
        var message = 'test message';
        tripDonations.sendMessage(message, emptyFunction, emptyFunction);
        var postData = {
          donorId: tripHelpers.MyTrips[0].tripGifts[0].donorId,
          message: message,
          tripName: tripHelpers.MyTrips[0].tripName,
          donationDistributionId: tripHelpers.MyTrips[0].tripGifts[0].donationDistributionId
        };
        $httpBackend.expectPOST(__API_ENDPOINT__ + 'api/donation/message', postData).respond(200);
        $httpBackend.flush();
        expect($rootScope.$emit).toHaveBeenCalledWith('notify', $rootScope.MESSAGES.emailSent);
      });

      it('should display call notify when there was an error', function() {
        spyOn($rootScope, '$emit').and.callThrough();
        var message = 'test message';
        tripDonations.sendMessage(message, emptyFunction, emptyFunction);
        var postData = {
          donorId: tripHelpers.MyTrips[0].tripGifts[0].donorId,
          message: message,
          tripName: tripHelpers.MyTrips[0].tripName,
          donationDistributionId: tripHelpers.MyTrips[0].tripGifts[0].donationDistributionId
        };
        $httpBackend.expectPOST(__API_ENDPOINT__ + 'api/donation/message', postData).respond(500);
        $httpBackend.flush();
        expect($rootScope.$emit).toHaveBeenCalledWith('notify', $rootScope.MESSAGES.emailSendingError);
      });

    });

  });
})();
