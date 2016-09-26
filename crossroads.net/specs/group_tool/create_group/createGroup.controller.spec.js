import constants from 'crds-constants';
import CreateGroupController from '../../../app/group_tool/create_group/createGroup.controller'

describe('CreateGroupController', () => {
    let fixture,
        participantService,
        location,
        log,
        createGroupService,
        mockProfile;

    beforeEach(angular.mock.module(constants.MODULES.GROUP_TOOL));

    beforeEach(angular.mock.module(($provide)=> {
      mockProfile = jasmine.createSpyObj('Profile', ['Personal']);
      $provide.value('Profile', mockProfile);
    }));

    beforeEach(inject(($injector)=> {
      participantService = $injector.get('ParticipantService');
      location = $injector.get('$location');
      log = $injector.get('$log');
      createGroupService = $injector.get('CreateGroupService');
      spyOn(particpantService, 'get').and.returnValue(
      {
          $promise: {
            then: (success, error) => {
                success({});
            }
        },
        $resolved:true
      });
      fixture = new CreateGroupController(participantService, localStorage, log, createGroupService);

    }));

    // it('should call participant service', () => {
    //   fixture.$onInit();
    //   expect(participantService.get).toHaveBennCalled();
    // });


});