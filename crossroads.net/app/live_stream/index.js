
import CONSTANTS from 'crds-constants';
import liveStreamRouter from './live_stream.routes';
import StreamspotService from './services/streamspot.service';
import ReminderService from './services/reminder.service';

export default angular
  .module(CONSTANTS.MODULES.LIVE_STREAM, [CONSTANTS.MODULES.CORE, CONSTANTS.MODULES.COMMON])
  .config(liveStreamRouter)
  .service('StreamspotService', StreamspotService)
  .service('ReminderService', ReminderService)
  ;

import landing from './landing';
import countdown from './countdown';
import streamingReminder from './streaming_reminder';