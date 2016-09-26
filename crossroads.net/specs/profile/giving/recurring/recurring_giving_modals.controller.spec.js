require('../../../../app/common/common.module');
require('../../../../app/app');

describe('RecurringGivingModals', function() {

  var vm;
  var rootScope;
  var scope;
  var modalInstance;
  var filter;
  var DonationService;
  var GiveTransferService;
  var RecurringGiving;
  var donation;
  var programList;
  var httpBackend;

  var mockProgramList = [
    {
      ProgramId: 1,
      Name: 'Crossroads'
    }
  ];

  var mockRecurringGift =
  {
    recurring_gift_id: 12,
    donor_id: 123,
    amount: 1000,
    recurrence: '8th Monthly',
    interval: 'month',
    program: 1,
    source:
    {
      type: 'CreditCard',
      brand: 'Visa',
      last4: '1000',
      icon: 'cc_visa',
      address_zip: '41983',
      exp_date: '2029-08-01T00:00:00',
      expectedViewBox: '0 0 160 100',
      expectedBrand: '#cc_visa',
      expectedCCNumberClass: 'cc_visa',
    },
  };

  beforeEach(angular.mock.module('crossroads'));

  beforeEach(angular.mock.module(function($provide) {
    $provide.value('$state', { get: function() {} });
  }));

  beforeEach(inject(function(_$controller_, $injector) {
    httpBackend = $injector.get('$httpBackend');
    rootScope = $injector.get('$rootScope');

    scope = rootScope.$new();
    filter = $injector.get('$filter');
    DonationService = $injector.get('DonationService');
    GiveTransferService = $injector.get('GiveTransferService');
    RecurringGiving = $injector.get('RecurringGiving');

    modalInstance = {                    // Create a mock object using spies
      close: jasmine.createSpy('modalInstance.close'),
      dismiss: jasmine.createSpy('modalInstance.dismiss'),
      result: {
        then: jasmine.createSpy('modalInstance.result.then')
      }
    };

    vm = _$controller_('RecurringGivingModals',
                           {$modalInstance: modalInstance,
                             $filter: filter,
                             DonationService: DonationService,
                             GiveTransferService: GiveTransferService,
                             donation: mockRecurringGift,
                             programList: mockProgramList});
  }));

  describe('On initialization', function() {
    it('should populate the dto with the correct information', function() {
      expect(vm.dto.amount).toBe(mockRecurringGift.amount);
      expect(vm.dto.amountSubmitted).toBeFalsy();
      expect(vm.dto.bankinfoSubmitted).toBeFalsy();
      expect(vm.dto.changeAccountInfo).toBeTruthy();
      expect(vm.dto.brand).toBe(mockRecurringGift.source.expectedBrand);
      expect(vm.dto.ccNumberClass).toBe(mockRecurringGift.source.expectedCCNumberClass);
      expect(vm.dto.donor.id).toBe(mockRecurringGift.donor_id);
      expect(vm.dto.last4).toBe(mockRecurringGift.source.last4);
      expect(vm.dto.givingType).toBe(mockRecurringGift.interval);
      expect(vm.dto.initialized).toBeTruthy();
      expect(vm.dto.program).toBe(mockProgramList[0]);
      expect(vm.dto.view).toBe('cc');
      expect(vm.dto.interval).toBe('Monthly');
      expect(vm.dto.donor.default_source.credit_card.last4).toBe(mockRecurringGift.source.last4);
      expect(vm.dto.donor.default_source.credit_card.brand).toBe(mockRecurringGift.source.brand);
      expect(vm.dto.donor.default_source.credit_card.address_zip).toBe(mockRecurringGift.source.address_zip);
      expect(vm.dto.donor.default_source.credit_card.exp_date).toBe('0829');
    });

  });

  describe('On cancel', function() {
    beforeEach(function() {
      vm.cancel();
    });

    it('should call the dismiss on $modalInstance', function() {
      expect(modalInstance.close).not.toHaveBeenCalled();
      expect(modalInstance.dismiss).toHaveBeenCalled();
    });
  });

  describe('On remove', function() {
    it('should call the close(true) on $modalInstance when remove is called', function() {
      httpBackend.expectDELETE(window.__env__['CRDS_API_ENDPOINT'] + 'api/donor/recurrence/12').respond(200);
      vm.remove();
      httpBackend.flush();

      expect(modalInstance.close).toHaveBeenCalled();
      expect(modalInstance.dismiss).not.toHaveBeenCalled();
    });

    it('should call the close(false) on $modalInstance when remove is called', function() {
      httpBackend.expectDELETE(window.__env__['CRDS_API_ENDPOINT'] + 'api/donor/recurrence/12').respond(404);
      vm.remove();
      httpBackend.flush();

      expect(modalInstance.dismiss).not.toHaveBeenCalled();
      expect(modalInstance.close).toHaveBeenCalled();
    });
  });

  var recurringGiveForm;
  describe('On edit', function() {
    beforeEach(function() {
      recurringGiveForm = {
        donationDetailsForm: {
          amount: {
            $valid: true,
          },
          recurringStartDate: {
            $dirty: false,
          },
          $dirty: undefined,
        },
      };
    });

    it('should call the close(true) on $modalInstance when edit is called', function() {
      httpBackend.expectPUT(window.__env__['CRDS_API_ENDPOINT'] + 'api/donor/recurrence/12').respond(200);
      vm.edit(recurringGiveForm);

      expect(modalInstance.close).toHaveBeenCalled();
      expect(modalInstance.dismiss).not.toHaveBeenCalled();
    });

    it('should call the close(false) on $modalInstance when edit is called', function() {
      httpBackend.expectPUT(window.__env__['CRDS_API_ENDPOINT'] + 'api/donor/recurrence/12').respond(404);
      vm.edit(recurringGiveForm);

      expect(modalInstance.dismiss).not.toHaveBeenCalled();
      expect(modalInstance.close).toHaveBeenCalled();
    });
  });

});
