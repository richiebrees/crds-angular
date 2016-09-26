require('../../../app/app');

describe('SiteFilter Directive', function() {
  var $compile;
  var $rootScope;
  var $httpBackend;
  var scope;
  var callback;
  var templateString;

  var mockSites = [
    { dp_RecordID: 1, dp_RecordName: 'Mason' },
    { dp_RecordID: 2, dp_RecordName: 'Oxford' },
    { dp_RecordID: 3, dp_RecordName: 'Florence' },
  ]

  beforeEach(angular.mock.module('crossroads'));

  beforeEach(angular.mock.module(function($provide) {
    $provide.value('$state', { get: function() {} });
  }));

  beforeEach(
      inject(function(_$compile_, _$rootScope_, _$httpBackend_) {
        $compile = _$compile_;
        $rootScope = _$rootScope_;
        $httpBackend = _$httpBackend_;

        scope = $rootScope.$new();
        scope.site = {id: 1};
        scope.loadEvents = function() { };

        templateString =
          '<site-filter site="site" on-change="loadEvents()"></site-filter>';
      })
  );
  describe('link function', function() {
    var element;
    beforeEach(function() {
      element = $compile(angular.element(templateString))(scope);
      scope.$digest();
    });

    it('should have a site', function() {
      var isolateScope = element.isolateScope();
      expect(isolateScope.site).toBeDefined();
      expect(isolateScope.site).toEqual({id: 1});
    });

    it('should attach an change function onto isolate scope', function() {
      var isolateScope = element.isolateScope();
      expect(isolateScope.change).toBeDefined();
      expect(isolateScope.change).toEqual(jasmine.any(Function));
    });

    it('should attach an change function onto isolate scope', function() {
      var isolateScope = element.isolateScope();
      expect(isolateScope.onChange).toBeDefined();
      expect(isolateScope.onChange).toEqual(jasmine.any(Function));
    });

    describe('test call to sites api', function() {
      it('should cotain the following data', function() {
        var isolateScope = element.isolateScope();
        isolateScope.activate();
        $httpBackend.expectGET(window.__env__['CRDS_API_ENDPOINT'] + 'api/lookup/crossroadslocations')
                               .respond(mockSites);
        $httpBackend.flush();
        expect(isolateScope.sites.length).toEqual(3);
      });
    });

  });
});
