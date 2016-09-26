import constants from 'crds-constants';
import CreateGroupPreviewController from '../../../../app/group_tool/create_group/preview/createGroup.preview.controller';
describe('CreateGroupPreviewController', () => {
  let fixture,
    groupService,
    createGroupService,
    group,
    imageService,
    state,
    log,
    rootScope,
    api;

  var mockProfile;

  beforeEach(angular.mock.module(constants.MODULES.GROUP_TOOL));

  beforeEach(angular.mock.module(($provide) => {
    mockProfile = jasmine.createSpyObj('Profile', ['Personal']);
    $provide.value('Profile', mockProfile);
  }));

  beforeEach(inject(($injector) => {
    groupService = $injector.get('GroupService');
    createGroupService = $injector.get('CreateGroupService');
    group = $injector.get('Group');
    imageService = $injector.get('ImageService');
    state = $injector.get('$state');
    log = $injector.get('$log');
    rootScope = $injector.get('$rootScope');
    api = $injector.get('$q');

    fixture = new CreateGroupPreviewController(groupService, createGroupService, group, imageService, state, log, rootScope);

  }));

  describe('save', () => {
    it('should call save', () => {
      let deferred = api.defer();
      deferred.resolve({});

      spyOn(groupService, 'saveCreateGroupForm').and.callFake(function () {
        return deferred.promise;
      });

      spyOn(state, 'go').and.callFake(function() {});
      spyOn(createGroupService, 'mapToSmallGroup').and.callFake(function() {
      return {};
      });

      fixture.save();
      expect(fixture.groupService.saveCreateGroupForm).toHaveBeenCalledWith(fixture.groupData);
    })
  });

  describe('saveEdits', () => {
    it('should call save for edits', () => {
      let deferred = api.defer();
      deferred.resolve({});

      spyOn(groupService, 'saveEditGroupForm').and.callFake( function() {
        return deferred.promise;
      });

      spyOn(state, 'go').and.callFake(function() {});
      spyOn(createGroupService, 'mapToSmallGroup').and.callFake(function() {
        return {};
      });

      fixture.saveEdits();
      expect(fixture.groupService.saveEditGroupForm).toHaveBeenCalledWith(fixture.groupData);
    })
  });
});

