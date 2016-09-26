import Countdown from '../models/countdown';

export default class CountdownController {
  constructor($rootScope, StreamspotService, ReminderService) {
    this.rootScope = $rootScope;
    this.streamspotService = StreamspotService;
    this.countdown = new Countdown();

    this.reminderService = ReminderService;
  }

  $onInit() {
    this.rootScope.$on('nextEvent', (e, event) => {
      this.event = event;
      this.parseEvent();
    })
  }

  openReminder() {
    this.reminderService.open();
  }

  parseEvent() {
    this.isCountdown    = this.event.isUpcoming();
    this.isBroadcasting = this.event.isBroadcasting();

    let duration = moment.duration(
      +this.event.start - +moment(),
      'milliseconds'
    );
    this.countdown.days    = this.pad(duration.days());
    this.countdown.hours   = this.pad(duration.hours());
    this.countdown.minutes = this.pad(duration.minutes());
    this.countdown.seconds = this.pad(duration.seconds());
    this.displayCountdown  = true;
  }

  pad(value) {
    return value < 10 ? `0${value}`: `${value}`;
  }
}