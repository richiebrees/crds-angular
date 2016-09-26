require('../../../app/common/common.module');
require('../../../app/profile/profile.module');
require('../../../app/app');

describe('ProfileGivingController', function() {

  var httpBackend;
  var scope;
  var controllerConstructor;
  var sut;

  beforeEach(angular.mock.module('crossroads'));

  beforeEach(angular.mock.module(function($provide) {
    $provide.value('$state', { get: function() {} });
  }));

  var mockRecurringGiftsRespons = [
    {
      amount: 1000,
      recurrence: 'Fridays Weekly',
      program: 'Crossroads',
      source:
      {
        type: 'CreditCard',
        brand: 'Visa',
        last4: '1000',
        expectedViewBox: '0 0 160 100',
        expectedName: 'ending in 1000',
        expectedIcon: 'cc_visa'
      }
    },
    {
      amount: 2000,
      recurrence: '8th Monthly',
      program: 'Crossroads',
      source: {
        type: 'CreditCard',
        brand: 'MasterCard',
        last4: '2000',
        expectedViewBox: '0 0 160 100',
        expectedName: 'ending in 2000',
        expectedIcon: 'cc_mastercard'
      }
    },
    {
      amount: 3000,
      recurrence: '30th Monthly',
      program: 'Crossroads',
      source: {
        type: 'CreditCard',
        brand: 'AmericanExpress',
        last4: '3000',
        expectedViewBox: '0 0 160 100',
        expectedName: 'ending in 3000',
        expectedIcon: 'cc_american_express'
      }
    },
    {
      amount: 4000,
      recurrence: '21st Monthly',
      program: 'Crossroads',
      source: {
        type: 'CreditCard',
        brand: 'Discover',
        last4: '4000',
        expectedViewBox: '0 0 160 100',
        expectedName: 'ending in 4000',
        expectedIcon: 'cc_discover'
      }
    }
  ];

  var mockDonationResponse =
  {
    donations: [
      {
        amount: 78900,
        status: 'Succeeded',
        date: '2015-05-14T09:52:44.873',
        distributions: [
          {
            program_name: 'Crossroads',
            amount: 78900
          }
        ],
        source:
        {
          type: 'CreditCard',
          last4: '1234',
          brand: 'Visa',
          payment_processor_id: 'ch_16jvzDEldv5NE53smr7Mwi4x'
        }
      },
      {
        amount: 1200,
        status: 'Succeeded',
        date: '2015-05-21T10:25:32.923',
        distributions: [
          {
            program_name: 'Game Change',
            amount: 1200
          }
        ],
        source:
        {
          type: 'Bank',
          last4: '4321',
          payment_processor_id: 'py_16YS8wEldv5NE53s770upiHw'
        },
      },
      {
        amount: 100,
        status: 'Deposited',
        date: '2015-03-28T10:25:32.923',
        distributions: [
          {
            program_name: 'Beans & Rice',
            amount: 100
          }
        ],
        source:
        {
          type: 'Cash',
          name: 'Cash'
        }
      }
    ],
    donation_total_amount: 80000,
    beginning_donation_date: '123',
    ending_donation_date: '456'
  };

  var mockPledgeCommitmentsResponse = [
    {
      pledge_id: 330508,
      pledge_campaign_id: 852,
      donor_display_name: 'Pledge, Donor',
      pledge_campaign: 'Super Campaign',
      pledge_status: 'Active',
      campaign_start_date: '"10/1/2015',
      campaign_end_date: '"6/1/2019',
      total_pledge: 1500,
      pledge_donations: 155
    },
    {
      pledge_id: 330509,
      pledge_campaign_id: 528,
      donor_display_name: 'Commitment, Pledge',
      pledge_campaign: 'Long Campaign',
      pledge_status: 'Active',
      campaign_start_date: '10/1/2015',
      campaign_end_date: '6/1/2019',
      total_pledge: 150,
      pledge_donations: 65
    }
  ];

  beforeEach(inject(function(_$injector_, $httpBackend, _$controller_, $rootScope) {
      var $injector = _$injector_;

      httpBackend = $httpBackend;

      controllerConstructor = _$controller_;

      scope = $rootScope.$new();
    })
  );

  afterEach(function() {
    httpBackend.verifyNoOutstandingExpectation();
    httpBackend.verifyNoOutstandingRequest();
  });

  describe('On initialization', function() {
    beforeEach(function() {
      sut = controllerConstructor('ProfileGivingController', {$scope: scope});
    });

    it('should retrieve most recent giving year donations for current user and commitments', function() {
      httpBackend.expectGET(window.__env__['CRDS_API_ENDPOINT'] + 'api/donations?limit=3')
                             .respond(mockDonationResponse);
      httpBackend.expectGET(window.__env__['CRDS_API_ENDPOINT'] + 'api/donor/recurrence')
                             .respond(mockRecurringGiftsRespons);
      httpBackend.expectGET(window.__env__['CRDS_API_ENDPOINT'] + 'api/donor/pledge')
                            .respond(mockPledgeCommitmentsResponse);

      httpBackend.flush();

      expect(sut.donation_history).toBeTruthy();
      expect(sut.donation_view_ready).toBeTruthy();
      expect(sut.recurring_giving).toBeTruthy();
      expect(sut.recurring_giving_view_ready).toBeTruthy();

      expect(sut.donations.length).toBe(3);
      expect(sut.donations[0].distributions[0].program_name).toEqual('Crossroads');
      expect(sut.donations[1].distributions[0].program_name).toEqual('Game Change');
      expect(sut.donations[2].distributions[0].program_name).toEqual('Beans & Rice');

      expect(sut.recurring_gifts.length).toBe(4);
      expect(sut.recurring_gifts[0].recurrence).toEqual('Fridays Weekly');
      expect(sut.recurring_gifts[1].recurrence).toEqual('8th Monthly');
      expect(sut.recurring_gifts[2].recurrence).toEqual('30th Monthly');
      expect(sut.recurring_gifts[3].recurrence).toEqual('21st Monthly');
    });

    it('should not have history if there are no donations', function() {
      httpBackend.expectGET(window.__env__['CRDS_API_ENDPOINT'] + 'api/donations?limit=3').respond(404, {});
      httpBackend.expectGET(window.__env__['CRDS_API_ENDPOINT'] + 'api/donor/recurrence').respond(404, {});
      httpBackend.expectGET(window.__env__['CRDS_API_ENDPOINT'] + 'api/donor/pledge').respond(404, {});
      httpBackend.flush();

      expect(sut.donation_history).toBeFalsy();
      expect(sut.donation_view_ready).toBeTruthy();
      expect(sut.donations.length).toBe(0);

      expect(sut.recurring_giving).toBeFalsy();
      expect(sut.recurring_giving_view_ready).toBeTruthy();
      expect(sut.recurring_gifts.length).toBe(0);
    });
  });
});
