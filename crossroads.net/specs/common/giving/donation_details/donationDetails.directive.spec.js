require('../../../../app/common/common.module');
require('../../../../app/app');

describe('DonationDetails Directive', function() {
  var element;
  var scope;
  var $timeout;

  beforeEach(function() {
    angular.mock.module('crossroads');
  });

  beforeEach(angular.mock.module(function($provide) {
    $provide.value('$state', { get: function() {} });
  }));

  beforeEach(inject(function(_$compile_, _$rootScope_, _$templateCache_, _$timeout_) {
    var $compile = _$compile_;
    var $rootScope = _$rootScope_;
    var $templateCache = _$templateCache_;
    var templateString = '<donation-details amount="model.amount" ' +
            'program="model.program" ' +
            'amount-submitted="model.amountSubmitted" ' +
            'programs-in="model.programsInput" ' +
            'giving-type="model.givingType" ' +
            'recurring-start-date="model.recurringStartDate">';

    $templateCache.put('on-submit-messages', '<span ng-message="required">Required</span>');
    $templateCache.put('on-blur-messages',
        '<span ng-message="invalidRouting">Invalid routing</span>' +
        '<span ng-message="invalidAccount">Invalid account</span>' +
        '<span ng-message="naturalNumber">Not a valid number</span>' +
        '<span ng-message="invalidZip">Invalid zip</span>');

    scope = $rootScope.$new();
    scope.model = {
      amount: 123.45,
      amountSubmitted: true,
      program: {
        ProgramId: 3,
        ProgramName: 'Crossroads',
        AllowRecurringGiving: true
      },
      programsInput: [
        {
          ProgramId: 3,
          ProgramName: 'Crossroads',
          AllowRecurringGiving: true
        }
      ],
      givingType: 'week',
      recurringStartDate: undefined
    };

    element = $compile(angular.element(templateString))(scope);
    scope.$digest();
  }));

  describe('clearStartDate Function', function() {
    it('should not clear the date if giving_type = one_time', function() {
      scope.model.givingType = 'one_time';
      scope.model.recurringStartDate = '10/31/2025';

      var isolateScope = element.isolateScope();
      isolateScope.$apply();

      spyOn(isolateScope.donationDetailsForm.recurringStartDate, '$setDirty');

      isolateScope.clearStartDate();
      expect(isolateScope.recurringStartDate).toEqual('10/31/2025');
      expect(isolateScope.donationDetailsForm.recurringStartDate.$setDirty).not.toHaveBeenCalled();
    });

    it('should not clear the date if start date has been changed (is dirty)', function() {
      scope.model.givingType = 'week';
      scope.model.recurringStartDate = '10/31/2025';

      var isolateScope = element.isolateScope();
      isolateScope.$apply();

      // Dirty the form, then spy on $setDirty
      isolateScope.donationDetailsForm.recurringStartDate.$setDirty();

      spyOn(isolateScope.donationDetailsForm.recurringStartDate, '$setDirty');

      isolateScope.clearStartDate();
      expect(isolateScope.recurringStartDate).toEqual('10/31/2025');
      expect(isolateScope.donationDetailsForm.recurringStartDate.$setDirty).not.toHaveBeenCalled();
    });

    it('should clear the date if start date has not been changed (is pristine)', function() {
      scope.model.givingType = 'week';
      scope.model.recurringStartDate = '10/31/2025';

      var isolateScope = element.isolateScope();
      isolateScope.$apply();

      spyOn(isolateScope.donationDetailsForm.recurringStartDate, '$setDirty');

      isolateScope.clearStartDate();
      expect(isolateScope.recurringStartDate).toBeUndefined();
      expect(isolateScope.donationDetailsForm.recurringStartDate.$setDirty).toHaveBeenCalled();
    });
  });

  describe('startDateError Function', function() {
    it('should return true if all criteria are met', function() {
      scope.model.amountSubmitted = true;
      scope.model.givingType = 'week';

      var isolateScope = element.isolateScope();
      isolateScope.$apply();

      var form = isolateScope.donationDetailsForm;
      form.recurringStartDate.$setDirty();
      form.recurringStartDate.$setValidity('invalid', false);

      expect(isolateScope.startDateError()).toBeTruthy();
    });

    it('should return false if amountSubmitted = false', function() {
      scope.model.amountSubmitted = false;
      scope.model.givingType = 'week';

      var isolateScope = element.isolateScope();
      isolateScope.$apply();

      var form = isolateScope.donationDetailsForm;
      form.recurringStartDate.$setDirty();
      form.recurringStartDate.$setValidity('invalid', false);

      expect(isolateScope.startDateError()).toBeFalsy();
    });

    it('should return false if givingType = one_time', function() {
      scope.model.amountSubmitted = true;
      scope.model.givingType = 'one_time';

      var isolateScope = element.isolateScope();
      isolateScope.$apply();

      var form = isolateScope.donationDetailsForm;
      form.recurringStartDate.$setDirty();
      form.recurringStartDate.$setValidity('invalid', false);

      expect(isolateScope.startDateError()).toBeFalsy();
    });

    it('should return false if recurringStartDate.$dirty = false', function() {
      scope.model.amountSubmitted = true;
      scope.model.givingType = 'week';

      var isolateScope = element.isolateScope();
      isolateScope.$apply();

      var form = isolateScope.donationDetailsForm;
      form.recurringStartDate.$setValidity('invalid', false);

      expect(isolateScope.startDateError()).toBeFalsy();
    });

    it('should return false if recurringStartDate.$invalid = false', function() {
      scope.model.amountSubmitted = true;
      scope.model.givingType = 'week';
      scope.model.recurringStartDate = '10/31/2025';

      var isolateScope = element.isolateScope();
      isolateScope.$apply();

      var form = isolateScope.donationDetailsForm;
      form.recurringStartDate.$setDirty();

      expect(isolateScope.startDateError()).toBeFalsy();
    });
  });
});
