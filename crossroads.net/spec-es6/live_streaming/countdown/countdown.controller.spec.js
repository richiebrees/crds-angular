
import constants from 'crds-constants';
import CountdownController from '../../../app/live_stream/countdown/countdown.controller';
import Event from '../../../app/live_stream/models/event';

describe('Countdown Controller', () => {
  let fixture,
    rootScope;

  beforeEach(angular.mock.module(constants.MODULES.GROUP_TOOL));

  beforeEach(inject(function ($injector) {
    rootScope = $injector.get('$rootScope');

    fixture = new CountdownController(rootScope);
  }));

  it('should return padded string for numbers less than 10', () => {
    expect(fixture.pad(1)).toBe('01');
    expect(fixture.pad(10)).toBe('10');
  })

  it('should populate the countdown object', () => {
    let start = moment().add({ 'days': 2 }).format('YYYY-MM-DD HH:mm:ss');
    let end = moment().add({ 'days': 2 }).format('YYYY-MM-DD HH:mm:ss');

    fixture.event = new Event('title', start, end);
    fixture.parseEvent();

    expect(fixture.countdown.days).toBe('01');
    expect(fixture.countdown.hours).toBe('23');
    expect(fixture.countdown.minutes).toBe('59');
  })

})