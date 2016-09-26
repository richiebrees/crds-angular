

describe('Date Range Directive', function() {

  var $compile;
  var $rootScope;
  var $httpBackend;
  var scope;
  var dateRange;
  var element;
  var templateString;

  beforeEach(function() {
    angular.mock.module('crossroads.core');
  });

  beforeEach(
      inject(function(_$compile_, _$rootScope_, _$httpBackend_) {
        $compile = _$compile_;
        $rootScope = _$rootScope_;
        $httpBackend = _$httpBackend_;

        scope = $rootScope.$new();

        templateString =
          '<date-range start-date="start" end-date="end">Date Range Goes Here</date-range>';
      })
  );

  describe('activate function', function() {
    it('should have these starting values', function() {
      scope.start = new Date('2/23/2012');
      scope.end = new Date('2/25/2012');
      element = $compile(angular.element(templateString))(scope);
      scope.$digest();
      dateRange = element.isolateScope().daterange;

      dateRange.activate();
      expect(dateRange.startDateOpen).toEqual(false);
      expect(dateRange.endDateOpen).toEqual(false);
      expect(dateRange.currentDate.toString()).toBe(new Date().toString());
      expect(dateRange.startDate.toString()).toBe(new Date('2/23/2012').toString());
      expect(dateRange.endDate.toString()).toBe(new Date('2/25/2012').toString());
      expect(dateRange.dateOptions).toEqual({formatYear: 'yy', startingDay: 0, showWeeks: 'false',});
    });
  });

  describe('update function', function() {
    it('should reset end date', function() {
      scope.start = new Date('3/29/2012');
      scope.end = new Date('2/25/2012');
      element = $compile(angular.element(templateString))(scope);
      scope.$digest();
      dateRange = element.isolateScope().daterange;

      dateRange.update();
      expect(dateRange.endDate.toString()).toBe(new Date('3/29/2012').toString());
    });

    it('not should reset end date', function() {
      scope.start = new Date('2/23/2012');
      scope.end = new Date('2/25/2012');
      element = $compile(angular.element(templateString))(scope);
      scope.$digest();
      dateRange = element.isolateScope().daterange;

      dateRange.update();
      expect(dateRange.endDate.toString()).toBe(new Date('2/25/2012').toString());
    });
  });
});
