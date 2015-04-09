require('./bank_info.html');

(function () {
    angular
    .module('bank-info',[])
    .directive('bankInfo', ['$log', bankInfo]);

    function bankInfo($log) {
        var directive = {
          link: link,
          replace: true,
          templateUrl: 'give/bank_info.html',
          restrict: 'EA'
      };
      return directive;

      function link(scope, element, attrs) {

        $log.debug("Inside of bankInfo directive");
      }
    }
})()
