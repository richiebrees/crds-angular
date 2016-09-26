require('../../../app/common/common.module');
require('../../../app/app');

describe('Give Transfer Service', function() {
  var fixture;

  beforeEach(function(){
    angular.mock.module('crossroads', function($provide){
    });
  });

  beforeEach(
    inject(function(GiveTransferService) {
      fixture = GiveTransferService;
    })
  );

  describe('factory object', function(){
    it('should have the expected attributes', function(){
      fixture.reset();
      expect(fixture.account).toBeDefined();
      expect(fixture.account).toBe('');

      expect(fixture.amount).toBeUndefined();

      expect(fixture.ccNumberClass).toBeDefined();
      expect(fixture.ccNumberClass).toBe('');

      expect(fixture.declinedPayment).toBeDefined();
      expect(fixture.declinedPayment).toBeFalsy();

      expect(fixture.donor).toBeDefined();
      expect(fixture.donor).toEqual({});

      expect(fixture.email).toBeUndefined();

      expect(fixture.program).toBeUndefined();

      expect(fixture.routing).toBeDefined();
      expect(fixture.routing).toBe('');

      expect(fixture.savedPayment).toBeDefined();
      expect(fixture.savedPayment).toBe('');

      expect(fixture.view).toBeDefined();
      expect(fixture.view).toBe('bank');
    });

    describe('factory object', function(){
      it('should have the expected attributes when converting to recurring', function(){
        fixture.resetForConvert();
        expect(fixture.account).toBeDefined();
        expect(fixture.account).toBe('');

        expect(fixture.amount).toBeUndefined();

        expect(fixture.ccNumberClass).toBeDefined();
        expect(fixture.ccNumberClass).toBe('');

        expect(fixture.declinedPayment).toBeDefined();
        expect(fixture.declinedPayment).toBeFalsy();

        expect(fixture.donor).toBeDefined();
        expect(fixture.donor).toEqual({});

        expect(fixture.email).toBeUndefined();

        expect(fixture.program).toBeUndefined();

        expect(fixture.routing).toBeDefined();
        expect(fixture.routing).toBe('');

        expect(fixture.savedPayment).toBeDefined();
        expect(fixture.savedPayment).toBe('');

        expect(fixture.view).toBeDefined();
        expect(fixture.view).toBe('bank');
      });

    it("should have the expected attributes reset", function() {
      fixture.account = '1';
      fixture.amount = '2';
      fixture.ccNumberClass = '3';
      fixture.declinedPayment = '4';
      fixture.donor = '5';
      fixture.email = '6';
      fixture.program = '7';
      fixture.routing = '8';
      fixture.savedPayment = '9';
      fixture.view = '10';

      fixture.reset();

      expect(fixture.account).toBeDefined();
      expect(fixture.account).toBe('');

      expect(fixture.amount).toBeUndefined();

      expect(fixture.ccNumberClass).toBeDefined();
      expect(fixture.ccNumberClass).toBe('');

      expect(fixture.declinedPayment).toBeDefined();
      expect(fixture.declinedPayment).toBeFalsy();

      expect(fixture.donor).toBeDefined();
      expect(fixture.donor).toEqual({});

      expect(fixture.email).toBeUndefined();

      expect(fixture.program).toBeUndefined();

      expect(fixture.routing).toBeDefined();
      expect(fixture.routing).toBe('');

      expect(fixture.savedPayment).toBeDefined();
      expect(fixture.savedPayment).toBe('');

      expect(fixture.view).toBeDefined();
      expect(fixture.view).toBe('bank');    });
  });

    it("should have the expected attributes reset for conversion", function() {
      fixture.account = '1';
      fixture.amount = '2';
      fixture.ccNumberClass = '3';
      fixture.declinedPayment = '4';
      fixture.donor = '5';
      fixture.email = '6';
      fixture.program = '7';
      fixture.routing = '8';
      fixture.savedPayment = '9';
      fixture.view = '10';

      fixture.resetForConvert();

      expect(fixture.account).toBeDefined();
      expect(fixture.account).toBe('');

      expect(fixture.amount).toBeDefined();
      expect(fixture.amount).toBe('2');

      expect(fixture.ccNumberClass).toBeDefined();
      expect(fixture.ccNumberClass).toBe('');

      expect(fixture.declinedPayment).toBeDefined();
      expect(fixture.declinedPayment).toBeFalsy();

      expect(fixture.donor).toBeDefined();
      expect(fixture.donor).toEqual({});

      expect(fixture.email).toBeUndefined();

      expect(fixture.program).toBeDefined();
      expect(fixture.program).toBe('7');

      expect(fixture.routing).toBeDefined();
      expect(fixture.routing).toBe('');

      expect(fixture.savedPayment).toBeDefined();
      expect(fixture.savedPayment).toBe('');

      expect(fixture.view).toBeDefined();
      expect(fixture.view).toBe('bank');    });
  });

});
