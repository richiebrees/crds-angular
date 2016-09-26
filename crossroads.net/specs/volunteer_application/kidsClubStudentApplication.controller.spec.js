require('../../app/app');

describe('KidsClub Student Application Controller', function() {
  
  var controller;
  
  var mockVolunteer= {
    addressId: 99999,
    addressLine1: `9000 Observatory Lane`,
    addressLine2: '',
    age: 35,
    anniversaryDate: '',
    city: 'Cincinnati',
    congregationId: 5,
    contactId: 2186211,
    dateOfBirth: '04/03/2005',
    emailAddress: 'matt.silbernagel@ingagepartners.com',
    employerName: null,
    firstName: "Miles",
    foreignCountry: "United States",
    genderId: 1,
    homePhone: "513-555-5555",
    householdId: 1709940,
    lastName: "Silbernagel",
    maidenName: null,
    maritalStatusId: 2,
    middleName: null,
    mobileCarrierId: null,
    mobilePhone: null,
    nickName: "Miles",
    postalCode: "45223-1231",
    state: "OH" 
  };

  var mockContactId = 12345;
  var mockResponseId = 34567;
  var mockPageInfo = {
    accessDenied: "<p>Oops! Looks like you are not authorized to access this information. If you think this is a mistake, please contact the system administrator.</p>",
    canEditType: "Inherit",
    canViewType: "Inherit",
    content: "<p>Please complete this application.</p>",
    extraMeta: null,
    group: "27705",
    hasBrokenFile: "0",
    hasBrokenLink: "0",
    id: 83,
    link: "/volunteer-application/kids-club/",
    menuTitle: null,
    metaDescription: null,
    noExistingResponse: "<p>Oops! Please contact the group leader of the team you are looking to serve. Looks like we don't have a request from you to join this team.</p>",
    opportunity: "115",
    pageType: "VolunteerApplicationPage",
    parent: 82,
    reportClass: null,
    showInMenus: "1",
    showInSearch: "1",
    sort: "1",
    success: "<p>Default SUCCESS text for this page, see ApplicationPage.php to change</p>",
    title: "Kids Club",
    uRLSegment: "kids-club",
    version: "15"
  };

  var mockForm = {
    student: {
      $invalid: true,
      $name: "student",
      $pending: undefined,
      $pristine: true,
      $submitted: true,
      $valid: false
    }
 }; 

  beforeEach(angular.mock.module('crossroads'));
  
  beforeEach(inject(function(_$rootScope_, _$controller_){
    //Simulating isolate scope variables from the directive
    var data = {
      volunteer: mockVolunteer,
      contactId: mockContactId,
      pageInfo: mockPageInfo,
      responseId: mockResponseId 
    };
    var scope = _$rootScope_.$new();
    controller = _$controller_('KidsClubStudentApplicationController', scope, data);
  })); 

  it("should have an empty object for reference1", function(){
    expect(controller.reference1).toBeDefined();  
  });

  it("should not allow a save if there are errors", function(){
    expect(controller.save(mockForm)).toBe(false);
  });

  //TODO: 
  it("should save the form when there are no errors", function(){
   
  });

 it("should be false when checking if availability has been selected", function(){
    expect(controller.availabilitySelected()).toBe(false); 
  });

  it("should be true if an availability has been selected", function(){
    controller.availabilityDuringWeek = "week";
    expect(controller.availabilitySelected()).toBe(true); 
  });

  it("should be false when checking if gradeLevel has been selected", function(){
    expect(controller.gradeLevelSelected()).toBe(false);
  });

  it("should be true when gradeLevel has been selected", function(){
    controller.serveAgeKids.age1to2 = "some string";
    expect(controller.gradeLevelSelected()).toBe(true);
  });

});
