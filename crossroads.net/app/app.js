require('./events');
require('./childcare');
require('./mp_tools');
require('../lib/select.css');

(function() {
  'use strict()';

  var MODULE = 'crossroads';
  var constants = require('./constants');

  angular.module(constants.MODULES.CROSSROADS, [
      constants.MODULES.CORE,
      constants.MODULES.COMMON,
      constants.MODULES.GIVE,
      constants.MODULES.MEDIA,
      constants.MODULES.MPTOOLS,
      constants.MODULES.PROFILE,
      constants.MODULES.SEARCH,
      constants.MODULES.TRIPS,
      constants.MODULES.SIGNUP,
      constants.MODULES.CHILDCARE
   ]);

  angular.module(constants.MODULES.CROSSROADS).config(require('./routes'));

  require('./signup');
  require('./styleguide');
  require('./thedaily');
  require('./explore');
  require('./gotrips');
  require('./my_serve');
  require('./volunteer_signup');
  require('./volunteer_application');
  require('./giving_history');

})();
