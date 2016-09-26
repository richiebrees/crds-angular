
export default class Reminder {
  constructor() {
    this.formattedDay = '';
    this.day          = '';
    this.time         = '';
    this.phone        = '';
    this.email        = '';
    this.type         = 'phone';
    this.startDate    = '';
    this.isDayValid;
    this.isTimeValid;
    this.isPhoneValid;
    this.isEmailValid;
  }

  isValid() {
    return this.day.length > 0 && this.time.length > 0 && this.type.length > 0 && (this.phone.length > 0 || this.email.length > 0);
  }
}
