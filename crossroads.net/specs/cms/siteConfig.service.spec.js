describe('ContentSiteConfigService', function() {
  var ContentSiteConfigService;

  beforeEach(angular.mock.module('crossroads.core'));

  beforeEach(inject(function(_ContentSiteConfigService_) {
    ContentSiteConfigService = _ContentSiteConfigService_;
  }));

  it('should return the title that is set', function() {
    ContentSiteConfigService.siteconfig.title = 'Test Title';
    expect(ContentSiteConfigService.getTitle()).toBe('Test Title');
  });

  it('should return the default title if one is not set', function() {
    expect(ContentSiteConfigService.getTitle()).toBe('Crossroads');
  });

});
