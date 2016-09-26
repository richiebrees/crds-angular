
import constants from 'crds-constants';
import GroupMessageController from '../../../app/group_tool/group_message/groupMessage.controller';

describe('GroupMessageController', () => {
  let fixture,
    rootScope;

  beforeEach(angular.mock.module(constants.MODULES.GROUP_TOOL));

  beforeEach(inject(function ($injector) {
    rootScope = $injector.get('$rootScope');
    rootScope.MESSAGES = {
      generalError: 'oh no!'
    };
    fixture = new GroupMessageController(rootScope);
    fixture.person = { id: 123 };
  }));

  describe('$onInit function', () => {
    it('should properly initialize email message label if not specified and required == undefined', () => {
      fixture.emailMessageRequired = undefined;
      fixture.emailMessageLabel = undefined;

      fixture.$onInit();

      expect(fixture.emailMessageRequired).toEqual(false);
      expect(fixture.emailMessageLabel).toEqual('Your Message (Optional)');
    });

    it('should properly initialize email message label if not specified and required == null', () => {
      fixture.emailMessageRequired = null;
      fixture.emailMessageLabel = null;

      fixture.$onInit();

      expect(fixture.emailMessageRequired).toEqual(false);
      expect(fixture.emailMessageLabel).toEqual('Your Message (Optional)');
    });

    it('should properly initialize email message label if not specified and required == false', () => {
      fixture.emailMessageRequired = false;
      fixture.emailMessageLabel = '';

      fixture.$onInit();

      expect(fixture.emailMessageRequired).toEqual(false);
      expect(fixture.emailMessageLabel).toEqual('Your Message (Optional)');
    });

    it('should properly initialize email message label if not specified and required == true', () => {
      fixture.emailMessageRequired = true;
      fixture.emailMessageLabel = undefined;

      fixture.$onInit();

      expect(fixture.emailMessageRequired).toEqual(true);
      expect(fixture.emailMessageLabel).toEqual('Your Message');
    });
  });

  describe('submit() function', () => {
    let form;
    beforeEach(() => {
      form = {
        $valid: true
      };
    });

    it('should invoke action if form is valid', () => {
      fixture.submitAction = jasmine.createSpy('submitAction');
      fixture.submit(form);

      expect(fixture.submitAction).toHaveBeenCalledWith({ person: fixture.person });
    });

    it('should not invoke action if form is invalid', () => {
      form.$valid = false;

      fixture.submitAction = jasmine.createSpy('submitAction');
      rootScope.$emit = jasmine.createSpy('$emit');
      fixture.submit(form);

      expect(fixture.submitAction).not.toHaveBeenCalled();
      expect(rootScope.$emit).toHaveBeenCalledWith('notify', rootScope.MESSAGES.generalError);
    });
  });

  describe('cancel() function', () => {
    it('should invoke action', () => {
      fixture.cancelAction = jasmine.createSpy('cancelAction');
      fixture.cancel();

      expect(fixture.cancelAction).toHaveBeenCalledWith({ person: fixture.person });
    });
  });

});