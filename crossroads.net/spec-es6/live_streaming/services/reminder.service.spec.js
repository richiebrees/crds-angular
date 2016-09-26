import CONSTANTS from 'crds-constants';
import ReminderService from '../../../app/live_stream/services/reminder.service';
import Reminder from '../../../app/live_stream/models/reminder';

describe('Reminder Service', () => {
  let service,
      reminder,
      http,
      modal,
      httpBackend;

  const reminderEndpoint = `${__API_ENDPOINT__}`;

  beforeEach(angular.mock.module(CONSTANTS.MODULES.LIVE_STREAM));

  beforeEach(inject(function($injector) {
    http        = $injector.get('$http');
    modal       = $injector.get('$modal');
    httpBackend = $injector.get('$httpBackend');

    service = new ReminderService(http, modal);

    reminder = new Reminder();
    reminder.day = '9/22/2016';
    reminder.time = '1:56pm EST';
    reminder.isDayValid = true;
    reminder.isTimeValid = true;

  }))

  afterEach(() => {
    httpBackend.verifyNoOutstandingExpectation();
    httpBackend.verifyNoOutstandingRequest();
  });

  describe('Reminder', () => {
    it('should send email notification', () => {
      let url = `${reminderEndpoint}api/sendEmailReminder`;
      let result = {}
      
      reminder.type = 'email';
      reminder.email = 'test@test.com';
      reminder.isEmailValid = true;

      expect(reminder.isValid()).toBe(true);

      service.send(reminder);

      httpBackend.expectPOST(url).respond(200, result);
      httpBackend.flush();
    });

    /**
     * @TODO api endpoint not working as of 9/23/2016
     */
    // it('should send text notification', () => {
    //   let url = `${reminderEndpoint}api/sendTextMessageReminder`;
    //   let result = {}
      
    //   reminder.type = 'phone';
    //   reminder.phone = '1231231234';
    //   reminder.isPhoneValid = true;

    //   expect(reminder.isValid()).toBe(true);

    //   service.send(reminder);
      
    //   httpBackend.expectPOST(url).respond(200, result);
    //   httpBackend.flush();
    // });
  })
});