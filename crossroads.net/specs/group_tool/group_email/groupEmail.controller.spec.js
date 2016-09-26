
import constants from 'crds-constants';
import GroupEmailController from '../../../app/group_tool/group_email/groupEmail.controller';

describe('GroupEmailController', () => {
  let fixture,
      rootScope;

  beforeEach(angular.mock.module(constants.MODULES.GROUP_TOOL));

  beforeEach(inject(function($injector) {
    fixture = new GroupEmailController();
  }));

  describe('constructor($rootScope) function', () => {
    it('should default to empty string', () => {
      expect(fixture.header).toEqual('');
    });

    it('should not be empty string', () => {
      fixture.header = 'header';
      expect(fixture.header).toEqual('header');
    });
  });
});
