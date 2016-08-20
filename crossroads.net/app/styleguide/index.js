var app = angular.module("crossroads");
require('./styleguide.html');
require('./groups-new.html');
//require('../preloader/preloader.html');
app.controller("StyleguideCtrl", require("./styleguide_controller"));
