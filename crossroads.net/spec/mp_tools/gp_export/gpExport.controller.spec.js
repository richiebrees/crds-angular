require('crds-core');
require('../../../app/common/common.module');
require('../../../app/app');

var allBatchList = [
    {
      id: 22,
      name: 'GeneralFunding012948',
      scanDate: '2015-08-12T00:00:00',
      status: 'notExported'
    },
    {
      id: 23,
      name: 'PickUpTheSlack938747',
      scanDate: '2015-08-14T00:00:00',
      status: 'exported'
    },
    {
      id: 24,
      name: 'General194200382',
      scanDate: '2015-09-12T00:00:00',
      status: 'notExported'
    },
    {
      id: 25,
      name: 'GetTough38294729',
      scanDate: '2015-09-13T00:00:00',
      status: 'notExported'
    },
  ];


describe('GP Export Tool', function() {
  var selectedDeposits = [
    {
      id: 22,
      export_file_name: 'export file 040802',
    },
    {
      id: 23,
      export_file_name: 'export file 020812',
    }
  ];

  beforeEach(angular.mock.module('crossroads'));

  var GIVE_ROLES = { StewardshipDonationProcessor: 123 };

  beforeEach(function() {
    angular.mock.module('crossroads.give', function($provide) {
      $provide.constant('GIVE_ROLES', GIVE_ROLES);
    });
  });

  var AuthService;

  beforeEach(function(){
    angular.mock.module('crossroads', function($provide){
      AuthService = jasmine.createSpyObj('AuthService', ['isAuthenticated', 'isAuthorized']);
      $provide.value('AuthService', AuthService);
    });
  });

  var $controller;
  var $log;
  var $httpBackend;
  var MPTools;

  beforeEach(inject(function(_$controller_, _$log_, _MPTools_, $injector) {
    $controller = _$controller_;
    $log = _$log_;
    MPTools = _MPTools_;
    $httpBackend = $injector.get('$httpBackend');
  }));

  describe('GP Export Controller', function() {

    var $scope;
    var controller;
    beforeEach(function() {
      $scope = {};
      controller = $controller('CheckBatchProcessor', { $scope: $scope });
      $httpBackend.expectGET(window.__env__['CRDS_API_ENDPOINT'] + 'api/gpexport/filenames').respond(selectedDeposits);
    });

    describe('Function allowAccess', function() {
      it('Should not allow access if user is not authenticated', function() {
        AuthService.isAuthenticated.and.returnValue(false);

        expect(controller.allowAccess()).toBeFalsy();

        expect(AuthService.isAuthenticated).toHaveBeenCalled();
        expect(AuthService.isAuthorized).not.toHaveBeenCalled();
      });

      it('Should not allow access if user is authenticated but not authorized', function() {
        AuthService.isAuthenticated.and.returnValue(true);
        AuthService.isAuthorized.and.returnValue(false);

        expect(controller.allowAccess()).toBeFalsy();

        expect(AuthService.isAuthenticated).toHaveBeenCalled();
        expect(AuthService.isAuthorized).toHaveBeenCalledWith(GIVE_ROLES.StewardshipDonationProcessor);
      });

      it('Should not allow access if user is authenticated but not authorized', function() {
        AuthService.isAuthenticated.and.returnValue(true);
        AuthService.isAuthorized.and.returnValue(true);

        expect(controller.allowAccess()).toBeTruthy();

        expect(AuthService.isAuthenticated).toHaveBeenCalled();
        expect(AuthService.isAuthorized).toHaveBeenCalledWith(GIVE_ROLES.StewardshipDonationProcessor);
      });
    });

    describe('Initial Load', function() {
      /*it('should get a list of check batches', function() {*/
        //$httpBackend.expectGET(window.__env__['CRDS_API_ENDPOINT'] + 'api/gpexport/filenames').respond(selectedDeposits);
        //$httpBackend.expectGET(window.__env__['CRDS_API_ENDPOINT'] + 'api/checkscanner/batches?onlyOpen=false').respond(allBatchList);
        //$httpBackend.whenGET(/SiteConfig*/).respond('');
        //$httpBackend.flush();
        //expect(controller.selectedDeposits.length).toBe(2);
        //expect(controller.selectedDeposits[0]).toBe('export file 040802');
        //expect(controller.selectedDeposits[1]).toBe('export file 020812');
      /*});*/
    });
  });
});
