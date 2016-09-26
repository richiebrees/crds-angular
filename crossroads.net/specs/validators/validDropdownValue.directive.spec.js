

describe('Dropdown Validator', function() {

  var $compile;
  var scope;
  var form;
  var element;
  var $rootScope;

  beforeEach(function() {
    angular.mock.module('crossroads.core');
  });

  beforeEach(inject(function(_$compile_, _$rootScope_, $injector) {
    $compile = _$compile_;
    $rootScope = _$rootScope_;
    scope = $rootScope.$new();
    element = angular.element(
        '<form name=\'form\'>' +
          '<select name=\'dropdown\' ' +
                  'valid-dropdown-value=\'validValues\' ' +
                  'ng-model=\'selected\' ' +
                  'ng-options=\'r.id as r.name for r in records\'>'
    );
    scope.selected = 5;
    scope.validValues = [1, 2, 3, 4, 6];
    scope.records = [
      { id: 1, name: 'one' },
      { id: 2, name: 'two' },
      { id: 3, name: 'three' },
      { id: 4, name: 'four' },
      { id: 6, name: 'six' }
    ];
    $compile(element)(scope);
    form = scope.form;
  }));

  it('should have a valid value', function() {
    form.dropdown.$setViewValue(1);
    scope.$digest();
    expect(form.dropdown.$valid).toBeTruthy();
  });

  it('should not have a valid value', function() {
    form.dropdown.$setViewValue(5);
    scope.$digest();
    expect(form.dropdown.$valid).toBeFalsy();
  });

  it('should require a value', function() {
    form.dropdown.$setViewValue(null);
    scope.$digest();
    expect(form.dropdown.$valid).toBeFalsy();
  });

});
