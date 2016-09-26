require('../../app/common/common.module');
require('../../app/app');
require('../../app/formBuilder/formBuilder.module.js');

describe('FormBuilder', function() {
  describe('formBuilder.controller', function() {
    var CONSTANTS = require('crds-constants');
    var MODULE = CONSTANTS.MODULES.FORM_BUILDER;

    var $compile;
    var $rootScope;
    var $q;
    var Session;
    var $controller;
    var group;
    var FormBuilderFieldsService;
    var ContentPageService;

    beforeEach(angular.mock.module(function($provide) {
      $provide.value('$state', {
        get: function() {
        }
      });

      Session = {exists: function() {return 45;}};

      ContentPageService = {
        page: {
          fields: [1, 2]
        },
        resolvedData: {
          attributeTypes: [
            {
              name: 'Shirt Size',
              attributes: [
                {
                  attributeId: 6852,
                  name: 'Child S',
                  description: null,
                  category: null,
                  categoryId: null,
                  categoryDescription: null,
                  sortOrder: 0,
                }
              ],
              attributeTypeId: 21,
              allowMultipleSelections: false,
            },
            {
              name: 'Undivided Co-facilitator',
              attributes: [
                {
                  attributeId: 7086,
                  name: 'co-facilitator',
                  description: null,
                  category: null,
                  categoryId: null,
                  categoryDescription: null,
                  sortOrder: 1
                }
              ],
              attributeTypeId: 87,
              allowMultipleSelections: false,
            },
            {
              name: 'Undivided Co-participant',
              attributes: [
                {
                  attributeId: 7087,
                  name: 'co-participant',
                  description: null,
                  category: null,
                  categoryId: null,
                  categoryDescription: null,
                  sortOrder: 1
                }
              ],
              attributeTypeId: 88,
              allowMultipleSelections: false,
            },
          ]
        }
      }

      FormBuilderFieldsService = {
        hasProfile: function() {
          return false;
        },

        hasGroupParticipant: function() {
          return true;
        },

        getGroupRoleId: function() {
          return 22;
        }
      };

      $provide.value('Session', Session, 'ContentPageService', ContentPageService, 'FormBuilderFieldsService', FormBuilderFieldsService);
    }));

    beforeEach(angular.mock.module(CONSTANTS.MODULES.COMMON));
    beforeEach(angular.mock.module(MODULE));

    beforeEach(
      inject(function($injector, _$compile_, _$rootScope_, _$controller_, Session, FormBuilderService, ContentPageService, _$q_) {
        $compile = _$compile_;
        $rootScope = _$rootScope_;
        $q = _$q_;
        $controller = _$controller_;
      })

    );

    function getController(failedApiCall) {
      group = {
        Type: {
          query: function() {
            var deferred = $q.defer();
            deferred.resolve({});

            var promise = deferred.promise;
            return {$promise: promise};
          }
        },
        Participant: {
          save: function() {
            var deferred = $q.defer();

            if (failedApiCall) {
              deferred.reject();
            } else {
              deferred.resolve();
            }

            var promise = deferred.promise;
            return {$promise: promise};
          }
        }
      };

      var controller = $controller('FormBuilderCtrl', {
        $rootScope: $rootScope,
        Group: group,
        Session: Session,
        ContentPageService: ContentPageService,
        FormBuilderFieldsService: FormBuilderFieldsService,
      });

      controller.dataForm = {$valid: true};

      return controller;
    }

    it('loading state should be true while save is running and reset after successful save', function() {
      var controller = getController(false);
      controller.data.group = {
        groupId: 123
      };

      controller.data[CONSTANTS.CMS.FORM_BUILDER.FIELD_NAME.COFACILITATOR] = 'coFacilitator';

      controller.save();
      expect(controller.saving).toBe(true);

      $rootScope.$apply();
      expect(controller.saving).toBe(false);
    });

    it('loading state should be true while save is running and reset after failed save', function() {
      var controller = getController(true);

      controller.data.group = {
        groupId: 123
      };

      controller.data[CONSTANTS.CMS.FORM_BUILDER.FIELD_NAME.COFACILITATOR] = 'coFacilitator';

      controller.save();
      expect(controller.saving).toBe(true);

      $rootScope.$apply();
      expect(controller.saving).toBe(false);
    });

    it('loading state should be false after exception', function() {
      var controller = getController(false);

      FormBuilderFieldsService.hasProfile = function() {
        return true;
      };

      // Force exception by unsetting query method
      delete group.Type.query;

      expect(controller.save).toThrow();
      $rootScope.$apply();
      expect(controller.saving).toBe(false);
    });

    it('co-facilitator should be added to the single attributes', function() {
      var controller = getController(false);

      controller.data.group = {
        groupId: 123
      };

      controller.data[CONSTANTS.CMS.FORM_BUILDER.FIELD_NAME.COFACILITATOR] = 'My Co-Facilitator';

      spyOn(group.Participant, 'save').and.callThrough();
      controller.save();
      $rootScope.$apply();

      expect(group.Participant.save).toHaveBeenCalled();

      var expectedCoFacilitator = {
        attribute: {
          attributeId: CONSTANTS.ATTRIBUTE_IDS.COFACILITATOR
        },
        notes: 'My Co-Facilitator',
      };

      var mostRecentArgs = group.Participant.save.calls.mostRecent().args;
      var participantsArgument = mostRecentArgs[1];
      var participant = participantsArgument[0];

      var actualCoFacilitator = participant.singleAttributes[CONSTANTS.ATTRIBUTE_TYPE_IDS.COFACILITATOR];
      expect(actualCoFacilitator).toEqual(expectedCoFacilitator);
    });

    it('co-facilitator should not be added to the single attributes', function() {
      var controller = getController(false);

      controller.data.group = {
        groupId: 123
      };

      spyOn(group.Participant, 'save').and.callThrough();
      controller.save();
      $rootScope.$apply();

      expect(group.Participant.save).toHaveBeenCalled();

      var mostRecentArgs = group.Participant.save.calls.mostRecent().args;
      var participantsArgument = mostRecentArgs[1];
      var participant = participantsArgument[0];

      var emptyAttribute = {
        attribute: null,
        notes: null,
      };

      expect(participant.singleAttributes[CONSTANTS.ATTRIBUTE_TYPE_IDS.COFACILITATOR]).toEqual(emptyAttribute);
    });

    it('childCareNeeded should not be set', function() {
      var controller = getController(false);

      controller.data.childCareNeeded = false;
      controller.data.group = {
        groupId: 123
      };

      spyOn(group.Participant, 'save').and.callThrough();
      controller.save();
      $rootScope.$apply();

      expect(group.Participant.save).toHaveBeenCalled();

      var mostRecentArgs = group.Participant.save.calls.mostRecent().args;
      var participantsArgument = mostRecentArgs[1];
      var participant = participantsArgument[0];

      expect(participant.childCareNeeded).toBe(false);
    });

    it('childCareNeeded should be set', function() {
      var controller = getController(false);

      controller.data.groupParticipant.childCareNeeded = true;
      controller.data.group = {
        groupId: 123
      };

      spyOn(group.Participant, 'save').and.callThrough();
      controller.save();
      $rootScope.$apply();

      expect(group.Participant.save).toHaveBeenCalled();

      var mostRecentArgs = group.Participant.save.calls.mostRecent().args;
      var participantsArgument = mostRecentArgs[1];
      var participant = participantsArgument[0];

      expect(participant.childCareNeeded).toBe(true);
    });
  });
});
