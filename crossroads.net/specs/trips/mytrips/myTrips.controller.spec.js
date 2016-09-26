require('../../../app/trips/trips.module');

(function() {
  'use strict';
  describe('MyTripsController', function() {

    var myTrips = getMyTrips();

    beforeEach(angular.mock.module('crossroads.trips'));

    beforeEach(angular.mock.module(function($provide) {
      $provide.value('MyTrips', myTrips);
    }));

    var $controller;
    var $scope;
    var $log;
    var MyTrips;
    var $httpBackend;
    var TripsUrlService;

    beforeEach(inject(function(_$controller_, _$log_, $injector) {
      $scope = {};
      $controller = _$controller_('MyTripsController', { $scope: $scope });
      $log = _$log_;
      $httpBackend = $injector.get('$httpBackend');
      MyTrips = $injector.get('MyTrips');
      TripsUrlService = $injector.get('TripsUrlService');
    }));

    it('should set the shareUrl of all of the trips', function() {
      expect($controller.myTrips[0].shareUrl)
        .toBe('http://server/trips/giving/' + getMyTrips().myTrips[0].eventParticipantId);
    });

    function getMyTrips() {
      return { myTrips:[
        {
          eventParticipantId:2631206,
          tripStartDate:'Jul 25, 2015',
          tripEnd:'Dec 31, 2015',
          tripName:'(d) NKY Big Trip 2015',
          fundraisingDays:136,
          fundraisingGoal:1000,
          totalRaised:500,
          tripGifts:[
            {
              donorNickname:'TJ',
              donorLastName:'Maddox',
              donorEmail:'tmaddox33+mp1@gmail.com',
              donationAmount:500,
              donationDate:'8/13/2015',
              registeredDonor:true
            }]
        },
        {
          eventParticipantId:0,
          tripStartDate:'Jul 27, 2015',
          tripEnd:'Jul 30, 2015',
          tripName:'(d) Sweden Trip 2015',
          fundraisingDays:0,
          fundraisingGoal:2000,
          totalRaised:2000,
          tripGifts:[
            {
              donorNickname:'Anonymous',
              donorLastName:'',
              donorEmail:'andrew.canterbury@ingagepartners.com',
              donationAmount:1900,
              donationDate:'8/11/2015',
              registeredDonor:true
            },
            {
              donorNickname:'TJ',
              donorLastName:'Maddox',
              donorEmail:'tmaddox33+mp1@gmail.com',
              donationAmount:100,
              donationDate:'8/8/2015',
              registeredDonor:true
            }
          ]
        }
      ]};
    }

  });

  
})();
