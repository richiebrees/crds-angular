(function() {
  'use strict';
  module.exports = {
    //TODO Should this be moved to core?
    // MODULE NAMES
    MODULES: {
      CHILDCARE: 'crossroads.childcare',
      CHILDCARE_DASHBOARD: 'crossroads.childcare_dashboard',
      CORE: 'crossroads.core',
      COMMON: 'crossroads.common',
      COMMUNITY_GROUPS: 'crossroads.community',
      CROSSROADS: 'crossroads',
      FORM_BUILDER: 'crossroads.form_builder',
      FORMLY_BUILDER: 'crossroads.formly_builder',
      GIVE: 'crossroads.give',
      GO_VOLUNTEER: 'crossroads.go_volunteer',
      //GROUP_FINDER: 'crossroads.group_finder',
      MEDIA: 'crossroads.media',
      LIVE_STREAM: 'crossroads.live_stream',
      GROUP_TOOL: 'crossroads.grouptool',
      MPTOOLS: 'crossroads.mptools',
      ONETIME_SIGNUP: 'crossroads.onetime',
      PROFILE: 'crossroads.profile',
      SEARCH: 'crossroads.search',
      SIGNUP: 'crossroads.signup',
      TRIPS: 'crossroads.trips',
    },
    ATTRIBUTE_TYPE_IDS: {
      ABUSE_HISTORY: 69,
      ALLERGIES: 67,
      COFACILITATOR: 87,
      COPARTICIPANT: 88,
      DIETARY_RESTRICTIONS: 65,
      ETHNICITY: 20,
      EXPERIENCE_ABROAD: 68,
      FREQUENT_FLYERS: 63,
      GROUP_AGE_RANGE: 91,
      GROUP_TYPE: 73,
      INTERNATIONAL_EXPERIENCE: 66,
      MEDICAL_RESTRICTIONS: 100,
      MEDICATION_TAKING: 101,
      PERSONAL: 1,
      SCRUB_TOP_SIZES: 22,
      SCRUB_BOTTOM_SIZES: 23,
      SKILLS: 24,
      SPIRITUAL_JOURNEY: 60,
      START_ATTEND_REASON: 59,
      TRIP_SKILLS: 61,
      TSHIRT_SIZES: 21,
      TRIP_EXPERIENCE: 62,
      UNDIVIDED_FACILITATOR_TRAINING: 85,
      UNDIVIDED_RSVP_KICKOFF: 86
    },
    ATTRIBUTE_IDS: {
      ALL_ALLERGIES: 3971,
      COFACILITATOR: 7086,
      COPARTICIPANT: 7087,
      DELTA_FREQUENT_FLYER: 3958,
      EXPERIENCE_ABROAD: 3972,
      HIGHSCHOOLAGE: 7090,
      MEDICAL_RESTRICTIONS: 9001,
      MEDICATION_TAKING: 9000,
      MIDDLESCHOOLAGE: 7089,
      OBEDIENCE: 3935,
      PREVIOUS_TRIP_EXPERIENCE: 3949,
      RECEIVED_JESUS: 3934,
      REPLICATING: 3936,
      SEARCHING_FOR_ANSWERS: 3933,
      SOUTHAFRICA_FREQUENT_FLYER: 3959,
      START_ATTEND_REASON: 59,
      US_FREQUENT_FLYER: 3980,
      VICTIM_OF_ABUSE: 3973
    },
    ATTRIBUTE_CATEGORY_IDS: {
      LIFE_STAGES: 17,
      NEIGHBORHOODS: 18,
      SPIRITUAL_GROWTH: 19,
      INTEREST: 20,
      HEALING: 21
    },
    NON_CROSSROADS_LOCATIONS: {
      I_DO_NOT_ATTEND_CROSSROADS: 2,
      NOT_SITE_SPECIFIC: 5
    },
    CMS: {
      PAGENAMES: {
        COMMUNITYGROUPS: 'CommunityGroupSignupPage',
        ONETIMEEVENTS: 'OnetimeEventSignupPage'
      },
      FORM_BUILDER: {
        CLASS_NAME: {
          GROUP_PARTICIPANT_FIELD: 'GroupParticipantField',
          PROFILE_FILED: 'ProfileField',
        },
        FIELD_NAME: {
          COFACILITATOR: 'CoFacilitator',
          COPARTICIPANT: 'CoParticipant',
        },
      }
    },
    GROUP: {
      ATTRIBUTE_TYPE_ID: 90,
      AGE_RANGE_ATTRIBUTE_TYPE_ID: 91,
      GROUP_TYPE_ATTRIBUTE_TYPE_ID: 73,
      GROUP_TYPE_ATTRIBUTE_ANYONE: 7007,
      GROUP_TYPE_ATTRIBUTE_MENONLY: 7008,
      GROUP_TYPE_ATTRIBUTE_WOMENONLY: 7009,
      GROUP_TYPE_ATTRIBUTE_COUPLES: 7010,
      MAX_LEADERS: 5,
      MAX_APPRENTICE: 5,
      GROUP_TYPE_ID: {
        UNDIVIDED: 26,
        SMALL_GROUPS: 1,
      },
      ROLES: {
        MEMBER: 16,
        LEADER: 22,
        APPRENTICE: 66
      },
    },
    INVITATION: {
      TYPES: {
        GROUP: 1,
        TRIP: 2
      }
    },
    MINISTRY: {
      SPIRITUAL_GROWTH: '8'
    },
  };
})();
