import Event from '../models/event';

export default class StreamspotService {

  constructor($resource, $rootScope) {
    this.resource = $resource
    this.headers = {
      'Content-Type': 'application/json',
      'x-API-Key': __STREAMSPOT_API_KEY__
    };
    this.url  = __STREAMSPOT_ENDPOINT__;
    this.ssid = __STREAMSPOT_SSID__;
    this.rootScope = $rootScope;
    this.events = this.getEvents();
  }

  broadcast() {
    let event = _(this.parseEvents()).first();

    // dispatch updates
    this.rootScope.$broadcast('isBroadcasting', event.isBroadcasting());
    this.rootScope.$broadcast('nextEvent', event);
  }

  getEvents() {
    let url = `${this.url}broadcaster/${this.ssid}/events`;

    return this.resource(url, {}, { get: { method: 'GET', headers: this.headers } })
      .get()
      .$promise
      .then((response) => {
        this.eventResponse = response.data.events;
        let events = this.parseEvents();
        if (events.length > 0) {
          this.broadcast();
          setInterval(() => {
            this.broadcast()
          }, 1000)
        }
        return events;
      })
  }

  parseEvents() {
    return _
      .chain(this.eventResponse)
      .sortBy('start')
      .map((object) => {
        let event = Event.build(object);
        if (event.isBroadcasting() || event.isUpcoming()) {
          return event;
        }
      })
      .compact()
      .value();
  }

  getEventsByDate() {
      return _.chain(this.parseEvents())
        .groupBy('dayOfYear')
        .value();
  }

  get(url) {
    return this.resource(url, {}, { get: { method: 'GET', headers: this.headers } })
      .get().map(response => response.json());
  }

  getBroadcaster() {
    let url = `${this.url}broadcaster/${this.ssid}?players=true`;
    return this.get(url);
  }

  getPlayers() {
    let url = `${this.url}broadcaster/${this.ssid}/players`;
    return this.get(url);
  }

  getBroadcasting() {
    let url = `${this.url}broadcaster/${this.ssid}/broadcasting`;
    return this.get(url);
  }

  handleError(error) {
    console.error('An error occurred');
    return Promise.reject(error);
  }
}