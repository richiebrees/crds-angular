import Event from '../../../app/live_stream/models/event';

describe('Live Stream Event', () => {
  let upcoming,
      broadcasting,
      done,
      futureEvent,
      currentEvent,
      pastEvent;

  beforeEach(() => {
    upcoming = {
      "start": moment().tz(moment.tz.guess()).add(1, 'hour').format('YYYY-MM-DD H:mm:ss'),
      "end": moment().tz(moment.tz.guess()).add(2, 'hour').format('YYYY-MM-DD H:mm:ss'),
      "title": "Saturday Rehearsal"
    },
    broadcasting = {
      "start": moment().tz(moment.tz.guess()).subtract(1, 'hour').format('YYYY-MM-DD H:mm:ss'),
      "end": moment().tz(moment.tz.guess()).add(1, 'hour').format('YYYY-MM-DD H:mm:ss'),
      "title": "Saturday Rehearsal"
    };
    done = {
      "start": moment().tz(moment.tz.guess()).subtract(2, 'hour').format('YYYY-MM-DD H:mm:ss'),
      "end": moment().tz(moment.tz.guess()).subtract(1, 'hour').format('YYYY-MM-DD H:mm:ss'),
      "title": "Saturday Rehearsal"
    }

    futureEvent  = Event.build(upcoming);
    currentEvent = Event.build(broadcasting);
    pastEvent    = Event.build(done);
  })

  describe('creation', () => {
    it('should have the following values when created with json', () => {
      expect(futureEvent.title).toEqual(upcoming.title);
    })

    it('should create an event', () => {
      event = new Event(upcoming.title, upcoming.start, upcoming.end);

      expect(event.title).toEqual(upcoming.title);
    })
  })

  describe('validity', () => {
    it('should be a valid upcoming event', () => {
      expect(futureEvent.isUpcoming()).toBe(true);
      expect(currentEvent.isUpcoming()).toBe(false);
      expect(pastEvent.isUpcoming()).toBe(false);
    })

    it('should be a valid broadcasting event', () => {
      expect(futureEvent.isBroadcasting()).toBe(false);
      expect(currentEvent.isBroadcasting()).toBe(true);
      expect(pastEvent.isBroadcasting()).toBe(false);
    })
  })
})