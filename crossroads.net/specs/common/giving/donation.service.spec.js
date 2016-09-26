require('../../../app/common/common.module');
require('../../../app/app');

describe('Common Giving Donation Service', function() {
  var fixture;

  var Session;
  var PaymentService;
  var GiveTransferService;
  var GiveFlow;
  var $state;

  beforeEach(function() {
    angular.mock.module('crossroads', function($provide) {
      Session = {isActive: function() {return (true);}};

      $provide.value('Session', Session);
    });
  });

  beforeEach(function() {
    angular.mock.module('crossroads.common', function($provide) {
      GiveFlow = {account: 'give.account', confirm: 'give.confirm', thankYou: 'give.thankYou'};
      $provide.value('GiveFlow', GiveFlow);

      PaymentService = jasmine.createSpyObj('Mock Payment Service',
        ['getDonor', 'createRecurringGiftWithCard', 'createRecurringGiftWithBankAcct']);
      $provide.value('PaymentService', PaymentService);

      $provide.constant('CC_BRAND_CODES', {Visa: '#cc_visa'});
    });
  });

  beforeEach(
      inject(function(DonationService, _GiveTransferService_, _$state_) {
        fixture = DonationService;
        GiveTransferService = _GiveTransferService_;
        $state = _$state_;
      })
  );

  it('should not allow credit card change if fields are empty', () => {
    expect(() => { fixture.createCard(); }).toThrow(new Error('Unable to create credit card'));
    // fake the valid form...
    var form = { $valid: true };
    fixture.processCreditCardChange(form);
    expect(GiveTransferService.processing).toBe(false);
  });

  it('should not allow bank account change if fields are empty', () => {
    expect(() => { fixture.createBank(); }).toThrow(new Error('Unable to create bank account'));
    // fake the valid form...
    var form = { $valid: true };
    fixture.processBankAccountChange(form);
    expect(GiveTransferService.processing).toBe(false);
  });

  describe('function transitionForLoggedInUserBasedOnExistingDonor', function() {
    var event;
    var toState;

    beforeEach(function() {
      event = jasmine.createSpyObj('event', ['preventDefault']);
      toState = {
        name: 'give.account'
      };
      GiveTransferService.donorError = false;
      GiveTransferService.processing = false;
      GiveTransferService.email = 'me@here.com';
    });

    it('should set transfer service card values for donor with default card', function() {
      var donor = {
        default_source: {
          credit_card: {
            last4: '9876',
            brand: 'Visa'
          }
        }
      };

      var getDonorPromise = {
        then: function(successCallback, errorCallback) {
          successCallback(donor);
        }
      };
      PaymentService.getDonor.and.returnValue(getDonorPromise);
      spyOn($state, 'go');

      fixture.transitionForLoggedInUserBasedOnExistingDonor(event, toState);

      expect(GiveTransferService.donorError).toBeFalsy();
      expect(GiveTransferService.processing).toBeTruthy();
      expect(event.preventDefault).toHaveBeenCalled();
      expect(PaymentService.getDonor).toHaveBeenCalledWith('me@here.com');
      expect($state.go).toHaveBeenCalledWith('give.confirm');
      expect(GiveTransferService.donor).toEqual(donor);
      expect(GiveTransferService.last4).toEqual('9876');
      expect(GiveTransferService.brand).toEqual('#cc_visa');
      expect(GiveTransferService.view).toEqual('cc');
    });

    it('should set transfer service bank values for donor with default bank account', function() {

    });
  });

  describe('function createRecurringGift', function() {

    it('should set the email of the donor on successful recurring gift with credit card', function() {
      var recurringGift = {
        email: 'test@me.com'
      };

      GiveTransferService.view = 'cc';
      GiveTransferService.donor =
      {
        default_source: {
          name: 'Tester',
          cc_number: '4242424242424242424',
          exp_date: '12/17',
          cvc: '123',
          address_zip: '45040'
        }
      };

      var createRecurringGiftWithCardPromise = {
        then: function(successCallback, errorCallback) {
          successCallback(recurringGift);
        }
      };
      PaymentService.createRecurringGiftWithCard.and.returnValue(createRecurringGiftWithCardPromise);
      spyOn($state, 'go');

      fixture.createRecurringGift();

      expect(PaymentService.createRecurringGiftWithCard).toHaveBeenCalled();
      expect($state.go).toHaveBeenCalledWith('give.thankYou');
      expect(GiveTransferService.processing).toBeTruthy();
      expect(GiveTransferService.email).toEqual('test@me.com');
    });

    it('should set the email of the donor on successful recurring gift with bank account', function() {
      var recurringGift = {
        email: 'test@me.com'
      };

      GiveTransferService.view = 'bank';
      GiveTransferService.donor =
      {
        default_source: {
          routing: '11000000',
          bank_account_number: '000123456789'
        }
      };

      var createRecurringGiftWithBankAcctPromise = {
        then: function(successCallback, errorCallback) {
          successCallback(recurringGift);
        }
      };
      PaymentService.createRecurringGiftWithBankAcct.and.returnValue(createRecurringGiftWithBankAcctPromise);
      spyOn($state, 'go');

      fixture.createRecurringGift();

      expect(PaymentService.createRecurringGiftWithBankAcct).toHaveBeenCalled();
      expect($state.go).toHaveBeenCalledWith('give.thankYou');
      expect(GiveTransferService.processing).toBeTruthy();
      expect(GiveTransferService.email).toEqual('test@me.com');
    });
  });
});
