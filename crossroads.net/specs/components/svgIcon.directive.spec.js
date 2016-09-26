

describe('SVG Icon Directive', function() {

  var $compile, $rootScope, element, scope, isolateScope, $httpBackend;

  beforeEach(function(){
    angular.mock.module('crossroads.core');
  });

  beforeEach(inject(function(_$compile_, _$rootScope_, _$httpBackend_){
    $compile = _$compile_;
    $rootScope = _$rootScope_;
    scope = $rootScope.$new();
    $httpBackend = _$httpBackend_;
  }));


  it('should show the checkmark icon', function(){
    element = '<svg-icon icon=\'check-circle\'></svg-icon>';

    element = $compile(element)(scope);
    scope.$digest();
    isolateScope = element.isolateScope();

    expect(element.html()).toContain('icon-check-circle');
    expect(element.html()).toContain('#check-circle');
  });

  it('should show the cancel icon', function(){
    element = '<svg-icon icon=\'cancel-circle\'></svg-icon>';
    element = $compile(element)(scope);
    scope.$digest();
    isolateScope = element.isolateScope();

    expect(element.html()).toContain('icon-cancel-circle');
    expect(element.html()).toContain('#cancel-circle');
  });

});
