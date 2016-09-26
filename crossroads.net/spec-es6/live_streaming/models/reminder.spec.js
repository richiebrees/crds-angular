
import Reminder from '../../../app/live_stream/models/reminder';

describe('Streaming Reminder Model', () => {
  it('should be valid', () => {
    let reminder = new Reminder();

    reminder.day = '9/22/2016';
    reminder.time = '1:56 pm EDT';
    reminder.type = 'email';
    reminder.email = 'test@test.com';

    expect(reminder.isValid()).toBe(true);
  })
})