(function() {
  'use strict()';

  module.exports = MyTripCard;

  MyTripCard.$inject = ['$log', 'TripsUrlService'];

  function MyTripCard($log, TripsUrlService) {
    return {
      restrict: 'EA',
      transclude: true,
      templateUrl: 'mytrips/mytripCard.html',
      scope: {
        trip: '='
      },
      link: link
    };

    function link(scope, el, attr) {
      scope.goalMet = goalMet;
      scope.shareUrl  = TripsUrlService.ShareUrl('trip');

      function goalMet(totalRaised, goal) {
        return (totalRaised >= goal);
      }
    }
  }
})();
