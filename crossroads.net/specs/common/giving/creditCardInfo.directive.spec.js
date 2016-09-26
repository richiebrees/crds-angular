require('../../../app/common/common.module');
require('../../../app/app');

describe('Credit Card Info Directive', function() {
  var ccElement;
  var scope;
  var isolateScope;
  var form;
  var $timeout;
  var httpBackend;

  beforeEach(function() {
    angular.mock.module('crossroads');
  });

  beforeEach(angular.mock.module(function($provide) {
    $provide.value('$state', { get: function() {} });
  }));

  beforeEach(inject(function($injector, _$compile_, _$rootScope_, _$templateCache_, _$timeout_) {
    var $compile = _$compile_;
    var $rootScope = _$rootScope_;
    var $templateCache = _$templateCache_;
    httpBackend = $injector.get('$httpBackend');
    $timeout = _$timeout_;

    $templateCache.put('on-submit-messages', '<span ng-message="required">Required</span>');
    $templateCache.put('on-blur-messages',
      '<span ng-message="invalidRouting">Invalid routing</span>' +
      '<span ng-message="invalidAccount">Invalid account</span>' +
      '<span ng-message="naturalNumber">Not a valid number</span>' +
      '<span ng-message="invalidZip">Invalid zip</span>');

    var templateString = '<credit-card-info '
     + 'cvc=\'model.cvc\' '
     + 'exp-date=\'model.expDate\' '
     + 'cc-number=\'model.ccNumber\' '
     + 'billing-zip-code=\'model.billingZipCode\' '
     + 'bankinfo-submitted=\'model.bankinfoSubmitted\' '
     + 'name-on-card=\'model.nameOnCard\' '
     + 'default-source=\'model.defaultSource\' '
     + 'change-account-info=\'model.changeAccountInfo\' '
     + 'declined-payment=\'model.declinedPayment\' '
     + 'set-valid-card=\'model.setValidCard\' '
     + 'set-valid-cvc=\'model.setValidCvc\' '
     + 'cc-number-class=\'model.ccNumberClass\'>'
     + '</credit-card-info>';

    scope = $rootScope.$new();
    scope.model = {
      cvc: '123',
      expDate: '1219',
      ccNumber: '4242424242424242',
      billingZipCode: '45140',
      bankInfoSubmitted: false,
      nameOnCard: 'Mr. Ed',
      defaultSource: {
        address_zip: '12345',
        brand: 'Visa',
        cvc: '123',
        exp_date: '0123',
        name: 'Tim Giver',
        last4: '9876',
      },
      changeAccountInfo: false,
      ccNumberClass: 'cc-visa',
      declinedPayment: false
    };

    ccElement = $compile(templateString)(scope);
    scope.$digest();
    $timeout.flush();
    isolateScope = ccElement.isolateScope();
    form = isolateScope.creditCardForm;
  }));

  describe('swapCreditCardExpDateFields Function', function() {
    it('should not dirty the credit card form or set focus if not changing existing account info', function() {
      var expDate = ccElement.find('input')[1];
      spyOn(expDate, 'focus');
      isolateScope.swapCreditCardExpDateFields();
      $timeout.verifyNoPendingTasks();
      expect(form.$dirty).toBeFalsy();
      expect(expDate.focus).not.toHaveBeenCalled();
    });

    it('should dirty the credit card form and set focus if changing existing account info', function() {
      var expDate = ccElement.find('input')[1];
      spyOn(expDate, 'focus');
      isolateScope.changeAccountInfo = true;
      isolateScope.swapCreditCardExpDateFields();
      $timeout.flush();
      expect(form.$dirty).toBeTruthy();
      expect(expDate.focus).toHaveBeenCalled();
    });
  });

  describe('ccCardType Function', function() {
    it('should have the visa credit card class', function() {
     form.ccNumber.$modelValue = '4242424242424242';
     isolateScope.ccCardType();
     expect(isolateScope.ccNumberClass).toBe('cc-visa');
   });

    it('should have the mastercard credit card class', function() {
      form.ccNumber.$modelValue = '5105105105105100';
      isolateScope.ccCardType();
      expect(isolateScope.ccNumberClass).toBe('cc-mastercard');
    });

    it('should have the discover credit card class', function() {
      form.ccNumber.$modelValue = '6011111111111117';
      isolateScope.ccCardType();
      expect(isolateScope.ccNumberClass).toBe('cc-discover');
    });

    it('should have the amex credit card class', function() {
      form.ccNumber.$modelValue = '378282246310005';
      isolateScope.ccCardType();
      expect(isolateScope.ccNumberClass).toBe('cc-american-express');
    });

    it('should not have a credit card class', function() {
      form.ccNumber.$modelValue = '';
      isolateScope.defaultCardPlaceholderValues = {};
      isolateScope.ccCardType();
      expect(isolateScope.ccNumberClass).toBe('');
    });
  });
});
