describe('CoreController', function() {

  beforeEach(angular.mock.module('crossroads.core'));

  var $controller, $rootScope, Message, MESSAGES, $aside, $scope, controller;
  beforeEach(inject(function(_$controller_, _$rootScope_, _Message_, _MESSAGES_, _$aside_){
    $controller = _$controller_;
    $rootScope = _$rootScope_;
    Message = _Message_;
    MESSAGES = _MESSAGES_;
    $aside = _$aside_;
    $scope = {};
    controller = $controller('coreController', {$scope: $scope});
  }));

});
