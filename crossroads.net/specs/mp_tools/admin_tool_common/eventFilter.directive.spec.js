require('../../../app/app');

describe('EventFilter Directive', function() {
  var $compile;
  var $rootScope;
  var $httpBackend;
  var scope;
  var callback;
  var templateString;

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
        scope.event = {id: 1};
        scope.events = [{ EventId: 1, EventTitle: 0 }];

        templateString =
          '<event-filter label="Event" event="event" events="events" ></event-filter>';
      })
  );
  describe('link function', function() {
    var element;
    beforeEach(function() {
      element = $compile(angular.element(templateString))(scope);
      scope.$digest();
    });

    it('should have a event', function() {
      var isolateScope = element.isolateScope();
      expect(isolateScope.event).toBeDefined();
      expect(isolateScope.event).toEqual({id: 1});
    });

    it('should have a events', function() {
      var isolateScope = element.isolateScope();
      expect(isolateScope.events).toBeDefined();
      expect(isolateScope.events).toEqual(scope.events);
    });

    it('should attach an change function onto isolate scope', function() {
      var isolateScope = element.isolateScope();
      expect(isolateScope.change).toBeDefined();
      expect(isolateScope.change).toEqual(jasmine.any(Function));
    });
  });
});
