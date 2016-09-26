

describe('Date Field Directive', function() {

  var $scope, form;

  beforeEach(function() {
    angular.mock.module('crossroads.core');
  });

  beforeEach(inject(function($compile, $rootScope, $httpBackend) {
    $scope = $rootScope;
    var element = angular.element(
      '<form name="form">' +
      '<input type="text" ng-model="model.aDate" name="aDate" invalidate-past-date />' +
      '</form>'
    );
    $scope.model = { aDate: undefined };
    $compile(element)($scope);
    form = $scope.form;
  }));


  describe('PastDateTests', function() {
    it("Should not allow past date", function(){
      form.aDate.$setViewValue(new Date('10/28/2010'));
      $scope.$digest();
      expect(form.aDate.$valid).toBeFalsy();
    });

    it("Should allow future date", function(){
      form.aDate.$setViewValue(new Date('10/28/2222'));
      $scope.$digest();
      expect(form.aDate.$valid).toBeTruthy();
    });

    it("Should not validate date if date is undefined", function() {
      form.aDate.$setViewValue(undefined);
      $scope.$digest();
      expect(form.aDate.$valid).toBeTruthy();
    });
  });
});
