(function() {
  'use strict';

  

  describe('EmailBox Directive', function() {

    var $compile;
    var element;
    var emailBox;
    var $httpBackend;
    var isolateScope;
    var $rootScope;
    var scope;

    beforeEach(function() {
      angular.mock.module('crossroads.core');
    });

    beforeEach(inject(function(_$compile_, _$rootScope_,_$httpBackend_) {
      $compile = _$compile_;
      $rootScope = _$rootScope_;
      scope = $rootScope.$new();
      $httpBackend = _$httpBackend_;
    }));

    describe('General Specs', function() {

      beforeEach(inject(function(_$compile_, _$rootScope_,_$httpBackend_) {
        element = '<email-box ' +
          'send-message-callback=\'sendMessageCallback(message, onSuccess, onError)\' loading=\'loading\'>' +
          '</email-box';
        scope.sendMessageCallback = function(message, onSuccess, onError) {
          onSuccess();
        };

        scope.loading = false;
        element = $compile(element)(scope);
        scope.$digest();
        emailBox = element.isolateScope().emailBox;
      }));

      it('should display a global error message', function() {
        spyOn($rootScope, '$emit');
        emailBox.messageForm.$valid = false;
        emailBox.sendMessage();
        expect($rootScope.$emit).toHaveBeenCalledWith('notify', $rootScope.MESSAGES.generalError);
      });

      it('should call the send message callback', function() {
        spyOn(scope, 'sendMessageCallback');
        emailBox.messageForm.$valid = true;
        emailBox.sendMessage();
        expect(scope.sendMessageCallback).toHaveBeenCalled();
      });

      it('should call the send message callback with the correct text', function() {
        spyOn(scope, 'sendMessageCallback').and.callThrough();
        emailBox.messageText = 'this is a test';
        emailBox.messageForm.$valid = true;
        emailBox.sendMessage();
        expect(scope.sendMessageCallback)
          .toHaveBeenCalledWith('this is a test', jasmine.any(Function), jasmine.any(Function));
      });

      it('should default isMessageToggled to false', function() {
        expect(emailBox.isMessageToggled).toEqual(false);
      });

    });

    describe('Error Handler', function() {

      beforeEach(function() {
        element = '<email-box ' +
          'send-message-callback=\'sendMessageCallback(message, onSuccess, onError)\' loading=\'loading\'>' +
          '</email-box';
        scope.sendMessageCallback = function(message, onSuccess, onError) {
          onError();
        };

        scope.loading = false;
        element = $compile(element)(scope);
        scope.$digest();
        emailBox = element.isolateScope().emailBox;
      });

      it('should call the error callback', function() {
        emailBox.messageText = 'this is a test';
        emailBox.messageForm.$valid = true;
        emailBox.sendMessage();
        expect(emailBox.messageText).toBe('this is a test');
      });

    });

    describe('Success Handler', function() {
      beforeEach(function() {
        element = '<email-box ' +
          'send-message-callback=\'sendMessageCallback(message, onSuccess, onError)\' loading=\'loading\'>' +
          '</email-box';
        scope.sendMessageCallback = function(message, onSuccess, onError) {
          onSuccess();
        };

        scope.loading = false;
        element = $compile(element)(scope);
        scope.$digest();
        emailBox = element.isolateScope().emailBox;
      });

      it('should call the onSuccess callback', function() {
        emailBox.messageText = 'this is a test';
        emailBox.messageForm.$valid = true;
        emailBox.sendMessage();
        expect(emailBox.messageText).toBe(null);
      });

    });

  });
})();
