
import CONSTANTS from 'crds-constants';
import MessageService from '../../../app/group_tool/services/message.service';
import GroupMessage from '../../../app/group_tool/model/groupMessage';

describe('Group Tool Message Service', () => {
  let fixture,
    log,
    resource,
    deferred,
    httpBackend;

  const endpoint = `${window.__env__['CRDS_API_ENDPOINT']}api`;

  beforeEach(angular.mock.module(CONSTANTS.MODULES.GROUP_TOOL));

  beforeEach(inject(function($injector) {
    log = $injector.get('$log');
    resource = $injector.get('$resource');
    deferred = $injector.get('$q');
    httpBackend = $injector.get('$httpBackend');

    fixture = new MessageService(log, resource, deferred);
  }));

  afterEach(() => {
    httpBackend.verifyNoOutstandingExpectation();
    httpBackend.verifyNoOutstandingRequest();
  });

  describe('sendLeaderMessage(message) function', () => {
    let message;
    
    beforeEach(()=> {
      message = new GroupMessage();
      message.groupId = 1;
      message.subject = '';
      message.body = 'hi my name is';
    });

    it('it works', () => {
      httpBackend.expectPOST(`${endpoint}/grouptool/${message.groupId}/leadermessage`, message).
                  respond(200, {});

      var promise = fixture.sendLeaderMessage(message);
      httpBackend.flush();
      expect(promise.$$state.status).toEqual(1);
    });
  });
});
