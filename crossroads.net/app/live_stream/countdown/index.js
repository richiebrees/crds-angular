import CONSTANTS from 'crds-constants';
import countdownComponent from './countdown.component';
import html from './countdown.html';

export default angular.module(CONSTANTS.MODULES.LIVE_STREAM)
  .component('countdown', countdownComponent());