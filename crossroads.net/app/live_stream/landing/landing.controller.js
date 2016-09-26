var WOW = require('wow.js/dist/wow.min.js');

export default class LandingController {
  /*@ngInject*/
  constructor($state, $rootScope, StreamspotService) {
    this.state = $state;
    this.rootScope = $rootScope;
    this.streamspotService = StreamspotService

    new WOW({
      offset: 100,
      mobile: false
    }).init();
  }

  $onInit() {
    
  }
}