import CONSTANTS from 'crds-constants';
import StreamspotService from '../../../app/live_stream/services/streamspot.service';
import Event from '../../../app/live_stream/models/event';

describe('Live Streaming Streamspot Service', () => {
  let resource,
      httpBackend,
      service,
      authRequestHandler;

  let events = {
    "success": true,
    "data": {
      "count": 3,
      "events": [
        {
          "start": moment().tz(moment.tz.guess()).add(1, 'hour').format('YYYY-MM-DD H:mm:ss'),
          "end": moment().tz(moment.tz.guess()).add(2, 'hour').format('YYYY-MM-DD H:mm:ss'),
          "title": "Saturday Rehearsal Upcoming"
        },
        {
          "start": moment().tz(moment.tz.guess()).subtract(1, 'hour').format('YYYY-MM-DD H:mm:ss'),
          "end": moment().tz(moment.tz.guess()).add(1, 'hour').format('YYYY-MM-DD H:mm:ss'),
          "title": "Saturday Rehearsal Broadcasting"
        },
        {
          "start": moment().tz(moment.tz.guess()).subtract(2, 'hour').format('YYYY-MM-DD H:mm:ss'),
          "end": moment().tz(moment.tz.guess()).subtract(1, 'hour').format('YYYY-MM-DD H:mm:ss'),
          "title": "Saturday Rehearsal Done"
        }
      ]
    }
  };

  const eventsEndpoint = `${__STREAMSPOT_ENDPOINT__}broadcaster/${__STREAMSPOT_SSID__}/events`

  beforeEach(angular.mock.module(CONSTANTS.MODULES.LIVE_STREAM));

  beforeEach(inject(function($injector) {
    resource    = $injector.get('$resource');
    httpBackend = $injector.get('$httpBackend');

    service = new StreamspotService(resource);
  }))

  afterEach(() => {
    httpBackend.verifyNoOutstandingExpectation();
    httpBackend.verifyNoOutstandingRequest();
  });

  describe('Events', () => {
    it('should get events', () => {
      httpBackend.expectGET(eventsEndpoint).respond(200, events);
      httpBackend.flush();
    })

    it('should return upcoming events', () => {
      httpBackend.expectGET(eventsEndpoint).respond(200, events);

      httpBackend.flush();

      expect(service.parseEvents() instanceof Array).toBeTruthy();

      let titles = service.parseEvents().map((event) => { return event.title });
      expect(titles).not.toContain('Saturday Rehearsal Done')

      expect(_.first(service.parseEvents()).title).toBe('Saturday Rehearsal Broadcasting');
      
    });

    it('should return events, grouped by DOY', () => {
      httpBackend.expectGET(eventsEndpoint).respond(200, events);
      httpBackend.flush();
      let results = service.getEventsByDate();

      let idx = parseInt(Object.keys(results)[0]);
      let event = _.first(results[idx]);

      expect(event instanceof Object).toBeTruthy();
      expect(idx).toEqual(jasmine.any(Number));
      expect(event.title).toBe('Saturday Rehearsal Broadcasting');
    });
  })
})