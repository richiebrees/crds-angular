'use strict';
(function () {
    angular.module("crdsProfile").controller('crdsProfileCtrl', ['$rootScope','Profile', 'Lookup', '$q', '$log','$scope',  ProfileController]);

    function ProfileController($rootScope, Profile, Lookup, $q, $log, $scope) {
        
        var _this = this;

        $scope.pwprocess = function () {
            $log.debug("pwprocess function launched");
            if ($scope.pwprocessing == "SHOW") {
                $scope.pwprocessing = "HIDE";
                $scope.inputType = 'text';
            }
            else {
                $scope.pwprocessing = "SHOW";
                $scope.inputType = 'password';
            }
            $log.debug($scope.pwprocessing);
        }
      
	    _this.initAccount = function () {
            _this.account = Profile.Account.get();
            _this.password = new Profile.Password();
        }

	    _this.saveAccount = function (form) {
	        _this.form = form;
            $log.debug(_this.account.EmailNotifications);

            if (_this.password.password) {
                $log.debug("Save the password first!");
                _this.password.$save(function () {
                    $log.debug("password saved succesfully!");
                    $rootScope.$emit('notify.error', $rootScope.MESSAGES.profileUpdated);
                    _this.password.password = null;
                }, function () {
                    _this.password.password = null;
                    $log.error("did not save the password successfully. You need to have a Mobile Phone number set.");
                });
            }

            if (_this.form.account_form.password.$error.minlength) {
                $log.debug("Password is too short!");
                $rootScope.$emit('notify.error', $rootScope.MESSAGES.generalError);
                throw "password length needs to be > 5"
                return
            }

            _this.account.$update(function () {
                $log.debug("save successful");
                
            }, function () {
                $log.error("save unsuccessful");
            });
        }
    }

})()
