(function() {
  'use strict';
  var moment = require('moment');
  module.exports = MyServeController;

  MyServeController.$inject = [
    '$scope',
    '$rootScope',
    '$window',
    '$log',
    'ServeTeamFilterState',
    'Session',
    'ServeOpportunities',
    'Groups',
    'leader',
    'AUTH_EVENTS',
    'ServeTeamService'
  ];

  function MyServeController(
    $scope,
    $rootScope,
    $window,
    $log,
    filterState,
    Session,
    ServeOpportunities,
    Groups,
    leader,
    AUTH_EVENTS,
    ServeTeamService
    ) {

    var vm = this;

    vm.convertToDate = convertToDate;
    vm.filterState = filterState;
    vm.groups = Groups;
    vm.lastDate = null;
    vm.loadMore = false;
    vm.loadNextMonth = loadNextMonth;
    vm.loadText = 'Load More';
    vm.original = [];
    vm.showButton = showButton;
    vm.showNoOpportunitiesMsg = showNoOpportunitiesMsg;
    vm.isLeader = leader.isLeader;

    activate();

    //////////////////////////
    // $rootScope listeners //
    //////////////////////////
    $rootScope.$on('personUpdated', personUpdateHandler);

    $rootScope.$on('filterDone', function(event, data) {
      vm.groups = data;
    });

    $rootScope.$on('filterByDates', filterByDates);

    $rootScope.$on('updateAfterSave', updateAfterSave);

    $rootScope.$on(AUTH_EVENTS.logoutSuccess, function(event, data) {
      vm.filterState.clearAll();
    });

    $rootScope.$on('$stateChangeStart', stateChangeStart);

    $window.onbeforeunload = onBeforeUnload;

    ////////////////////////////
    // Implementation Details //
    ////////////////////////////

    // Activate what? What is lastDate, and why does setting it with a formatted date activate it?
    function activate() {
      vm.lastDate = formatDate(new Date(), 28);
    }

    // This looks like a date helper function. Does this kind of functionality belong in the
    // myserve.controller?
    // What is the magic number 28?
    function addOneMonth(date) {
      var d = angular.copy(date);
      d.setDate(date.getDate() + 28);
      return d;
    }

    // Check child forms for what? What does this function do?
    function checkChildForms() {
      var form = $scope.serveForm;
      var keys = _.keys(form);
      var dirty = [];
      _.each(keys, function(k) {
        if (_.startsWith(k, 'team')) {
          if (form[k].$dirty) {
            dirty.push(k);
          }
        }
      });

      if (dirty.length < 1) {
        $scope.serveForm.$setPristine();
      }
    }

    // This looks like another date helper function. Seems like a good candidate to go into 
    // some kind of helper class / module.
    function convertToDate(date) {
      // date comes in as mm/dd/yyyy, convert to yyyy-mm-dd for moment to handle
      var d = new Date(date);
      return d;
    }

    // Filter what by dates?
    // This function needs to know that data has fromDate and toDate as attributes. Can
    // we just pass in data.fromDate and data.toDate as parameters in the method call?
    function filterByDates(event, data) {
      loadOpportunitiesByDate(data.fromDate, data.toDate).then(function(opps) {
        vm.groups = opps;
        vm.original = opps;
        $rootScope.$broadcast('filterByDatesDone');
      },

      function(err) {
        $rootScope.$emit('notify', $rootScope.MESSAGES.generalError);
      });
    }

    // Looks like a date helper function. It is the 3rd one. This type of functionality really should
    // be pull out into a date helper class / module.
    // The comment seems superfluous. Renaming the parameters would provide all the context this method
    // needs to be self-documenting.
    /**
     * Takes a javascript date and returns a
     * string formated MM/DD/YYYY
     * @param date - Javascript Date
     * @param days to add - How many days to add to the original date passed in
     * @return string formatted in the way we want to display
     */
    function formatDate(date, days) {
      if (days === undefined) {
        days = 0;
      }

      var d = moment(date);
      d.add(days, 'd');
      return d.format('MM/DD/YYYY');
    }


    // This seems like it has good potential to be self documenting. You could rename the parameters to
    // describe that the dates should be in epoch format. The function is short enough that it is easy
    // to see it returns a promise.
    /**
     * This function will fetch a new set of serve opportunities between two dates
     * The dates passed in should be in epoch formatted in milliseconds
     * @param fromDate the epoch formatted beginning date
     * @param toDate the epoch formated end date
     * @returns a promise
     */
    function loadOpportunitiesByDate(fromDate, toDate) {
      return ServeOpportunities.ServeDays.query({
        id: Session.exists('userId'),
        from: fromDate / 1000,
        to: toDate / 1000
      }).$promise;
    }

    // Function name says that it loads the next month, but it looks like it uses the #addOneMonth function,
    // which only adds 28 days. This does not guarantee loading the next month.
    // Looks like vm.loadMore and vm.loadText lines could be extracted into a helper method.
    function loadNextMonth() {
      if (vm.groups[0].day !== undefined) {
        vm.loadMore = true;
        vm.loadText = 'Loading...';

        var lastDate = new Date(vm.groups[vm.groups.length - 1].day);
        lastDate.setDate(lastDate.getDate() + 1);

        var newDate = addOneMonth(new Date(lastDate));

        loadOpportunitiesByDate(lastDate.getTime(), newDate.getTime()).then(function(more) {
          if (more.length === 0) {
            $rootScope.$emit('notify', $rootScope.MESSAGES.serveSignupMoreError);
          } else {
            vm.lastDate = formatDate(newDate);
            _.each(more, function(m) {
              vm.groups.push(m);
            });
          }

          vm.loadMore = false;
          vm.loadText = 'Load More';
        }, function(e) {
          // error
          vm.loadMore = false;
          vm.loadText = 'Load More';
        });
      }
    }

    // Is this a ng1.5 build in function? Check child forms for what? Why return an empty string?
    function onBeforeUnload() {
      checkChildForms();
      if ($scope.serveForm.$dirty) {
        return '';
      }
    }

    // This has a lot of nested each methods. Seems like a potential performance pinch point. Also
    // myserve.controller has to know that groups' serveTimes' servingTeams' members have a firstName, a name,
    // a nickName, a lastName, a contactId, and an emailAddress.
    function personUpdateHandler(event, data) {
      vm.groups = angular.copy(vm.original);
      _.each(vm.groups, function(group) {
        _.each(group.serveTimes, function(serveTime) {
          _.each(serveTime.servingTeams, function(servingTeam) {
            _.each(servingTeam.members, function(member) {
              if (member.contactId === data.contactId) {
                member.name = data.nickName === null ? data.firstName : data.nickName;
                member.nickName = data.nickName;
                member.lastName = data.lastName;
                member.emailAddress = data.emailAddress;
              }
            });
          });
        });
      });

      vm.original = angular.copy(vm.groups);
      $rootScope.$broadcast('rerunFilters', vm.groups);
    }

    // Unclear if #showNoOpportunitiesMsg() returns a boolean or not. Can we wrap
    // !filterState.isActive() into a more descriptive helper function?
    function showButton() {
      if (showNoOpportunitiesMsg()) {
        return false;
      } else {
        return !filterState.isActive();
      }
    }

    function showNoOpportunitiesMsg() {
      return vm.groups.length < 1 || totalServeTimesLength() === 0;
    }

    // What does this mean? Start the state change? Set the state change start time?
    // Check child forms for what? WHY DOES THIS METHOD HAVE PARAMS IT DOESN'T USE???
    function stateChangeStart(event, toState, toParams, fromState, fromParams) {
      if ($scope.serveForm !== undefined) {
        checkChildForms();
        if ($scope.serveForm.$dirty) {
          if (!$window.confirm('Are you sure you want to leave this page?')) {
            event.preventDefault();
            return;
          }
        }
      }
    }

    // Is this the total number of service opportunities? Is it the total amount
    // of time spent serving? Formatting makes this difficult to read.
    function totalServeTimesLength() {
      var len = _.reduce(vm.groups, function(total, n) {
        return total + n.serveTimes.length;
      },

      0);
      return len;
    }

    // This hurts to look at and reason about. Why does myserve.controller need
    // to know about groups' serveTimes' servingTeams' groupId, eventId, and the
    // servingTeams' members' contactId and serveRsvp.
    // Also, the efficiency issues with this seem like it would create a performance
    // problem at scale.
    function updateAfterSave(event, data) {
      _.each(vm.groups, function(group) {
        _.each(group.serveTimes, function(serveTime) {
          _.each(serveTime.servingTeams, function(servingTeam) {
            if (servingTeam.groupId === data.groupId) {
              _.each(data.eventIds, function(eventId) {
                if (servingTeam.eventId === eventId) {
                  _.each(servingTeam.members, function(member) {
                    if (member.contactId === data.member.contactId) {
                      member.serveRsvp = angular.copy(data.member.serveRsvp);
                    }
                  });
                }
              });
            }
          });
        });
      });
    }

  }

})();
