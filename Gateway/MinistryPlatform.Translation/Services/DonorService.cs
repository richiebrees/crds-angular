﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using Crossroads.Utilities;
using Crossroads.Utilities.Interfaces;
using log4net;
using MinistryPlatform.Models;
using MinistryPlatform.Translation.Enum;
using MinistryPlatform.Translation.Extensions;
using MinistryPlatform.Translation.Services.Interfaces;

namespace MinistryPlatform.Translation.Services
{
    public class DonorService : BaseService, IDonorService
    {
        private readonly ILog _logger = LogManager.GetLogger(typeof(DonorService));

        private readonly int _donorPageId;
        private readonly int _donationPageId;
        private readonly int _donationDistributionPageId;
        private readonly int _donorAccountsPageId;
        private readonly int _findDonorByAccountPageViewId;
        private readonly int _donorLookupByEncryptedAccount;

        public const string DonorRecordId = "Donor_Record";
        public const string DonorProcessorId = "Processor_ID";
        public const string EmailReason = "None";
        public const string DefaultInstitutionName = "Bank";
        public const string DonorRoutingNumberDefault = "0";
        public const string DonorAccountNumberDefault = "0";

        private readonly IMinistryPlatformService _ministryPlatformService;
        private readonly IProgramService _programService;
        private readonly ICommunicationService _communicationService;
        private readonly IContactService _contactService;
        private readonly ICryptoProvider _crypto;

        public DonorService(IMinistryPlatformService ministryPlatformService, IProgramService programService, ICommunicationService communicationService, IAuthenticationService authenticationService, IContactService contactService, IConfigurationWrapper configuration, ICryptoProvider crypto)
            : base(authenticationService, configuration)
        {
            _ministryPlatformService = ministryPlatformService;
            _programService = programService;
            _communicationService = communicationService;
            _contactService = contactService;
            _crypto = crypto;

            _donorPageId = configuration.GetConfigIntValue("Donors");
            _donationPageId = configuration.GetConfigIntValue("Donations");
            _donationDistributionPageId = configuration.GetConfigIntValue("Distributions");
            _donorAccountsPageId = configuration.GetConfigIntValue("DonorAccounts");
            _findDonorByAccountPageViewId = configuration.GetConfigIntValue("FindDonorByAccountPageView");
            _donorLookupByEncryptedAccount = configuration.GetConfigIntValue("DonorLookupByEncryptedAccount");
        }


        public int CreateDonorRecord(int contactId, string processorId, string accountProcessorId, DateTime setupTime,
            int? statementFrequencyId = 1, // default to quarterly
            int? statementTypeId = 1, //default to individual
            int? statementMethodId = 2, // default to email/online
            DonorAccount donorAccount = null
            )
        {
            //this assumes that you do not already have a donor record - new giver
            var values = new Dictionary<string, object>
            {
                {"Contact_ID", contactId},
                {"Statement_Frequency_ID", statementFrequencyId},
                {"Statement_Type_ID", statementTypeId}, 
                {"Statement_Method_ID", statementMethodId},
                {"Setup_Date", setupTime},    //default to current date/time
                {"Processor_ID", processorId}
            };

            var apiToken = ApiLogin();

            int donorId;

            try
            {
                donorId = _ministryPlatformService.CreateRecord(_donorPageId, values, apiToken, true);
            }
            catch (Exception e)
            {
                throw new ApplicationException(string.Format("CreateDonorRecord failed.  Contact Id: {0}", contactId), e);
            }

            // Create a new DonorAccount for this donor, if we have account info
            if (donorAccount != null)
            {
                values = new Dictionary<string, object>
                {
                    { "Institution_Name", DefaultInstitutionName },
                    { "Account_Number", DonorAccountNumberDefault },
                    { "Routing_Number", DonorRoutingNumberDefault },
                    { "Encrypted_Account", CreateEncodedAndEncryptedAccountAndRoutingNumber(donorAccount.AccountNumber, donorAccount.RoutingNumber) },
                    { "Donor_ID", donorId },
                    { "Non-Assignable", false },
                    { "Account_Type_ID", (int)donorAccount.Type },
                    { "Closed", false },
                    {"Processor_Account_ID", accountProcessorId}
                };

                _ministryPlatformService.CreateRecord(_donorAccountsPageId, values, apiToken);
            }
            return donorId;

        }

        public int CreateDonationAndDistributionRecord(int donationAmt, int? feeAmt, int donorId, string programId, string chargeId, string pymtType, string processorId, DateTime setupTime, bool registeredDonor, string checkScannerBatchName = null)
        {
            var pymtId = PaymentType.getPaymentType(pymtType).id;
            var fee = feeAmt.HasValue ? feeAmt / Constants.StripeDecimalConversionValue : null;


            var apiToken = ApiLogin();
            
            var donationValues = new Dictionary<string, object>
            {
                {"Donor_ID", donorId},
                {"Donation_Amount", donationAmt},
                {"Processor_Fee_Amount", fee},
                {"Payment_Type_ID", pymtId},
                {"Donation_Date", setupTime},
                {"Transaction_code", chargeId},
                {"Registered_Donor", registeredDonor},
                {"Processor_ID", processorId },
                {"Donation_Status_Date", setupTime},
                {"Donation_Status_ID", 1} //hardcoded to pending 
            };
            if (!string.IsNullOrWhiteSpace(checkScannerBatchName))
            {
                donationValues["Check_Scanner_Batch"] = checkScannerBatchName;
            }

            int donationId;

            try
            {
                donationId = _ministryPlatformService.CreateRecord(_donationPageId, donationValues, apiToken, true);
            }
            catch (Exception e)
            {
                throw new ApplicationException(string.Format("CreateDonationRecord failed.  Donor Id: {0}", donorId), e);
            }

            if (string.IsNullOrWhiteSpace(programId))
            {
                return (donationId);
            }
            
            var distributionValues = new Dictionary<string, object>
            {
                {"Donation_ID", donationId},
                {"Amount", donationAmt},
                {"Program_ID", programId}
            };

            try
            {
                _ministryPlatformService.CreateRecord(_donationDistributionPageId, distributionValues, apiToken, true);
            }
            catch (Exception e)
            {
                throw new ApplicationException(
                    string.Format("CreateDonationDistributionRecord failed.  Donation Id: {0}", donationId), e);
            }

            try
            {
                SetupConfirmationEmail(Convert.ToInt32(programId), donorId, donationAmt, setupTime, pymtType);
            }
            catch (Exception)
            {
                _logger.Error(string.Format("Failed when processing the template for Donation Id: {0}", donationId));
            }

            return donationId;
        }

        public ContactDonor GetContactDonor(int contactId)
        {
            ContactDonor donor;
            try
            {
                var searchStr = contactId + ",";
                var records =
                    WithApiLogin(
                        apiToken => (_ministryPlatformService.GetPageViewRecords("DonorByContactId", apiToken, searchStr)));
                if (records != null && records.Count > 0)
                {
                    var record = records.First();
                    donor = new ContactDonor()
                    {
                        DonorId = record.ToInt("Donor_ID"),
                        ProcessorId = record.ToString(DonorProcessorId),
                        ContactId = record.ToInt("Contact_ID"),
                        RegisteredUser = true,
                        Email = record.ToString("Email")
                    };
                }
                else
                {
                    donor = new ContactDonor {
                        ContactId = contactId,
                        RegisteredUser = true
                    };
                }
            }
            catch (Exception ex)
            {
                throw new ApplicationException(
                    string.Format("GetDonorRecord failed.  Contact Id: {0}", contactId), ex);
            }

            return donor;

        }
        public ContactDonor GetPossibleGuestContactDonor(string email)
        {
            ContactDonor donor;
            try
            {
                if (string.IsNullOrWhiteSpace(email))
                {
                    return null;
                }
                var searchStr =  "," + email;
                var records =
                    WithApiLogin(
                        apiToken => (_ministryPlatformService.GetPageViewRecords("PossibleGuestDonorContact", apiToken, searchStr)));
                if (records != null && records.Count > 0)
                {
                    var record = records.First();
                    donor = new ContactDonor()
                    {
                        
                        DonorId = record.ToInt(DonorRecordId),
                        ProcessorId = record.ToString(DonorProcessorId),
                        ContactId = record.ToInt("Contact_ID"),
                        Email = record.ToString("Email_Address"),
                        RegisteredUser = false
                    };
                }
                else
                {
                    return null;
                }
            }
            catch (Exception ex)
            {
                throw new ApplicationException(
                    string.Format("GetPossibleGuestDonorContact failed. Email: {0}", email), ex);
            }

            return donor;

        }

        public ContactDonor GetContactDonorForDonorAccount(string accountNumber, string routingNumber)
        {
            var search = string.Format(",{0}", CreateEncodedAndEncryptedAccountAndRoutingNumber(accountNumber, routingNumber));

            var accounts = WithApiLogin(apiToken => _ministryPlatformService.GetPageViewRecords(_findDonorByAccountPageViewId, apiToken, search));
            if (accounts == null || accounts.Count == 0)
            {
                return (null);
            }

            var contactId = accounts[0]["Contact_ID"] as int? ?? -1;
            return contactId == -1 ? (null) : (GetContactDonor(contactId));
        }

        public ContactDetails GetContactDonorForCheckAccount(string encrptedKey)
        {
            var donorAccount = WithApiLogin(apiToken => _ministryPlatformService.GetPageViewRecords(_donorLookupByEncryptedAccount, apiToken, "," + encrptedKey));
            if (donorAccount == null || donorAccount.Count == 0)
            {
                return null;
            }
            var contactId = Convert.ToInt32(donorAccount[0]["Contact_ID"]);
            var myContact = _contactService.GetContactById(contactId);

            var details = new ContactDetails
            {
                DisplayName = donorAccount[0]["Display_Name"].ToString(),
                Address =  new PostalAddress
                {
                    Line1 = myContact.Address_Line_1,
                    Line2 = myContact.Address_Line_2,
                    City = myContact.City,
                    State = myContact.State,
                    PostalCode = myContact.Postal_Code  
                }
            };

            return details;
        }

        private string CreateEncodedAndEncryptedAccountAndRoutingNumber(string accountNumber, string routingNumber)
        {
            var acct = _crypto.EncryptValue(accountNumber);
            var rtn = _crypto.EncryptValue(routingNumber);

            return (Convert.ToBase64String(acct.Concat(rtn).ToArray()));
        }

        public int UpdatePaymentProcessorCustomerId(int donorId, string paymentProcessorCustomerId)
        {
            var parms = new Dictionary<string, object> {
                { "Donor_ID", donorId },
                { DonorProcessorId, paymentProcessorCustomerId },
            };

            try
            {
                _ministryPlatformService.UpdateRecord(_donorPageId, parms, ApiLogin());
            }
            catch (Exception e)
            {
                throw new ApplicationException(
                    string.Format("UpdatePaymentProcessorCustomerId failed. donorId: {0}, paymentProcessorCustomerId: {1}", donorId, paymentProcessorCustomerId), e);
            }

            return (donorId);
        }


        public void SetupConfirmationEmail(int programId, int donorId, int donationAmount, DateTime setupDate, string pymtType)
        {
            var program = _programService.GetProgramById(programId);
            //If the communcations admin does not link a message to the program, the default template will be used.
            var communicationTemplateId = program.CommunicationTemplateId ?? AppSetting("DefaultGiveConfirmationEmailTemplate");

            SendEmail(communicationTemplateId, donorId, donationAmount, pymtType, setupDate, program.Name, EmailReason);
        }

        public ContactDonor GetEmailViaDonorId(int donorId)
        {
            var donor = new ContactDonor();
            try
            {
                var searchStr = "," + donorId.ToString();
                var records =
                    WithApiLogin(
                        apiToken => (_ministryPlatformService.GetPageViewRecords("DonorByContactId", apiToken, searchStr)));
                if (records != null && records.Count > 0)
                {
                    var record = records.First();

                    donor.Email = record.ToString("Email");
                    donor.ContactId = record.ToInt("Contact_ID");
                }
            }
            catch (Exception ex)
            {
                throw new ApplicationException(
                    string.Format("GetEmailViaDonorId failed.  Donor Id: {0}", donorId), ex);
            }

            return donor;
        }

        public void SendEmail(int communicationTemplateId, int donorId, int donationAmount, string paymentType, DateTime setupDate, string program, string emailReason)
        {
            var template = _communicationService.GetTemplate(communicationTemplateId);

            var contact = GetEmailViaDonorId(donorId);

            var comm = new Communication
            {
                AuthorUserId = 5,
                DomainId = 1,
                EmailBody = template.Body,
                EmailSubject = template.Subject,
                FromContactId = 5,
                FromEmailAddress = "giving@crossroads.net",
                ReplyContactId = 5,
                ReplyToEmailAddress = "giving@crossroads.net",
                ToContactId = contact.ContactId,
                ToEmailAddress = contact.Email,
                MergeData = new Dictionary<string, object>
                {
                    {"Program_Name", program},
                    {"Donation_Amount", donationAmount},
                    {"Donation_Date", setupDate},
                    {"Payment_Method", paymentType},
                    {"Decline_Reason", emailReason}
                }
            };


            _communicationService.SendMessage(comm);
        }
    }

}