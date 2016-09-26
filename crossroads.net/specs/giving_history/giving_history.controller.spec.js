require('../../app/app');

describe('GivingHistoryController', function() {

  var httpBackend;
  var scope;
  var controllerConstructor;
  var GivingHistoryService;
  var sut;

  beforeEach(angular.mock.module('crossroads'));

  beforeEach(angular.mock.module(function($provide) {
    $provide.value('$state', { get: function() {} });
  }));

  var mockDonationYearsResponse =
  {
    years: ['2015', '2014'],
    most_recent_giving_year: '2015'
  };

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
        date: '2015-05-28T10:25:32.923',
        distributions: [
          {
            program_name: 'Crossroads',
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

  var mockSoftCreditDonationResponse =
  {
    donations: [
      {
        amount: 2000,
        status: 'Succeeded',
        date: '2015-03-31T09:52:44.873',
        distributions: [
          {
            program_name: 'Crossroads',
            amount: 2000
          }
        ],
        source:
        {
          type: 'SoftCredit',
          name: 'Fidelity Charity Account'
        }
      },
      {
        amount: 2000,
        status: 'Succeeded',
        date: '2015-06-30T10:25:32.923',
        distributions: [
          {
            program_name: 'Crossroads',
            amount: 2000
          }
        ],
        source:
        {
          type: 'SoftCredit',
          name: 'Fidelity Charity Account'
        }
      }
    ],
    donation_total_amount: 4000
  };

  beforeEach(inject(function(_$injector_, $httpBackend, _$controller_, $rootScope, _GivingHistoryService_) {
    var $injector = _$injector_;

    httpBackend = $httpBackend;

    controllerConstructor = _$controller_;

    scope = $rootScope.$new();

    GivingHistoryService = _GivingHistoryService_;
  })
  );

  afterEach(function() {
    httpBackend.verifyNoOutstandingExpectation();
    httpBackend.verifyNoOutstandingRequest();
  });

  describe('On initialization with impersonation', function() {
    beforeEach(function() {
      GivingHistoryService.impersonateDonorId = 123;
      sut = controllerConstructor('GivingHistoryController', {$scope: scope});
    });

    it('should set impersonation error when user not allowed to impersonate', function() {
      var error = {
        message: 'whoa there big fella!'
      };
      httpBackend.expectGET(window.__env__['CRDS_API_ENDPOINT'] + 'api/profile?impersonateDonorId=123').respond(403, error);
      httpBackend.flush();

      expect(sut.impersonation_error).toBeTruthy();
      expect(sut.impersonation_not_allowed).toBeTruthy();
      expect(sut.impersonation_user_not_found).toBeFalsy();
      expect(sut.impersonation_error_message).toEqual('whoa there big fella!');
    });

    it('should set impersonation error when user to impersonate is not found', function() {
      var error = {
        message: 'whoa there big fella!'
      };
      httpBackend.expectGET(window.__env__['CRDS_API_ENDPOINT'] + 'api/profile?impersonateDonorId=123').respond(409, error);
      httpBackend.flush();

      expect(sut.impersonation_error).toBeTruthy();
      expect(sut.impersonation_not_allowed).toBeFalsy();
      expect(sut.impersonation_user_not_found).toBeTruthy();
      expect(sut.impersonation_error_message).toEqual('whoa there big fella!');
    });

  });

  describe('On initialization', function() {
    beforeEach(function() {
      sut = controllerConstructor('GivingHistoryController', {$scope: scope});
    });

    it('should retrieve most recent giving year donations for current user', function() {
      var profile = {foo: 'bar'};
      httpBackend.expectGET(window.__env__['CRDS_API_ENDPOINT'] + 'api/profile').respond(profile);
      httpBackend.expectGET(window.__env__['CRDS_API_ENDPOINT'] + 'api/donations/years')
                             .respond(mockDonationYearsResponse);
      httpBackend.expectGET(window.__env__['CRDS_API_ENDPOINT'] + 'api/donations/2015?softCredit=false')
                             .respond(mockDonationResponse);
      httpBackend.expectGET(window.__env__['CRDS_API_ENDPOINT'] + 'api/donations/2015?softCredit=true')
                             .respond(mockSoftCreditDonationResponse);
      httpBackend.flush();

      expect(sut.donation_years.length).toBe(3);
      expect(sut.donation_years[0]).toEqual({key: '2015', value: '2015'});
      expect(sut.donation_years[2]).toEqual({key: '', value: 'All'});
      expect(sut.selected_giving_year).toEqual({key: '2015', value: '2015'});
      expect(sut.profile.foo).toEqual('bar');
      expect(sut.beginning_donation_date).toEqual(mockDonationResponse.beginning_donation_date);
      expect(sut.ending_donation_date).toEqual(mockDonationResponse.ending_donation_date);
      expect(sut.donation_history).toBeTruthy();
      expect(sut.donation_view_ready).toBeTruthy();
      expect(sut.soft_credit_donation_history).toBeTruthy();
      expect(sut.soft_credit_donation_view_ready).toBeTruthy();
      expect(sut.overall_view_ready).toBeTruthy();

      expect(sut.donations.length).toBe(3);
      expect(sut.donations[0].distributions[0].program_name).toEqual('Crossroads');
      expect(sut.donation_total_amount).toEqual(80000);
    });

    it('should not have history if there is no profile', function() {
      httpBackend.expectGET(window.__env__['CRDS_API_ENDPOINT'] + 'api/profile').respond(404, {});
      httpBackend.flush();

      expect(Object.keys(sut.profile).length).toEqual(0);

      expect(sut.donation_years.length).toBe(0);
      expect(sut.selected_giving_year).not.toBeDefined();
      expect(sut.beginning_donation_date).not.toBeDefined();
      expect(sut.ending_donation_date).not.toBeDefined();
      expect(sut.donation_history).toBeFalsy();
      expect(sut.donation_view_ready).toBeTruthy();
      expect(sut.soft_credit_donation_history).toBeFalsy();
      expect(sut.soft_credit_donation_view_ready).toBeFalsy();
      expect(sut.overall_view_ready).toBeTruthy();

      expect(sut.donations.length).toBe(0);
    });

    it('should not have history if there are no giving years', function() {
      var profile = {foo: 'bar'};
      httpBackend.expectGET(window.__env__['CRDS_API_ENDPOINT'] + 'api/profile').respond(profile);
      httpBackend.expectGET(window.__env__['CRDS_API_ENDPOINT'] + 'api/donations/years').respond(404, {});
      httpBackend.flush();

      expect(sut.profile.foo).toEqual('bar');

      expect(sut.donation_years.length).toBe(0);
      expect(sut.selected_giving_year).not.toBeDefined();
      expect(sut.beginning_donation_date).not.toBeDefined();
      expect(sut.ending_donation_date).not.toBeDefined();
      expect(sut.donation_history).toBeFalsy();
      expect(sut.donation_view_ready).toBeTruthy();
      expect(sut.soft_credit_donation_history).toBeFalsy();
      expect(sut.soft_credit_donation_view_ready).toBeFalsy();
      expect(sut.overall_view_ready).toBeTruthy();

      expect(sut.donations.length).toBe(0);
    });

    it('should not have history if there are no donations', function() {
      var profile = {foo: 'bar'};
      httpBackend.expectGET(window.__env__['CRDS_API_ENDPOINT'] + 'api/profile').respond(profile);
      httpBackend
          .expectGET(window.__env__['CRDS_API_ENDPOINT'] + 'api/donations/years')
          .respond(mockDonationYearsResponse);
      httpBackend.expectGET(window.__env__['CRDS_API_ENDPOINT'] + 'api/donations/2015?softCredit=false').respond(404, {});
      httpBackend.expectGET(window.__env__['CRDS_API_ENDPOINT'] + 'api/donations/2015?softCredit=true').respond(404, {});
      httpBackend.flush();

      expect(sut.profile.foo).toEqual('bar');

      expect(sut.donation_years.length).toBe(3);
      expect(sut.donation_years[0]).toEqual({key: '2015', value: '2015'});
      expect(sut.donation_years[2]).toEqual({key: '', value: 'All'});
      expect(sut.selected_giving_year).toEqual({key: '2015', value: '2015'});
      expect(sut.beginning_donation_date).not.toBeDefined();
      expect(sut.ending_donation_date).not.toBeDefined();

      expect(sut.donation_history).toBeFalsy();
      expect(sut.donation_view_ready).toBeTruthy();
      expect(sut.soft_credit_donation_history).toBeFalsy();
      expect(sut.soft_credit_donation_view_ready).toBeTruthy();
      expect(sut.overall_view_ready).toBeTruthy();

      expect(sut.donations.length).toBe(0);
    });
  });
});
