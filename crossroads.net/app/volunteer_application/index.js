'use strict()';

var app = require("angular").module("crossroads");
require("./volunteerApplicationForm.html");
require('../profile/personal/profile_personal.html');
require('../profile');



//constant isn't working, figure out why??????????????
// require('./studentConstants');
app.controller("VolunteerApplicationController", require("./volunteerApplication.controller"));
app.factory("Opportunity", ["$resource", "Session", require('../services/opportunity_service')]);

require('./kc_adult_application/kidsClubAdultApplication.template.html');
require('./kc_adult_application/kidsClubAdultApplication.directive');

require('./kc_student_application/kidsClubStudentApplication.template.html');
app.controller("KidsClubStudentApplicationController", require('./kc_student_application/kidsClubStudentApplication.controller'));
app.directive("kidsClubStudentApplication", require('./kc_student_application/kidsClubStudentApplication.directive'));
app.factory("VolunteerService", ["$resource", require('./volunteerService')]);

app.constant("studentFields", {
  "firstName": 310,
  "lastName": 311,
  "middleInitial": 312,
  "email": 325,
  "nameForNameTag": 318,
  "birthDate": 317,
  "gender": 315,
  "site": 313,
  "howLongAttending": 314,
  "serviceAttend": 474,
  "streetAddress": 319,
  "city": 320,
  "state": 321,
  "zip": 322,
  "mobilePhone": 323,
  "homePhone": 324,
  "school": 326,
  "grade": 327,
  "whereYouAre": 330,
  "explainFaith": 331,
  "whyServe": 332,
  "specialTalents": 333,
  "availabilityDuringWeek": 484,
  "availabilityDuringWeekend": 485,
  "serveSite": 338,
  "availabilityOakley": 476,
  "availabilityFlorence": 477,
  "availabilityWestSide": 478,
  "availabilityMason": 479,
  "availabilityClifton": 480,
  "serveServiceTimes": 340,
  "serveAgeKids1to2": 481,
  "serveAgeKids3toPreK": 482,
  "serveAgeKidsKto5Grade": 483,
  "reference1Name": 346,
  "reference1timeKnown": 347,
  "reference1homePhone": 349,
  "reference1mobilePhone": 350,
  "reference1workPhone": 351,
  "reference1email": 352,
  "reference1association": 353,
  "reference1occupation": 354,
  "reference2Name": 355,
  "reference2timeKnown": 356,
  "reference2homePhone": 358,
  "reference2mobilePhone": 359,
  "reference2workPhone": 360,
  "reference2email": 361,
  "reference2association": 362,
  "reference2occupation": 363,
  "parentLastName": 366,
  "parentFirstName": 367,
  "parentHomePhone": 368,
  "parentMobilePhone": 369,
  "parentEmail": 370,
  "parentSignature": 371,
  "parentSignatureDate": 372,
  "studentSignature": 373,
  "studentSignatureDate": 374
});

app.constant("adultFields", {
  "firstName": 376,
  "lastName": 375,
  "middleInitial": 377,
  "previousName": 383,
  "email": 391,
  "nameForNameTag": 384,
  "birthDate": 382,
  "gender": 380,
  "maritalStatus": 396,
  "spouseName": 397,
  "spouseGender": 398,
  "site": 379,
  "howLongAttending": 378,
  "serviceAttend": 473,
  "streetAddress": 385,
  "city": 386,
  "state": 387,
  "zip": 388,
  "mobilePhone": 389,
  "homePhone": 390,
  "companyName": 393,
  "position": 394,
  "workPhone": 395,
  "child1Name": 400,
  "child1Birthdate": 401,
  "child2Name": 402,
  "child2Birthdate": 403,
  "child3Name": 404,
  "child3Birthdate": 405,
  "child4Name": 406,
  "child4Birthdate": 407,
  "everBeenArrest": 409,
  "addictionConcern":411,
  "neglectingChild": 413,
  "psychiatricDisorder":415,
  "sexuallyActiveOutsideMarriage":417,
  "spiritualOrientation":421,
  "spiritualOrientationExplain":422,
  "whatPromptedApplication":424,
  "specialTalents":426,
  "availabilityWeek":428,
  "availabilityWeekend":429,
  "availabilityOakley":486,
  "availabilityFlorence":487,
  "availabilityWestSide":488,
  "availabilityMason":489,
  "availabilityClifton":490,
  "availabilityServiceTimes":432,
  "areaOfInterestServingInClassroom":491,
  "areaOfInterestWelcomingNewFamilies":492,
  "areaOfInterestHelpSpecialNeeds":493,
  "areaOfInterestTech":494,
  "areaOfInterestRoomPrep":495,
  "areaOfInterestAdminTasks":496,
  "areaOfInterestShoppingForSupplies":497,
  "areaOfInterestCreatingWeekendExperience":498,
  "whatAgeBirthToTwo":499,
  "whatAgeThreeToPreK":500,
  "whatAgeKToFifth":501,
  "reference1Name": 440,
  "reference1timeKnown": 441,
  "reference1homePhone": 442,
  "reference1mobilePhone": 443,
  "reference1workPhone": 444,
  "reference1email": 445,
  "reference1association": 446,
  "reference1occupation": 447,
  "reference2Name": 448,
  "reference2timeKnown": 449,
  "reference2homePhone": 450,
  "reference2mobilePhone": 451,
  "reference2workPhone": 452,
  "reference2email": 453,
  "reference2association": 454,
  "reference2occupation": 455,
  "reference3Name": 456,
  "reference3timeKnown": 457,
  "reference3homePhone": 458,
  "reference3mobilePhone": 459,
  "reference3workPhone": 460,
  "reference3email": 461,
  "reference3association": 462,
  "reference3occupation": 63,
  "agree": 465,
  "agreeDate":502
});
