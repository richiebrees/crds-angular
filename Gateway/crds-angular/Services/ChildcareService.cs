﻿using System;
using System.Collections.Generic;
using System.Linq;
using crds_angular.Exceptions;
using crds_angular.Models.Crossroads;
using crds_angular.Models.Crossroads.Childcare;
using crds_angular.Models.Crossroads.Groups;
using crds_angular.Models.Crossroads.Serve;
using crds_angular.Services.Interfaces;
using crds_angular.Util.Interfaces;
using Crossroads.Utilities.Interfaces;
using Crossroads.Utilities.Services;
using log4net;
using MinistryPlatform.Translation.Models;
using MinistryPlatform.Translation.Models.Childcare;
using MinistryPlatform.Translation.Repositories.Interfaces;

namespace crds_angular.Services
{
    public class ChildcareService : IChildcareService
    {
        private readonly IChildcareRequestRepository _childcareRequestService;
        private readonly ICommunicationRepository _communicationService;
        private readonly IConfigurationWrapper _configurationWrapper;
        private readonly IContactRepository _contactService;
        private readonly IEventParticipantRepository _eventParticipantService;
        private readonly IEventRepository _eventService;
        private readonly IEventService _crdsEventService;
        private readonly IGroupService _groupService;
        private readonly IParticipantRepository _participantService;
        private readonly IServeService _serveService;
        private readonly IDateTime _dateTimeWrapper;
        private readonly IApiUserRepository _apiUserService;
        private readonly int _childcareGroupType;

        private readonly ILog _logger = LogManager.GetLogger(typeof (ChildcareService));

        public ChildcareService(IEventParticipantRepository eventParticipantService,
                                ICommunicationRepository communicationService,
                                IConfigurationWrapper configurationWrapper,
                                IContactRepository contactService,
                                IEventRepository eventService,
                                IParticipantRepository participantService,
                                IServeService serveService,
                                IDateTime dateTimeWrapper,
                                IApiUserRepository apiUserService, 
                                IEventService crdsEventService, 
                                IChildcareRequestRepository childcareRequestService,
                                IGroupService groupService)
        {
            _childcareRequestService = childcareRequestService;
            _eventParticipantService = eventParticipantService;
            _communicationService = communicationService;
            _configurationWrapper = configurationWrapper;
            _contactService = contactService;
            _crdsEventService = crdsEventService;
            _eventService = eventService;
            _participantService = participantService;
            _serveService = serveService;
            _dateTimeWrapper = dateTimeWrapper;
            _apiUserService = apiUserService;
            _groupService = groupService;

            _childcareGroupType = _configurationWrapper.GetConfigIntValue("ChildcareGroupType");
        }

        public List<FamilyMember> MyChildren(string token)
        {
            var family = _serveService.GetImmediateFamilyParticipants(token);
            var myChildren = new List<FamilyMember>();

            foreach (var member in family)
            {
                var schoolGrade = SchoolGrade(member.HighSchoolGraduationYear);
                var maxAgeWithoutGrade = _configurationWrapper.GetConfigIntValue("MaxAgeWithoutGrade");
                var maxGradeForChildcare = _configurationWrapper.GetConfigIntValue("MaxGradeForChildcare");
                if (member.Age == 0)
                {
                    continue;
                }
                if (schoolGrade == 0 && member.Age <= maxAgeWithoutGrade)
                {
                    myChildren.Add(member);
                }
                else if (schoolGrade > 0 && schoolGrade <= maxGradeForChildcare)
                {
                    myChildren.Add(member);
                }
            }
            return myChildren;
        }

        public void SaveRsvp(ChildcareRsvpDto saveRsvp, string token)
        {
            var participant = _participantService.GetParticipant(saveRsvp.ChildContactId);

            try
            {
                var participantSignup = new ParticipantSignup
                {
                    particpantId = participant.ParticipantId,
                    groupRoleId = _configurationWrapper.GetConfigIntValue("Group_Role_Default_ID")
                };

                _groupService.addParticipantsToGroup(saveRsvp.GroupId, new List<ParticipantSignup> { participantSignup });
            }
            catch (Exception ex)
            {
                _logger.Error(string.Format("Save RSVP failed for group ({0}), contact ({1})", saveRsvp.GroupId, saveRsvp.ChildContactId), ex);
            }
        }

        public void CreateChildcareRequest(ChildcareRequestDto request, String token)
        {
            var mpRequest = request.ToMPChildcareRequest();
            var childcareRequestId = _childcareRequestService.CreateChildcareRequest(mpRequest);
            _childcareRequestService.CreateChildcareRequestDates(childcareRequestId, mpRequest, token);
            try
            {
                var childcareRequest = _childcareRequestService.GetChildcareRequest(childcareRequestId, token);
                SendChildcareRequestNotification(childcareRequest);
            }
           catch (Exception ex)
            {
                _logger.Error(string.Format("Save Request failed"), ex);
            }

        }

        // TODO: Should we merge childcareRequestId into the childcareRequestDto?
        public void ApproveChildcareRequest(int childcareRequestId, ChildcareRequestDto childcareRequest, string token)
        {
            try
            {
                var request = GetChildcareRequestForReview(childcareRequestId, token);
                var datesFromRequest = _childcareRequestService.GetChildcareRequestDates(childcareRequestId);
                var requestedDates = childcareRequest.DatesList.Select(date => GetChildcareDateFromList(datesFromRequest, date)).ToList();
                if (requestedDates.Count == 0)
                {
                    throw new ChildcareDatesMissingException(childcareRequestId);
                }

                var childcareEvents = _childcareRequestService.FindChildcareEvents(childcareRequestId, requestedDates);
                var missingDates = requestedDates.Where(childcareRequestDate => !childcareEvents.ContainsKey(childcareRequestDate.ChildcareRequestDateId)).ToList();
                if (missingDates.Count > 0)
                {
                    var dateList = missingDates.Aggregate("", (current, date) => current + ", " + date.RequestDate.ToShortDateString());
                    _logger.Debug("Missing events for dates: ${dateList}");
                    var dateMap = missingDates.Select(c => c.RequestDate).ToList();
                    throw new EventMissingException(dateMap);
                }

                //set the approved column for dates to true
                foreach (var ccareDates in requestedDates)
                {
                    _childcareRequestService.DecisionChildcareRequestDate(ccareDates.ChildcareRequestDateId, true);
                    var eventId = childcareEvents.Where((ev) => ev.Key == ccareDates.ChildcareRequestDateId).Select( (ev) => ev.Value).SingleOrDefault();
                    var eventGroup = new MpEventGroup() {Closed = false, Created = true, EventId = eventId, GroupId = request.GroupId};
                    var currentGroups = _eventService.GetGroupsForEvent(eventId).Select((g) => g.GroupId).ToList();
                    if (!currentGroups.Contains(request.GroupId))
                    {
                        _eventService.CreateEventGroup(eventGroup, token);
                    }
                }

                var requestStatusId = GetApprovalStatus(datesFromRequest, requestedDates);
                _childcareRequestService.DecisionChildcareRequest(childcareRequestId, requestStatusId, childcareRequest.ToMPChildcareRequest());
                var templateId = GetApprovalEmailTemplate(requestStatusId);
                SendChildcareRequestDecisionNotification(childcareRequestId, requestedDates, childcareRequest, templateId, token);
            }
            catch (EventMissingException ex)
            {
                throw;
            }
            catch (ChildcareDatesMissingException ex)
            {
                throw;
            }
            catch (Exception ex)
            {
                _logger.Error(string.Format("Update Request failed"), ex);
                throw new Exception("Approve Childcare failed", ex);
            }
        }

        private int GetApprovalEmailTemplate(int requestStatusId)
        {
            if (requestStatusId == 1)
            {
                return _configurationWrapper.GetConfigIntValue("ChildcareRequestApprovalNotificationTemplate");
            }
            else
            {
                return _configurationWrapper.GetConfigIntValue("ChildcareRequestConditionalApprovalNotificationTemplate");
            }
        }

        private MpChildcareRequestDate GetChildcareDateFromList(List<MpChildcareRequestDate> allDates, DateTime date)
        {
            var requestedDate = new MpChildcareRequestDate();
            return allDates.SingleOrDefault(d => date.Date == d.RequestDate.Date); 
        }

        private int GetApprovalStatus(List<MpChildcareRequestDate> datesFromMP, List<MpChildcareRequestDate> datesApproving)
        {
            if (datesFromMP.Count > datesApproving.Count)
            {
                return _configurationWrapper.GetConfigIntValue("ChildcareRequestConditionallyApproved");
            }
            return _configurationWrapper.GetConfigIntValue("ChildcareRequestApproved");
        }

        public void RejectChildcareRequest(int childcareRequestId, ChildcareRequestDto childcareRequest, string token)
        {
            try
            {
                //set the approved column for dates to false
                var childcareDates = _childcareRequestService.GetChildcareRequestDates(childcareRequestId);
                foreach (var ccareDates in childcareDates)
                {
                    _childcareRequestService.DecisionChildcareRequestDate(ccareDates.ChildcareRequestDateId, false);
                }

                _childcareRequestService.DecisionChildcareRequest(childcareRequestId, _configurationWrapper.GetConfigIntValue("ChildcareRequestRejected"), childcareRequest.ToMPChildcareRequest());
                var templateId = _configurationWrapper.GetConfigIntValue("ChildcareRequestRejectionNotificationTemplate");
                SendChildcareRequestDecisionNotification(childcareRequestId, childcareDates, childcareRequest, templateId, token);
            }
            catch (Exception ex)
            {
                _logger.Error(string.Format("Update Request failed"), ex);
                throw new Exception("Reject Childcare failed", ex);
            }
        }

        public ChildcareDashboardDto GetChildcareDashboard(int contactId)
        {
            var dashboard = new ChildcareDashboardDto();
            var token = _apiUserService.GetToken();

            //Figure out who is a head in my household
            var contact = _contactService.GetContactById(contactId);
            var household = _contactService.GetHouseholdFamilyMembers(contact.Household_ID);
            var houseHeads = household.Where(h => h.HouseholdPosition != null && h.HouseholdPosition.ToUpper().StartsWith("HEAD")); //TODO: Get rid of magic string. Household Position
            if (!houseHeads.Any(h => h.ContactId == contactId))
            {
                throw new NotHeadOfHouseholdException(contactId);
            }

            //Find community groups for house heads
            foreach (var head in houseHeads)
            {
                var participant = _participantService.GetParticipant(head.ContactId);
                var groups = _groupService.GetGroupsByTypeForParticipant(token, participant.ParticipantId, _configurationWrapper.GetConfigIntValue("GroupTypeForCommunityGroup"));
                //Find events that my groups are approved for
                foreach (var group in groups)
                {
                    var groupEvents = _eventService.GetEventGroupsForGroup(group.GroupId, token);
                    foreach (var ev in groupEvents)
                    {
                        var eventDetails = _eventService.GetEvent(ev.EventId);
                        if (!dashboard.AvailableChildcareDates.Any(d => d.EventDate.Date == eventDetails.EventStartDate.Date))
                        {
                            dashboard.AvailableChildcareDates.Add(new ChildCareDate
                            {
                                EventDate = eventDetails.EventStartDate.Date,
                                Cancelled = eventDetails.Cancelled
                            });
                        }

                        //Date exists, add group
                        var eventGroup = _eventService.GetEventGroupsForEvent(eventDetails.EventId, token).FirstOrDefault(g => g.GroupTypeId == _childcareGroupType);
                        var ccEventGroup = _groupService.GetGroupDetails(eventGroup.GroupId);
                        var eligibleChildren = new List<ChildcareRsvp>();
                        foreach (var member in household)
                        {
                            if (member.HouseholdPosition != null && !member.HouseholdPosition.ToUpper().StartsWith("HEAD")) //TODO: Get rid of magic string. Household Position
                            {
                                eligibleChildren.Add(new ChildcareRsvp
                                {
                                    ContactId = member.ContactId,
                                    DisplayName = member.Nickname + ' ' + member.LastName,
                                    ChildEligible = (member.Age < ccEventGroup.MaximumAge),
                                    ChildHasRsvp = IsChildRsvpd(member.ContactId, ccEventGroup, token)
                                });
                            }
                        }
                        var ccEvent = dashboard.AvailableChildcareDates.First(d => d.EventDate.Date == eventDetails.EventStartDate.Date);
                        ccEvent.Groups.Add(new ChildcareGroup
                        {
                            GroupName = group.GroupName,
                            EventStartTime = eventDetails.EventStartDate,
                            EventEndTime = eventDetails.EventEndDate,
                            CongregationId = eventDetails.CongregationId,
                            GroupMemberName = head.Nickname + ' ' + head.LastName,
                            MaximumAge = ccEventGroup.MaximumAge,
                            RemainingCapacity = group.RemainingCapacity,
                            EligibleChildren = eligibleChildren,
                            ChildcareGroupId = ccEventGroup.GroupId
                        });
                        
                    }
                }
            }

            return dashboard;
        }

        private bool IsChildRsvpd(int contactId, GroupDTO ccEventGroup, string token)
        {
            var participant = _participantService.GetParticipant(contactId);
            var childGroups = _groupService.GetGroupsByTypeForParticipant(token, participant.ParticipantId, _childcareGroupType);
            return childGroups.Any(c => c.GroupId == ccEventGroup.GroupId);
        }

        public MpChildcareRequest GetChildcareRequestForReview(int childcareRequestId, string token)
        {
            try
            {
                return _childcareRequestService.GetChildcareRequestForReview(childcareRequestId);
            }
            catch (Exception ex)
            {
                _logger.Error(string.Format("GetChildcareRequestForReview failed"), ex);
            }
            return null;
        }

        private void SendChildcareRequestDecisionNotification(int requestId, List<MpChildcareRequestDate> childcareRequestDates, ChildcareRequestDto childcareRequest, int templateId, String token)
        {
            var childcareRequestEmail = _childcareRequestService.GetChildcareRequest(requestId, token);;
            var template = _communicationService.GetTemplate(templateId);

            var decisionNotes = childcareRequest.DecisionNotes ?? "N/A";

           
            var authorUserId = _configurationWrapper.GetConfigIntValue("DefaultUserAuthorId");
            var datesList = childcareRequestDates.Select(dateRec => dateRec.RequestDate).Select(requestDate => BuildParagraph("", requestDate.ToShortDateString())).ToList();
            var styles = Styles();
            var htmlCell = new HtmlElement("td", styles).Append(datesList);
            var htmlRow = new HtmlElement("tr", styles).Append(htmlCell);
            var htmlTBody = new HtmlElement("tbody", styles).Append(htmlRow);
            var htmlTable = new HtmlElement("table", styles).Append(htmlTBody);

            var mergeData = new Dictionary<string, object>
            {
                {"Group", childcareRequestEmail.GroupName},
                {"ChildcareSession", childcareRequestEmail.ChildcareSession},
                {"DecisionNotes", decisionNotes },
                {"Frequency", childcareRequest.Frequency},
                {"Dates", htmlTable.Build() },
                {"RequestId", childcareRequestEmail.RequestId },
                {"Base_Url", _configurationWrapper.GetConfigValue("BaseMPUrl")},
                {"Congregation", childcareRequestEmail.CongregationName }
            };
            var toContactsList = new List<MpContact> {new MpContact {ContactId = childcareRequestEmail.RequesterId, EmailAddress = childcareRequestEmail.RequesterEmail}};


            var communication = new MpCommunication
            {
                AuthorUserId = authorUserId,
                EmailBody = template.Body,
                EmailSubject = template.Subject,
                FromContact = new MpContact { ContactId = childcareRequestEmail.ChildcareContactId, EmailAddress = childcareRequestEmail.ChildcareContactEmail},
                ReplyToContact = new MpContact { ContactId = childcareRequestEmail.ChildcareContactId, EmailAddress = childcareRequestEmail.ChildcareContactEmail },
                ToContacts = toContactsList,
                MergeData = mergeData
            };

            try
            {
                _communicationService.SendMessage(communication);
            }
            catch (Exception ex)
            {
                _logger.Error(string.Format("Send Childcare request approval notification email failed"), ex);
            }

        }

        public void SendChildcareRequestNotification( MpChildcareRequestEmail request)
        {
            var templateId = _configurationWrapper.GetConfigIntValue("ChildcareRequestNotificationTemplate");
            var authorUserId = _configurationWrapper.GetConfigIntValue("DefaultUserAuthorId");          
            var template = _communicationService.GetTemplate(templateId);           

            var mergeData = new Dictionary<string, object>
            {
                {"Requester", request.Requester},
                {"Nickname", request.RequesterNickname },
                {"LastName", request.RequesterLastName },
                {"Group", request.GroupName },
                {"Site", request.CongregationName },
                {"StartDate", (request.StartDate).ToShortDateString() },
                {"EndDate", (request.EndDate).ToShortDateString() },
                {"ChildcareSession", request.ChildcareSession },
                {"RequestId", request.RequestId },
                {"Base_Url", _configurationWrapper.GetConfigValue("BaseMPUrl")}
            };

            var communication = new MpCommunication
             {
                AuthorUserId = authorUserId,
                EmailBody = template.Body,
                EmailSubject = template.Subject,
                FromContact = new MpContact {ContactId = request.RequesterId, EmailAddress = request.RequesterEmail},
                ReplyToContact = new MpContact { ContactId = request.RequesterId, EmailAddress = request.RequesterEmail},
                ToContacts = new List<MpContact> {new MpContact {ContactId = request.ChildcareContactId, EmailAddress = request.ChildcareContactEmail } },
                MergeData = mergeData
             };

            try
            {
                _communicationService.SendMessage(communication);
            }
            catch (Exception ex)
            {
                _logger.Error(string.Format("Send Childcare request notification email failed"), ex);
            }


        }

        public int SchoolGrade(int graduationYear)
        {
            if (graduationYear == 0)
            {
                return 0;
            }
            var today = _dateTimeWrapper.Today;
            var todayMonth = today.Month;
            var yearForCalc = today.Year;
            if (todayMonth > 7)
            {
                yearForCalc = today.Year + 1;
            }

            var grade = 12 - (graduationYear - yearForCalc);
            if (grade <= 12 && grade >= 0)
            {
                return grade;
            }
            return 0;
        }

        public void SendRequestForRsvp()
        {
            var daysBeforeEvent = _configurationWrapper.GetConfigIntValue("NumberOfDaysBeforeEventToSend");
            var templateId = _configurationWrapper.GetConfigIntValue("ChildcareRequestTemplate");
            var authorUserId = _configurationWrapper.GetConfigIntValue("DefaultUserAuthorId"); ;
            var template = _communicationService.GetTemplate(templateId);
            var fromContact = _contactService.GetContactById(_configurationWrapper.GetConfigIntValue("DefaultContactEmailId"));
            const int domainId = 1;
            var token = _apiUserService.GetToken();

            var participants = _eventParticipantService.GetChildCareParticipants(daysBeforeEvent);
            foreach (var participant in participants)
            {
                var childEvent = _crdsEventService.GetChildcareEvent(participant.EventId);
                var childcareParticipants = _crdsEventService.EventParticpants(childEvent.EventId, token);
                var mine = _crdsEventService.MyChildrenParticipants(participant.ContactId, childcareParticipants, token);

                if (mine!=null && mine.Any())
                {
                    // i have kids already signed up for childcare!
                    continue;
                }
                var mergeData = SetMergeData(participant.GroupName, participant.EventStartDateTime, participant.EventId);
                var replyToContact = ReplyToContact(childEvent);
                var communication = FormatCommunication(authorUserId,
                                                        domainId,
                                                        template,
                                                        fromContact,
                                                        replyToContact,
                                                        participant.ContactId,
                                                        participant.ParticipantEmail,
                                                        mergeData);
                try
                {
                    _communicationService.SendMessage(communication);
                }
                catch (Exception ex)
                {
                    LogError(participant, ex);
                }
            }
        }

        private static MpMyContact ReplyToContact(MpEvent childEvent)
        {
            var contact = childEvent.PrimaryContact;
            var replyToContact = new MpMyContact
            {
                Contact_ID = contact.ContactId,
                Email_Address = contact.EmailAddress
            };
            return replyToContact;
        }

        private static MpCommunication FormatCommunication(int authorUserId,
                                                         int domainId,
                                                         MpMessageTemplate template,
                                                         MpMyContact fromContact,
                                                         MpMyContact replyToContact,
                                                         int participantContactId,
                                                         string participantEmail,
                                                         Dictionary<string, object> mergeData)
        {
            var communication = new MpCommunication
            {
                AuthorUserId = authorUserId,
                DomainId = domainId,
                EmailBody = template.Body,
                EmailSubject = template.Subject,
                FromContact = new MpContact {ContactId = fromContact.Contact_ID, EmailAddress = fromContact.Email_Address},
                ReplyToContact = new MpContact {ContactId = replyToContact.Contact_ID, EmailAddress = replyToContact.Email_Address},
                ToContacts = new List<MpContact> {new MpContact {ContactId = participantContactId, EmailAddress = participantEmail}},
                MergeData = mergeData
            };
            return communication;
        }

        private void LogError(MpEventParticipant participant, Exception ex)
        {
            var participantId = participant.ParticipantId;
            var groupId = participant.GroupId;
            var eventId = participant.EventId;
            _logger.Error(string.Format("Send Childcare RSVP email failed. Participant: {0}, Group: {1}, Event: {2}", participantId, groupId, eventId), ex);
        }

        private Dictionary<string, object> SetMergeData(string groupName, DateTime eventStartDateTime, int eventId)
        {
            var mergeData = new Dictionary<string, object>
            {
                {"GroupName", groupName},
                {"EventStartDate", eventStartDateTime.ToString("g")},
                {"EventId", eventId},
                {"BaseUrl", _configurationWrapper.GetConfigValue("BaseUrl")}
            };
            return mergeData;
        }
        private static HtmlElement BuildParagraph(string label, string value)
        {
            var els = new List<HtmlElement>()
            {
                new HtmlElement("strong", label),
                new HtmlElement("span", value)
            }
                ;
            return new HtmlElement("p", els);
        }
        private Dictionary<string, string> Styles()
        {
            return new Dictionary<string, string>()
            {
                {"style", "border-spacing: 0; border-collapse: collapse; vertical-align: top; text-align: left; width: 100%; padding: 0; border:none; border-color:#ffffff;font-size: small; font-weight: normal;" }
            };
        }

    } 
}
