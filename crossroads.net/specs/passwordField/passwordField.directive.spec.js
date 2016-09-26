

describe('Password Field Directive', function() {

  var scope;
  var $compile;
  var isolate;
  var $rootScope;
  var element;

  beforeEach(function() {
    angular.mock.module('crossroads.core');
  });

  beforeEach(inject(function(_$compile_, _$rootScope_) {
    $rootScope = _$rootScope_;
    scope = $rootScope.$new();
    $compile = _$compile_;
  }));

  describe('password meter true', function() {

    beforeEach(function() {
      element =
        '<password-field passwd=\'passwd\' submitted=\'submitted\' passwd-strength=\'true\'> </password-field>';
      scope.passwd = '';
      scope.submitted = false;
      element = $compile(element)(scope);
      scope.$digest();
      isolate = element.isolateScope();
    });

  });

  describe('password meter false', function() {
    beforeEach(function() {
      element =
        '<password-field passwd=\'passwd\' submitted=\'submitted\' passwd-strength=\'false\'> </password-field>';
      scope.passwd = '';
      scope.submitted = false;
      element = $compile(element)(scope);
      scope.$digest();
      isolate = element.isolateScope();
    });

  });

  describe('password validity', function() {
    beforeEach(function() {
      element =
        '<password-field required=\'true\' passwd=\'passwd\' submitted=\'submitted\' min-length=\'8\' passwd-strength=\'true\'> </password-field>';
      scope.passwd = '';
      scope.submitted = false;
      element = $compile(element)(scope);
      scope.$digest();
      isolate = element.isolateScope();
    });

    it('should have a valid password if the there are more than 8 characters', function() {
      scope.passwd = 'abcdefghij';
      scope.$digest();
      expect(isolate.passwd.passwordInvalid()).toBe(false);
    });

    it('should be invalid if there is less than 8 characters', function() {
      isolate.passwd.passwordForm.password.$setViewValue('abc');
      isolate.$digest();
      isolate.passwd.submitted = true;
      expect(isolate.passwd.passwordInvalid()).toBe(true);
    });

  });

});
