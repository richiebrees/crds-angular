
import CONSTANTS from 'crds-constants';
import ParticipantService from './services/participant.service';
import GroupService from './services/group.service';
import CreateGroupService from './services/createGroup.service';
import groupToolRouter from './groupTool.routes';
import groupToolFormlyBuilderConfig from './groupTool.formlyConfig';
import './formlyWrappers/createGroupWrapper.html';
import './formlyWrappers/checkboxdescription.html';
import './formlyWrappers/createGroupProfilePicture.html';
import MessageService from './services/message.service';

export default angular.
  module(CONSTANTS.MODULES.GROUP_TOOL, [ CONSTANTS.MODULES.CORE, CONSTANTS.MODULES.COMMON,
                                          CONSTANTS.MODULES.FORMLY_BUILDER ]).
  config(groupToolRouter).
  config(groupToolFormlyBuilderConfig).
  service('ParticipantService', ParticipantService).
  service('GroupService', GroupService).
  service('CreateGroupService', CreateGroupService).
  service('MessageService', MessageService)
  ;

import myGroups from './my_groups';
import createGroup from './create_group';
import groupDetail from './group_detail';
import groupMessage from './group_message';
import groupSearch from './group_search';
import groupSearchResults from './group_search_results';
import groupInvitation from './group_invitation';
