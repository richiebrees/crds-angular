

describe('Auth Service', function() {
  var fixture;

  var $http, Session, $rootScope, AUTH_EVENTS;

  beforeEach(function(){
    angular.mock.module('crossroads.core', function($provide){
      Session = jasmine.createSpyObj('Session', ['exists', 'isActive']);
      $provide.value('Session', Session);
    });
  });

  beforeEach(inject(function(_AuthService_, _$http_, _$rootScope_, _AUTH_EVENTS_){
    fixture = _AuthService_;
    $http = _$http_;
    $rootScope = _$rootScope_;
    AUTH_EVENTS = _AUTH_EVENTS_;
  }));

  describe('Function isAuthorized', function() {
    it('should return false if isAuthorized is false', function() {
      Session.exists.and.callFake(function(something){
        return(null);
      });
      Session.isActive.and.callFake(function() {
        return(false);
      });

      expect(fixture.isAuthorized(7)).toBeFalsy();
    });

    it('should return false if user not in role', function() {
      Session.exists.and.callFake(function(something){
        return("cookie");
      });
      Session.isActive.and.callFake(function() {
        return(true);
      });

      $rootScope.roles = [{Id: 1, Name: 'Role 1'}, {Id: 2, Name: 'Role 2'}];

      expect(fixture.isAuthorized(7)).toBeFalsy();
    });

    it('should return true if user is in role', function() {
      Session.exists.and.callFake(function(something){
        return("cookie");
      });
      Session.isActive.and.callFake(function() {
        return(true);
      });

      $rootScope.roles = [{Id: 1, Name: 'Role 1'}, {Id: 2, Name: 'Role 2'}, {Id: 7, Name: 'Role 7'}];

      expect(fixture.isAuthorized([3, 4, 7])).toBeTruthy();
    });
  });
});
