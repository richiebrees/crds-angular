
import constants from 'crds-constants';
import GroupDetailParticipantsController from '../../../../app/group_tool/group_detail/participants/groupDetail.participants.controller';
import Participant from '../../../../app/group_tool/model/participant';
import GroupMessage from '../../../../app/group_tool/model/groupMessage';

describe('GroupDetailParticipantsController', () => {
    let fixture,
        groupService,
        imageService,
        state,
        rootScope,
        log,
        participantService,
        qApi,
        messageService;

    var mockProfile;

    beforeEach(angular.mock.module(constants.MODULES.GROUP_TOOL));

      beforeEach(angular.mock.module(($provide)=> {
      mockProfile = jasmine.createSpyObj('Profile', ['Personal']);
      $provide.value('Profile', mockProfile);
    }));

    beforeEach(inject(function($injector) {
        groupService = $injector.get('GroupService');
        imageService = $injector.get('ImageService');
        state = $injector.get('$state');
        rootScope = $injector.get('$rootScope');
        log = $injector.get('$log');
        participantService = $injector.get('ParticipantService');
        qApi = $injector.get('$q');
        messageService = $injector.get('MessageService');

        state.params = {
          groupId: 123
        };

        fixture = new GroupDetailParticipantsController(groupService, imageService, state, log, participantService, rootScope, messageService);
    }));

    describe('the constructor', () => {
        it('should initialize properties', () => {
            expect(fixture.groupId).toEqual(state.params.groupId);
            expect(fixture.ready).toBeFalsy();
            expect(fixture.error).toBeFalsy();
            expect(fixture.isListView()).toBeTruthy();
            expect(fixture.processing).toBeFalsy();
        });
    });

    describe('set/get view functions', () => {
      it('should set and get List view', () => {
        fixture.setListView();
        expect(fixture.isListView()).toBeTruthy();
        expect(fixture.isDeleteView()).toBeFalsy();
        expect(fixture.isEditView()).toBeFalsy();
        expect(fixture.isEmailView()).toBeFalsy();
      });

      it('should set and get Email view', () => {
        fixture.setEmailView();
        expect(fixture.isEmailView()).toBeTruthy();
        expect(fixture.isListView()).toBeFalsy();
        expect(fixture.isDeleteView()).toBeFalsy();
        expect(fixture.isEditView()).toBeFalsy();
      });

      it('should set and get Delete view', () => {
        fixture.setDeleteView();
        expect(fixture.isDeleteView()).toBeTruthy();
        expect(fixture.isListView()).toBeFalsy();
        expect(fixture.isEditView()).toBeFalsy();
        expect(fixture.isEmailView()).toBeFalsy();
      });

      it('should set and get Edit view', () => {
        fixture.setEditView();
        expect(fixture.isEditView()).toBeTruthy();
        expect(fixture.isListView()).toBeFalsy();
        expect(fixture.isDeleteView()).toBeFalsy();
        expect(fixture.isEmailView()).toBeFalsy();
      });

    });

    describe('finishChangeParticipantRole() function', () => {
      it('should return to list view', () => {
        let participant = new Participant();
        fixture.roleParticipant = participant;
        fixture.setRoleView();
        fixture.finishChangeParticipantRole();

        expect(fixture.isListView()).toBeTruthy();
        expect(fixture.roleParticipant).not.toBeDefined();
      });
    });

    describe('cancelChangeParticipantRole() function', () => {
      it('should return to list view', () => {
        let participant = new Participant();
        fixture.roleParticipant = participant;
        fixture.setRoleView();
        fixture.cancelChangeParticipantRole();

        expect(fixture.isEditView()).toBeTruthy();
        expect(fixture.roleParticipant).not.toBeDefined();
      });
    });

    describe('beginRemoveParticipant() function', () => {
      it('should set properties', () => {
        let participant = new Participant();
        fixture.beginRemoveParticipant(participant);
        expect(fixture.deleteParticipant).toBe(participant);
        expect(fixture.deleteParticipant.message).toEqual('');
        expect(fixture.isDeleteView()).toBeTruthy();
      });
    });

    describe('cancelRemoveParticipant() function', () => {
      it('should unset properties', () => {
        let participant = new Participant();
        participant.message = 'delete';
        fixture.cancelRemoveParticipant(participant);
        expect(fixture.deleteParticipant).not.toBeDefined();
        expect(participant.message).not.toBeDefined();
        expect(fixture.isEditView()).toBeTruthy();
      });
    });

    describe('removeParticipant() function', () => {
      it('should remove participant successfully', () => {
        let deferred = qApi.defer();
        deferred.resolve({});

        spyOn(groupService, 'removeGroupParticipant').and.callFake(function() {
          return(deferred.promise);
        });

        let participant = new Participant({groupParticipantId: 999});

        let participants = [
          new Participant({nickName: 'f1', lastName: 'l1', groupRoleId: constants.GROUP.ROLES.MEMBER, groupParticipantId: 987}),
          new Participant({nickName: 'f2', lastName: 'l2', groupRoleId: constants.GROUP.ROLES.LEADER, groupParticipantId: 654}),
          new Participant({nickName: 'f3', lastName: 'l3', groupRoleId: constants.GROUP.ROLES.APPRENTICE, groupParticipantId: participant.groupParticipantId})
        ];
        fixture.data = participants;

        spyOn(rootScope, '$emit').and.callFake(() => { });

        fixture.setDeleteView();
        fixture.removeParticipant(participant);
        rootScope.$digest();

        expect(groupService.removeGroupParticipant).toHaveBeenCalledWith(state.params.groupId, participant);
        expect(fixture.data.length).toEqual(2);
        expect(fixture.data.find((p) => { return p.groupParticipantId === participant.groupParticipantId; })).not.toBeDefined();
        expect(fixture.processing).toBeFalsy();
        expect(fixture.ready).toBeTruthy();
        expect(fixture.isListView()).toBeTruthy();
        expect(fixture.deleteParticipant).not.toBeDefined();
        expect(rootScope.$emit).toHaveBeenCalledWith('notify', rootScope.MESSAGES.groupToolRemoveParticipantSuccess);
      });

      it('should set error state if problem deleting participant', () => {
        let deferred = qApi.defer();
        deferred.reject({status: 500, statusText: 'Oh no!'});

        spyOn(groupService, 'removeGroupParticipant').and.callFake(function() {
          return(deferred.promise);
        });

        spyOn(rootScope, '$emit').and.callFake(() => { });

        let participant = new Participant({groupParticipantId: 999});

        fixture.setDeleteView();
        fixture.removeParticipant(participant);
        rootScope.$digest();

        expect(groupService.removeGroupParticipant).toHaveBeenCalledWith(state.params.groupId, participant);
        expect(fixture.processing).toBeFalsy();
        expect(fixture.ready).toBeTruthy();
        expect(fixture.error).toBeTruthy();
        expect(fixture.isDeleteView()).toBeTruthy();
        expect(rootScope.$emit).toHaveBeenCalledWith('notify', rootScope.MESSAGES.groupToolRemoveParticipantFailure);
      });
    });

    describe('$onInit() function', () => {
        it('should get group participants and set image url', () => {
          let myParticipant = {
            ParticipantId: 123
          };

          let deferredParticipant = qApi.defer();
          deferredParticipant.resolve(myParticipant);

          let participants = [
            new Participant({nickName: 'f1', lastName: 'l1', groupRoleId: constants.GROUP.ROLES.MEMBER, participantId: 99}),
            new Participant({nickName: 'f2', lastName: 'l2', groupRoleId: constants.GROUP.ROLES.LEADER, participantId: myParticipant.ParticipantId}),
            new Participant({nickName: 'f3', lastName: 'l3', groupRoleId: constants.GROUP.ROLES.APPRENTICE, participantId: 88})
          ];
          let deferredGroupParticipants = qApi.defer();
          deferredGroupParticipants.resolve(participants);

          spyOn(participantService, 'get').and.callFake(function() {
            return(deferredParticipant.promise);
          });

          spyOn(groupService, 'getGroupParticipants').and.callFake(function() {
            return(deferredGroupParticipants.promise);
          });

          fixture.$onInit();
          rootScope.$digest();

          expect(participantService.get).toHaveBeenCalled();
          expect(groupService.getGroupParticipants).toHaveBeenCalledWith(state.params.groupId);

          expect(fixture.data).toBeDefined();
          expect(fixture.data.length).toEqual(participants.length);

          // Verify that data is sorted
          expect(fixture.data[0].participantId).toEqual(participants[1].participantId);
          expect(fixture.data[0].me).toBeTruthy();
          expect(fixture.data[1].participantId).toEqual(participants[2].participantId);
          expect(fixture.data[1].me).toBeFalsy();
          expect(fixture.data[2].participantId).toEqual(participants[0].participantId);
          expect(fixture.data[2].me).toBeFalsy();

          // Verify image URL on each
          fixture.data.forEach(function(p) {
            expect(p.imageUrl).toBeDefined();
            expect(p.imageUrl).toEqual(`${imageService.ProfileImageBaseURL}${p.contactId}`);
          }, this);

          expect(fixture.ready).toBeTruthy();
          expect(fixture.error).toBeFalsy();
        });

        it('should set error state if trouble getting my participant', () => {
          let deferred = qApi.defer();
          let error = {
            status: 500,
            statusText: 'oops'
          };
          deferred.reject(error);

          spyOn(participantService, 'get').and.callFake(function() {
            return(deferred.promise);
          });

          spyOn(groupService, 'getGroupParticipants').and.callFake(function() {
            return;
          });

          fixture.$onInit();
          rootScope.$digest();

          expect(participantService.get).toHaveBeenCalled();
          expect(groupService.getGroupParticipants).not.toHaveBeenCalled();
          expect(fixture.ready).toBeTruthy();
          expect(fixture.error).toBeTruthy();
        });

        it('should set error state if trouble getting group participants', () => {
           let myParticipant = {
            ParticipantId: 123
          };

          let deferredParticipant = qApi.defer();
          deferredParticipant.resolve(myParticipant);

          let deferred = qApi.defer();
          let error = {
            status: 500,
            statusText: 'oops'
          };
          deferred.reject(error);

          spyOn(participantService, 'get').and.callFake(function() {
            return(deferredParticipant.promise);
          });

          spyOn(groupService, 'getGroupParticipants').and.callFake(function() {
            return(deferred.promise);
          });

          fixture.$onInit();
          rootScope.$digest();

          expect(participantService.get).toHaveBeenCalled();
          expect(groupService.getGroupParticipants).toHaveBeenCalledWith(state.params.groupId);
          expect(fixture.ready).toBeTruthy();
          expect(fixture.error).toBeTruthy();
        });
    });

    describe('beginMessageParticipants() function', () => {
        it('should set properties', () => {
            let groupMessage = new GroupMessage();
            fixture.beginMessageParticipants(groupMessage);
            expect(fixture.groupMessage).toEqual(groupMessage);
            expect(fixture.groupMessage.groupId).toEqual('');
            expect(fixture.groupMessage.subject).toEqual('');
            expect(fixture.groupMessage.body).toEqual('');
            expect(fixture.isEmailView()).toBeTruthy();
        });
    });

    describe('cancelMessageParticipants() function', () => {
        it('should unset properties', () => {
            let groupMessage = new GroupMessage();
            fixture.cancelMessageParticipants(groupMessage);
            expect(fixture.groupMessage).not.toBeDefined();
            expect(fixture.isListView()).toBeTruthy();
        });
    });

    describe('messageParticipants() function', () => {
        it('should message participants', () => {

            let groupMessage = new GroupMessage();
            fixture.groupMessage = groupMessage;
            let groupId = 123;
            fixture.groupId = groupId;

            let deferred = qApi.defer();
            deferred.resolve({});

            spyOn(messageService, 'sendGroupMessage').and.callFake(function() {
                return(deferred.promise);
            });

            spyOn(rootScope, '$emit').and.callFake(() => { });

            fixture.setEmailView();
            fixture.messageParticipants(groupMessage);
            rootScope.$digest();

            expect(messageService.sendGroupMessage).toHaveBeenCalledWith(123, groupMessage);

            expect(fixture.processing).toBeFalsy();
            expect(fixture.ready).toBeTruthy();
            expect(fixture.isListView()).toBeTruthy();

            expect(rootScope.$emit).toHaveBeenCalledWith('notify', rootScope.MESSAGES.emailSent);

        });
    });

    describe('emailList() function', () => {
      it('is should return a list of the emails', () => {
        fixture.data = [
          new Participant({nickName: 'f1', lastName: 'l1', groupRoleId: constants.GROUP.ROLES.MEMBER, email: 'dtkocher@callibrity.com'}),
          new Participant({nickName: 'f2', lastName: 'l2', groupRoleId: constants.GROUP.ROLES.LEADER, email: 'jim.kriz@ingagepartners.com'})
        ];

        expect(fixture.emailList()).toEqual('dtkocher@callibrity.com,jim.kriz@ingagepartners.com,');
      });
    });
});