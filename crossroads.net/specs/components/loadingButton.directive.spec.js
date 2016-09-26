

describe('loadingButton', function() {

  var $compile, $rootScope, element, scope, isolateScope, $httpBackend;

  beforeEach(function() {
    angular.mock.module('crossroads.core');
  });

  beforeEach(inject(function(_$compile_, _$rootScope_,_$httpBackend_) {
    $compile = _$compile_;
    $rootScope = _$rootScope_;
    scope = $rootScope.$new();
    $httpBackend = _$httpBackend_;
    element = '<loading-button input-type=\'submit\' ' +
                               'normal-text=\'Load\' ' +
                               'loading-text=\'Loading...\' ' +
                               'loading-class=\'disabled\' ' +
                               'loading=\'loading\' '  +
                               'input-classes=\'btn btn-primary \' > </loading-button>';
    scope.loading = false;

    element = $compile(element)(scope);
    scope.$digest();
    isolateScope = element.isolateScope();
  }));

  it('should set the loading state to false', function(){
    expect(isolateScope.loading).toBe(false);
  });

  it('should not have a disabled button class', function(){
    expect(isolateScope.buttonClass()).toBe('');
  });

  it('should have return disabled when loading', function(){
    scope.loading = true;
    scope.$digest();
    expect(isolateScope.buttonClass()).toBe('disabled');
  });

  it('should change the button text when loading', function(){
    scope.loading = true;
    scope.$digest();
    expect(isolateScope.buttonText()).toBe('Loading...');
  });


});
