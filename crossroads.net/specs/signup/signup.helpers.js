(function() {
  'use strict';

  module.exports = {
    family: [
      {
        age: 35,
        contactId: 2186211,
        email: 'matt.silbernagel@ingagepartners.com',
        highSchoolGraduationYear: 0,
        lastName: null,
        loggedInUser: true,
        participantId: 2213526,
        preferredName: 'Matt',
        relationshipId: 0
      },
      {
        age: 7,
        contactId: 5052038,
        email: 'matt.silbernagel@ingagepartners.com',
        highSchoolGraduationYear: 0,
        lastName: 'Silbernagel',
        loggedInUser: false,
        participantId: 0,
        preferredName: 'Miles',
        relationshipId: 6
      }
    ],
    group: {
      SignUpFamilyMembers: [
        {
          nickName: 'Matt', 
          emailAddress: 'matt.silbernagel@ingagepartners.com',
          userInGroup: false
        }
      ],
      childCareNeeded: true,
      emailAddress: 'matt.silbernagel@ingagepartners.com',
      nickName: 'Matt',
      participantId: 2213526,
      userInGroup: false,
      childCareInd: true,
      minAge: 10,
      events: [
        {
          eventId: 2845310,
          endDate: '2015-11-08T21:00:00',
          location: 'Oakley',
          meridian: null,
          name: 'Oakley FI 101',
          startDate: '2015-11-08T19:00:00',
          time: null
        }
      ],
      groupFullInd: false,
      groupId: 109085,
      waitListGroupId: 0,
      waitListInd: false
    },
    cmsInfo: {
      pages: [{
        className: 'OnetimeEventSignupPage',
        content: '<p>Content</p>',
        existingMember: '<p>You\'ve already signed up.</p>',
        full: '<p>Thanks for your interest but this group is currently full.</p>',
        group: '109085',
        id: 395,
        link: '/sign-up/fi101-oakley/',
        pageType: 'OnetimeEventSignupPage',
        parent: 28,
        success: '<p>Thanks for signing up! An email will be sent to each person registered ' +
          'who has a valid email in our system.</p>',
        title: 'FI101 Oakley',
        waitList: '<p>Please signup for the waiting list below.</p>',
        waitSuccess: '<p>Thanks for signing up for the wait list! An email will be sent to ' +
          'each person registered who has a valid'
      }]
    }
  };
})();
