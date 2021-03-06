﻿using System;
using System.Collections.Generic;
using System.Text.RegularExpressions;
using AutoMapper;
using crds_angular.Models.Crossroads;
using crds_angular.Models.Crossroads.Opportunity;
using crds_angular.Models.Crossroads.Profile;
using crds_angular.Models.Crossroads.Stewardship;
using MinistryPlatform.Translation.Extensions;
using MinistryPlatform.Translation.Models;
using DonationStatus = crds_angular.Models.Crossroads.Stewardship.DonationStatus;
using MpGroup = MinistryPlatform.Translation.Models.MpGroup;
using MpResponse = MinistryPlatform.Translation.Models.MpResponse;

namespace Crossroads.AsyncJobs
{
    public static class AutoMapperConfig
    {
        public static void RegisterMappings()
        {
            Mapper.CreateMap<Dictionary<string, object>, AccountInfo>()
                .ForMember(dest => dest.EmailNotifications,
                    opts => opts.MapFrom(src => src["Bulk_Email_Opt_Out"]));

            Mapper.CreateMap<MpGroup, OpportunityGroup>()
                .ForMember(dest => dest.GroupId, opts => opts.MapFrom(src => src.GroupId))
                .ForMember(dest => dest.Name, opts => opts.MapFrom(src => src.Name))
                .ForMember(dest => dest.EventTypeId, opts => opts.MapFrom(src => src.EventTypeId))
                .ForMember(dest => dest.Participants, opts => opts.MapFrom(src => src.Participants));

            Mapper.CreateMap<MpGroupParticipant, OpportunityGroupParticipant>()
                .ForMember(dest => dest.ContactId, opts => opts.MapFrom(src => src.ContactId))
                .ForMember(dest => dest.GroupRoleId, opts => opts.MapFrom(src => src.GroupRoleId))
                .ForMember(dest => dest.GroupRoleTitle, opts => opts.MapFrom(src => src.GroupRoleTitle))
                .ForMember(dest => dest.LastName, opts => opts.MapFrom(src => src.LastName))
                .ForMember(dest => dest.NickName, opts => opts.MapFrom(src => src.NickName))
                .ForMember(dest => dest.ParticipantId, opts => opts.MapFrom(src => src.ParticipantId));

            Mapper.CreateMap<MpResponse, OpportunityResponseDto>()
                .ForMember(dest => dest.Closed, opts => opts.MapFrom(src => src.Closed))
                .ForMember(dest => dest.Comments, opts => opts.MapFrom(src => src.Comments))
                .ForMember(dest => dest.EventId, opts => opts.MapFrom(src => src.Event_ID))
                .ForMember(dest => dest.OpportunityId, opts => opts.MapFrom(src => src.Opportunity_ID))
                .ForMember(dest => dest.ParticipantId, opts => opts.MapFrom(src => src.Participant_ID))
                .ForMember(dest => dest.ResponseDate, opts => opts.MapFrom(src => src.Response_Date))
                .ForMember(dest => dest.ResponseId, opts => opts.MapFrom(src => src.Response_ID))
                .ForMember(dest => dest.ResponseResultId, opts => opts.MapFrom(src => src.Response_Result_ID));

            Mapper.CreateMap<MpDonationBatch, DonationBatchDTO>()
                .ForMember(dest => dest.BatchName, opts => opts.MapFrom(src => src.BatchName))
                .ForMember(dest => dest.ProcessorTransferId, opts => opts.MapFrom(src => src.ProcessorTransferId))
                .ForMember(dest => dest.DepositId, opts => opts.MapFrom(src => src.DepositId))
                .ForMember(dest => dest.Id, opts => opts.MapFrom(src => src.Id));

            Mapper.CreateMap<Dictionary<string, object>, MpDonationBatch>()
                .ForMember(dest => dest.BatchName, opts => opts.MapFrom(src => src.ToString("Batch_Name")))
                .ForMember(dest => dest.ProcessorTransferId, opts => opts.MapFrom(src => src.ToString("Processor_Transfer_ID")))
                .ForMember(dest => dest.DepositId, opts => opts.MapFrom(src => src.ToNullableInt("Deposit_ID", false)))
                .ForMember(dest => dest.Id, opts => opts.MapFrom(src => src.ContainsKey("dp_RecordID") ? src.ToInt("dp_RecordID", false) : src.ToInt("Batch_ID", false)));

            Mapper.CreateMap<Dictionary<string, object>, MpProgram>()
                .ForMember(dest => dest.ProgramId, opts => opts.MapFrom(src => src.ToInt("Program_ID", false)))
                .ForMember(dest => dest.Name, opts => opts.MapFrom(src => src.ToString("Program_Name")))
                .ForMember(dest => dest.ProgramType, opts => opts.MapFrom(src => src.ToInt("Program_Type_ID", false)))
                .ForMember(dest => dest.CommunicationTemplateId, opts => opts.MapFrom(src => src.ContainsKey("Communication_ID") ? src.ToNullableInt("Communication_ID", false) : (int?)null))
                .ForMember(dest => dest.AllowRecurringGiving, opts => opts.MapFrom(src => src.ToBool("Allow_Recurring_Giving", false)));

            Mapper.CreateMap<MpProgram, ProgramDTO>()
                .ForMember(dest => dest.ProgramType, opts => opts.MapFrom(src => src.ProgramType))
                .ForMember(dest => dest.Name, opts => opts.MapFrom(src => src.Name))
                .ForMember(dest => dest.CommunicationTemplateId, opts => opts.MapFrom(src => src.CommunicationTemplateId))
                .ForMember(dest => dest.ProgramId, opts => opts.MapFrom(src => src.ProgramId));

            Mapper.CreateMap<MpDeposit, DepositDTO>();

            Mapper.CreateMap<Dictionary<string, object>, MpDeposit>()
                .ForMember(dest => dest.DepositDateTime, opts => opts.MapFrom(src => src.ToDate("Deposit_Date", false)))
                .ForMember(dest => dest.DepositName, opts => opts.MapFrom(src => src.ToString("Deposit_Name")))
                .ForMember(dest => dest.Id, opts => opts.MapFrom(src => src.ToInt("Deposit_ID", false)))
                .ForMember(dest => dest.DepositTotalAmount, opts => opts.MapFrom(src => src.ContainsKey("Deposit_Total") ? src["Deposit_Total"] as decimal? : 0))
                .ForMember(dest => dest.BatchCount, opts => opts.MapFrom(src => src.ToInt("Batch_Count", false)))
                .ForMember(dest => dest.Exported, opts => opts.MapFrom(src => src.ToString("Exported")))
                .ForMember(dest => dest.ProcessorTransferId, opts => opts.MapFrom(src => src.ToString("Processor_Transfer_ID")));

            Mapper.CreateMap<MpGPExportDatum, GPExportDatumDTO>()
                .ForMember(dest => dest.DocumentNumber, opts => opts.MapFrom(src => src.DonationId))
                .ForMember(dest => dest.DocumentDescription, opts => opts.MapFrom(src => src.BatchName))
                .ForMember(dest => dest.BatchId, opts => opts.MapFrom(src => src.BatchName))
                .ForMember(dest => dest.ContributionDate, opts => opts.MapFrom(src => src.DonationDate.ToString("MM/dd/yyyy")))
                .ForMember(dest => dest.SettlementDate, opts => opts.MapFrom(src => src.DepositDate.ToString("MM/dd/yyyy")))
                .ForMember(dest => dest.ContributionAmount, opts => opts.MapFrom(src => src.DonationAmount))
                .ForMember(dest => dest.ReceivablesAccount, opts => opts.MapFrom(src => src.ReceivableAccount))
                .ForMember(dest => dest.DistributionAmount, opts => opts.MapFrom(src => src.Amount))
                .ForMember(dest => dest.CashAccount,
                           opts => opts.MapFrom(src => (src.ScholarshipPaymentTypeId == src.PaymentTypeId ? src.ScholarshipExpenseAccount : src.CashAccount)))
                .ForMember(dest => dest.DistributionReference, opts => opts.MapFrom(src => src.DistributionReference));

            Mapper.CreateMap<MpDonation, DonationDTO>()
                .ForMember(dest => dest.Amount, opts => opts.MapFrom(src => src.donationAmt))
                .ForMember(dest => dest.DonationDate, opts => opts.MapFrom(src => src.donationDate))
                .ForMember(dest => dest.Status, opts => opts.MapFrom(src => src.donationStatus))
                .ForMember(dest => dest.Id, opts => opts.MapFrom(src => src.donationId))
                .ForMember(dest => dest.Distributions, opts => opts.MapFrom(src => src.Distributions))
                .ForMember(dest => dest.IncludeOnGivingHistory, opts => opts.MapFrom(src => src.IncludeOnGivingHistory))
                .ForMember(dest => dest.IncludeOnPrintedStatement, opts => opts.MapFrom(src => src.IncludeOnPrintedStatement))
                .ForMember(dest => dest.AccountingCompanyName, opts => opts.MapFrom(src => src.AccountingCompanyName))
                .ForMember(dest => dest.AccountingCompanyIncludeOnPrintedStatement, opts => opts.MapFrom(src => src.AccountingCompanyIncludeOnPrintedStatement))
                .AfterMap((src, dest) =>
                {
                    dest.Source = new DonationSourceDTO
                    {
                        SourceType = ((src.softCreditDonorId != 0) ? PaymentType.SoftCredit : (System.Enum.IsDefined(typeof(PaymentType), src.paymentTypeId) ? (PaymentType)src.paymentTypeId : PaymentType.Other)),
                        PaymentProcessorId = src.transactionCode,
                        AccountHolderName = ((src.softCreditDonorId != 0) ? src.donorDisplayName : null),
                    };
                    if (src.donationAmt < 0)
                    {
                        dest.Status = src.donationStatus == 1 ? DonationStatus.Pending : DonationStatus.Refunded;
                    }
                });

            Mapper.CreateMap<MpContactDonor, EZScanDonorDetails>()
                .ForMember(dest => dest.DisplayName, opts => opts.MapFrom(src => src.Details.DisplayName))
                .ForMember(dest => dest.Address, opts => opts.MapFrom(src => src.Details.Address));

            Mapper.CreateMap<MpDonationDistribution, DonationDistributionDTO>()
                .ForMember(dest => dest.Amount, opts => opts.MapFrom(src => src.donationDistributionAmt))
                .ForMember(dest => dest.ProgramName, opts => opts.MapFrom(src => src.donationDistributionProgram));

            Mapper.CreateMap<MpMyContact, Person>()
                .ForMember(dest => dest.ContactId, opts => opts.MapFrom(src => src.Contact_ID))
                .ForMember(dest => dest.EmailAddress, opts => opts.MapFrom(src => src.Email_Address))
                .ForMember(dest => dest.NickName, opts => opts.MapFrom(src => src.Nickname))
                .ForMember(dest => dest.FirstName, opts => opts.MapFrom(src => src.First_Name))
                .ForMember(dest => dest.MiddleName, opts => opts.MapFrom(src => src.Middle_Name))
                .ForMember(dest => dest.LastName, opts => opts.MapFrom(src => src.Last_Name))
                .ForMember(dest => dest.MaidenName, opts => opts.MapFrom(src => src.Maiden_Name))
                .ForMember(dest => dest.MobilePhone, opts => opts.MapFrom(src => src.Mobile_Phone))
                .ForMember(dest => dest.MobileCarrierId, opts => opts.MapFrom(src => src.Mobile_Carrier))
                .ForMember(dest => dest.DateOfBirth, opts => opts.MapFrom(src => src.Date_Of_Birth))
                .ForMember(dest => dest.MaritalStatusId, opts => opts.MapFrom(src => src.Marital_Status_ID))
                .ForMember(dest => dest.GenderId, opts => opts.MapFrom(src => src.Gender_ID))
                .ForMember(dest => dest.EmployerName, opts => opts.MapFrom(src => src.Employer_Name))
                .ForMember(dest => dest.AddressLine1, opts => opts.MapFrom(src => src.Address_Line_1))
                .ForMember(dest => dest.AddressLine2, opts => opts.MapFrom(src => src.Address_Line_2))
                .ForMember(dest => dest.City, opts => opts.MapFrom(src => src.City))
                .ForMember(dest => dest.State, opts => opts.MapFrom(src => src.State))
                .ForMember(dest => dest.PostalCode, opts => opts.MapFrom(src => src.Postal_Code))
                .ForMember(dest => dest.ParticipantStartDate, opts => opts.MapFrom(src => src.Participant_Start_Date))
                .ForMember(dest => dest.AttendanceStartDate, opts => opts.MapFrom(src => src.Attendance_Start_Date))
                .ForMember(dest => dest.ForeignCountry, opts => opts.MapFrom(src => src.Foreign_Country))
                .ForMember(dest => dest.HomePhone, opts => opts.MapFrom(src => src.Home_Phone))
                .ForMember(dest => dest.CongregationId, opts => opts.MapFrom(src => src.Congregation_ID))
                .ForMember(dest => dest.HouseholdId, opts => opts.MapFrom(src => src.Household_ID))
                .ForMember(dest => dest.HouseholdName, opts => opts.MapFrom(src => src.Household_Name))
                .ForMember(dest => dest.AddressId, opts => opts.MapFrom(src => src.Address_ID))
                .ForMember(dest => dest.Age, opts => opts.MapFrom(src => src.Age));

            Mapper.CreateMap<MpRecurringGift, RecurringGiftDto>()
                .ForMember(dest => dest.EmailAddress, opts => opts.MapFrom(src => src.RecurringGiftId))
                .ForMember(dest => dest.DonorID, opts => opts.MapFrom(src => src.DonorID))
                .ForMember(dest => dest.EmailAddress, opts => opts.MapFrom(src => src.EmailAddress))
                .ForMember(dest => dest.PlanInterval, opts => opts.MapFrom(src => src.Frequency.IndexOf("Monthly", StringComparison.Ordinal) >= 0 ? PlanInterval.Monthly : PlanInterval.Weekly))
                .ForMember(dest => dest.Recurrence, opts => opts.MapFrom(src => src.Recurrence))
                .ForMember(dest => dest.StartDate, opts => opts.MapFrom(src => src.StartDate))
                .ForMember(dest => dest.EndDate, opts => opts.MapFrom(src => src.EndDate))
                .ForMember(dest => dest.PlanAmount, opts => opts.MapFrom(src => src.Amount))
                .ForMember(dest => dest.Program, opts => opts.MapFrom(src => src.ProgramID))
                .ForMember(dest => dest.ProgramName, opts => opts.MapFrom(src => src.ProgramName))
                .ForMember(dest => dest.CongregationName, opts => opts.MapFrom(src => src.CongregationName))
                .ForMember(dest => dest.SubscriptionID, opts => opts.MapFrom(src => src.SubscriptionID))
                .AfterMap((src, dest) =>
                {
                    dest.Source = new DonationSourceDTO
                    {
                        SourceType = (int)AccountType.Checking == src.AccountTypeID ? PaymentType.Bank : PaymentType.CreditCard,
                        AccountNumberLast4 = src.AccountNumberLast4,
                        // Have to remove space to match to enum for things like American Express which needs to be AmericanExpress
                        CardType = src.InstitutionName.Equals("Bank") ? (CreditCardType?)null : (CreditCardType)System.Enum.Parse(typeof(CreditCardType), Regex.Replace(src.InstitutionName, @"\s+", "")),
                        ProcessorAccountId = src.ProcessorAccountId,
                        PaymentProcessorId = src.ProcessorId
                    };
                });
        }
    }
}