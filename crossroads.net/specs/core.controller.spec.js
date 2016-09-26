describe('CoreController', function() {

  beforeEach(angular.mock.module('crossroads.core'));

  let $controller,
      $rootScope,
      Message,
      MESSAGES,
      $aside,
      $scope,
      controller,
      growl,
      screenSize,
      $state,
      ContentBlock,
      contentMessageService;

  beforeEach(angular.mock.module({
    ContentMessageService: {
      set: function () {
        return;
      }
    }
  }));

  beforeEach(inject(function(_$controller_, _$rootScope_, _ContentBlock_, _MESSAGES_, _$aside_, _growl_, _screenSize_, _$state_, _$log_, _ContentMessageService_){
    $controller = _$controller_;
    $rootScope = _$rootScope_;
    ContentBlock = _ContentBlock_;
    MESSAGES = _MESSAGES_;
    $aside = _$aside_;
    growl = _growl_;
    screenSize = _screenSize_;
    $state = _$state_;
    contentMessageService = _ContentMessageService_;
    $scope = $rootScope.$new();
    controller = $controller('coreController', {
      '$scope': $scope,
      '$rootScope': $rootScope,
      'MESSAGES': MESSAGES,
      'ContentBlock': ContentBlock,
      'growl': growl,
      '$aside': $aside,
      'screenSize': screenSize,
      '$state': $state,
      'contentMessageService': contentMessageService
    });
  }));

  describe('function mapContentBlocks', function() {
    it('should set MESSAGES with retrieved contentBlocks', function() {
      MESSAGES = {};
      var firstMessage = {id: 1, title: 'firstMessage'};
      var secondMessage = {id: 2, title: 'secondMessage'};
      var thirdMessage = {id: 3, title: 'thirdMessage'};
      var fourthMessage = {id: 4, title: 'fourthMessage'};
      var contentBlocks = [
        firstMessage,
        secondMessage,
        thirdMessage,
        fourthMessage
      ];

      controller.mapContentBlocks(contentBlocks);
      console.log(MESSAGES);
      expect(_.size(MESSAGES)).toBe(4);
      expect(MESSAGES.firstMessage).toBe(firstMessage);
      expect(MESSAGES.secondMessage).toBe(secondMessage);
      expect(MESSAGES.thirdMessage).toBe(thirdMessage);
      expect(MESSAGES.fourthMessage).toBe(fourthMessage);
    });
  });
});
