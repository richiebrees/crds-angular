require('../../../../app/app');

describe('CommitmentList Directive', function() {
  var $compile;
  var $rootScope;
  var scope;
  var templateString;
  var commitmentList;
  var ImageService;

  beforeEach(angular.mock.module('crossroads.profile'));

  beforeEach(angular.mock.module(function($provide) {
    ImageService = { PledgeCampaignImageBaseURL: 'pledgecampaign/' };
    $provide.value('ImageService', ImageService);

    $provide.value('$state', { get: function() {} });
  }));

  beforeEach(
      inject(function(_$compile_, _$rootScope_) {
        $compile = _$compile_;
        $rootScope = _$rootScope_;

        scope = $rootScope.$new();
        scope.commitmentListInput = [
          {
            pledge_campaign_id: 1,
            pledge_campaign: 2,
            donor_display_name: 'Name',
            campaign_start_date: new Date(),
            campaign_end_date: new Date(),
            pledge_donations: 123,
            total_pledge: 456
          }
        ];

        templateString =
            '<commitment-list ' +
            ' commitment-list-input="commitmentListInput"></commitment-list>';
      })
  );

  describe('function link', function() {
    var fixture;
    beforeEach(function() {
      var element = $compile(angular.element(templateString))(scope);
      scope.$digest();

      fixture = element.isolateScope();
    });

    it('should set the image base url on scope', function() {
      expect(fixture.pledge_campaign_base_url).toBe(ImageService.PledgeCampaignImageBaseURL);
    });

    it('should set pledgeCommitments on scope', function() {
      expect(fixture.pledgeCommitments).toEqual(scope.commitmentListInput);
    });
  });

  describe('function commitmentMet', function() {
    var fixture;
    beforeEach(function() {
      var element = $compile(angular.element(templateString))(scope);
      scope.$digest();

      fixture = element.isolateScope();
    });

    it('should be true if pledges equal commitment', function() {
      expect(fixture.commitmentMet(1000, 1000)).toBeTruthy();
    });

    it('should be true if pledges are greater than commitment', function() {
      expect(fixture.commitmentMet(5000, 1000)).toBeTruthy();
    });

    it('should be false if pledges are less than commitment', function() {
      expect(fixture.commitmentMet(1000, 5000)).toBeFalsy();
    });
  });

  describe('function commitmentPercent', function() {
    var fixture;
    beforeEach(function() {
      var element = $compile(angular.element(templateString))(scope);
      scope.$digest();

      fixture = element.isolateScope();
    });

    it('should be 100 if pledges equal commitment', function() {
      expect(fixture.commitmentPercent(1000, 1000)).toEqual(100);
    });

    it('should be 100 if pledges are greater than commitment', function() {
      expect(fixture.commitmentPercent(5000, 1000)).toEqual(100);
    });

    it('should be a whole number if pledges are less than commitment', function() {
      expect(fixture.commitmentPercent(1234, 5000)).toEqual(Math.round((1234 / 5000) * 100));
    });
  });
});
