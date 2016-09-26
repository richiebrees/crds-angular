import constants from 'crds-constants';
import EndGroupController from '../../../app/group_tool/end_group/endGroup.controller';

describe('EndGroupController', () => {
    let fixture,
        groupService,
        log,
        state,
        rootScope,
        mockProfile,
        profile,
        qApi;

    beforeEach(angular.mock.module(constants.MODULES.GROUP_TOOL));

    beforeEach(angular.mock.module(($provide) => {
    mockProfile = jasmine.createSpyObj('Profile', ['Personal']);
    $provide.value('Profile', mockProfile);
  }));

    beforeEach(inject(function ($injector) {
        log = $injector.get('$log');
        profile = $injector.get('Profile');
        rootScope = $injector.get('$rootScope');
        state = $injector.get('$state');
        groupService = $injector.get('GroupService');
        qApi = $injector.get('$q');

        fixture = new EndGroupController(groupService, state, log, rootScope);
    }));

    it('should call endgroup when form is valid', () => {
        fixture.groupId = 123;
        fixture.model = { reasonEndedId: 1 };
        fixture.endGroupForm = {$valid: true};

        let deferred = qApi.defer();
        spyOn(groupService, 'endGroup').and.callFake(function(groupId, reasonEndedId) {
          return(deferred.promise);
        });

        fixture.endGroup();

        expect(groupService.endGroup).toHaveBeenCalledWith(123, 1);

    });

    it('shoud not call endgroup when form is invalid', () => {
        fixture.groupId = 123;
        fixture.model = { reasonEndedId: 1 };
        fixture.endGroupForm = {$valid: false};

        let deferred = qApi.defer();
        spyOn(groupService, 'endGroup').and.callFake(function(groupId, reasonEndedId) {
          return(deferred.promise);
        });

        fixture.endGroup();
        expect(groupService.endGroup).not.toHaveBeenCalled();
    })
});