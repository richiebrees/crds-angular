module.exports = {
  MyTrips:
    [
      {
        eventParticipantId:2631206,
        tripStartDate:'Jul 25, 2015',
        tripEnd:'Dec 31, 2015',
        tripName:'(d) NKY Big Trip 2015',
        fundraisingDays:136,
        fundraisingGoal:1000,
        totalRaised:500,
        tripGifts:[
          {
            donorId: 214,
            donorNickname:'TJ',
            donorLastName:'Maddox',
            donorEmail:'tmaddox33+mp1@gmail.com',
            donationAmount:500,
            donationDate:'8/13/2015',
            registeredDonor:true,
            donationDistributionId: 149,
            paymentTypeId: 4,
          }]
      },
      {
        eventParticipantId:0,
        tripStartDate:'Jul 27, 2015',
        tripEnd:'Jul 30, 2015',
        tripName:'(d) Sweden Trip 2015',
        fundraisingDays:0,
        fundraisingGoal:2000,
        totalRaised:2000,
        tripGifts:[
          {
            donorId: 123,
            donorNickname:'Anonymous',
            donorLastName:'',
            donorEmail:'andrew.canterbury@ingagepartners.com',
            donationAmount:1900,
            donationDate:'8/11/2015',
            registeredDonor:true,
            anonymous: true,
            donationDistributionId: 179,
            paymentTypeId: 4,
          },
          {
            donorId: 123,
            donorNickname:'Scholorship',
            donorLastName:'',
            donorEmail:'tmaddox33+mp1@gmail.com',
            donationAmount:100,
            donationDate:'8/8/2015',
            registeredDonor: false,
            donationDistributionId: 169,
            paymentTypeId: 9,
          },
          {
            donorId: 1333,
            donorNickname:'Transfer',
            donorLastName:'',
            donorEmail:'andrew.canterbury@ingagepartners.com',
            donationAmount:1900,
            donationDate:'8/11/2015',
            registeredDonor:true,
            anonymous: false,
            donationDistributionId: 234,
            paymentTypeId: 13,
          },
        ]
      }
    ],
  TripParticipant: {
    email: 'matt.silbernagel@ingagepartners.com',
    participantId: 2213526,
    participantName: 'Matt Silbernagel',
    showGiveButton: true,
    showShareButtons: false,
    participantPhotoUrl: 'http://crossroads-media.imgix.net/images/avatar.svg',
    trips: [{
      tripEnd: 'Dec 28, 2015',
      tripParticipantId: 4593680,
      tripStartDate: 1450656000,
      tripStart: 'Dec 21, 2015',
      tripName: '2015 December GO South Africa',
      programId: 2213526,
      programName: '2015 December GO South Africa',
      campaignId: 123456789,
      campaignName: 'test campaign',
      pledgeDonorId: 23232323
    }]
  },
  Trip: {
    tripEnd: 'Dec 28, 2015',
    tripParticipantId: 4593680,
    tripStartDate: 1450656000,
    tripStart: 'Dec 21, 2015',
    tripName: '2015 December GO South Africa',
    programId: 2213526,
    programName: '2015 December GO South Africa',
    campaignId: 123456789,
    campaignName: 'test campaign',
    pledgeDonorId: 23232323
  },
  Nicaragua: {
    id: 181,
    name: '2015 December GO Nicaragua',
    formId: 22,
    nickname: 'Nicaragua',
    ageLimit: 8,
    registrationStart: '2015-05-20T00:00:00',
    registrationEnd: '2015-08-31T00:00:00',
    ageExceptions: []
  },
  Nola: {
    id: 179,
    name: '2015 December GO NOLA',
    formId: 21,
    nickname: 'NOLA',
    ageLimit: 8,
    registrationStart: '2015-05-20T00:00:00',
    registrationEnd: '2015-12-21T00:00:00',
    ageExceptions: []
  },
  WorkTeams: [
    {
      dp_RecordID: 1,
      dp_RecordName: 'Habitat (must be 16 or older)'
    },
    {
      dp_RecordID: 3,
      dp_RecordName: 'Hands On - Neighborhood Restoration'
    },
    {
      dp_RecordID:2,
      dp_RecordName: 'Vacation Bible Camp'
    }
  ],
  Person: {
    addressId: 382387,
    addressLine1: '555 Sesame St.',
    addressLine2: 'Apartment B',
    age: 8,
    anniversaryDate: '01/2001',
    city: 'Florence',
    congregationId: 2,
    contactId: 768386,
    dateOfBirth: '05/29/2007',
    emailAddress: 'contact@email.com',
    employerName: null,
    firstName: 'Claire',
    foreignCountry: 'United States',
    genderId: 2,
    homePhone: '513-629-1595',
    householdId: 627743,
    householdName: 'Maddox',
    lastName: 'Maddox',
    maidenName: null,
    maritalStatusId: null,
    middleName: null,
    mobileCarrierId: null,
    mobilePhone: null,
    nickName: 'Claire',
    postalCode: '41042',
    state: 'KY',
    householdMembers: [
      {
        ContactId: 768379,
        FirstName: 'Anthony',
        Nickname: 'TJ',
        LastName: 'Maddox',
        DateOfBirth: '1972-08-06T00:00:00',
        HouseholdPosition: 'Head of Household',
        StatementTypeId: 1,
        DonorId: 2631446
      },
      {
        ContactId:768386,
        FirstName: 'Claire',
        Nickname: 'Claire',
        LastName: 'Maddox',
        DateOfBirth: '2007-05-29T00:00:00',
        HouseholdPosition: 'Minor Child',
        StatementTypeId: 0,
        DonorId: 0}
      ]
  },
  Application: {
    page2: {
      guardianFirstName: 'Andrew',
      guardianLastName: 'Cant',
      referral: true,
      conditions: 'bad',
      why: 'roaches'
    },
    page3: {
      emergencyContactFirstName: 'Leslie',
      emergencyContactLastName: 'Leave',
      emergencyContactEmail: 'leslie@leave.com',
      emergencyContactPrimaryPhone: '123456789',
      emergencyContactSecondaryPhone: '00000000000'
    },
    page4: {
      groupCommonName: 'qwerf',
      roommateFirstChoice: 'Leslie',
      roommateSecondChoice: 'Miles',
      supportPersonEmail: 'support@person.com',
      interestedInGroupLeader: false,
      whyGroupLeader: null
    },
    page5: {
      sponsorChildInNicaragua: true,
      sponsorChildFirstName: 'asdf',
      sponsorChildLastName: 'asfd',
      sponsorChildNumber: 12347865432,
      sponsorChildTown: 'asdf',
      nolaFirstChoiceWorkTeam: null,
      nolaFirstChoiceExperience: null,
      nolaSecondChoiceWorkTeam: null
    },
    page6: {
      experienceAbroad: true,
      describeExperienceAbroad: 'kalsdfjasdf',
      pastAbuseHistory: 'asdf',
      validPassport: true
    },
    depositInformation: {
      donationAmount: '300',
      donationDate: '1/1/2016',
      paymentMethod: 'Credit Card'
    }
  }
};
