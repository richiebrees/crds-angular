
import constants from 'crds-constants';
import GroupDetailParticipantCardController from '../../../../../app/group_tool/group_detail/participants/participant_card/groupDetail.participant.card.controller';

describe('GroupDetailParticipantCardController', () => {
    let fixture,
        imageService;

    beforeEach(angular.mock.module(constants.MODULES.GROUP_TOOL));

    beforeEach(inject(function($injector) {
        imageService = $injector.get('ImageService');

        fixture = new GroupDetailParticipantCardController(imageService);
    }));
    
    describe('$onInit() function', () => {
        it('should set properties', () => {

          fixture.$onInit();

          expect(fixture.defaultProfileImageUrl).toBeDefined();
          expect(fixture.defaultProfileImageUrl).toEqual(imageService.DefaultProfileImage);
        });
    });

    describe('invokeDeleteAction() function', () => {
        it('should invoke action', () => {
          fixture.deleteAction = jasmine.createSpy('deleteAction');

          var participant = {id: 123};

          fixture.invokeDeleteAction(participant);

          expect(fixture.deleteAction).toHaveBeenCalledWith({participant: participant});
        });
    });
    
});