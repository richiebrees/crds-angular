﻿using System;
using System.Collections.Generic;
using Crossroads.Utilities.Interfaces;
using Crossroads.Web.Common;
using Crossroads.Web.Common.Configuration;
using Crossroads.Web.Common.MinistryPlatform;
using Crossroads.Web.Common.Security;
using MinistryPlatform.Translation.Models;
using MinistryPlatform.Translation.Repositories;
using MinistryPlatform.Translation.Repositories.Interfaces;
using Moq;
using NUnit.Framework;

namespace MinistryPlatform.Translation.Test.Services
{
    [TestFixture]
    public class CampaignRepositoryTest
    {

        private readonly Mock<IMinistryPlatformService> _ministryPlatformService;
        private readonly Mock<IMinistryPlatformRestRepository> _ministryPlatformRest;
        private readonly Mock<IApiUserRepository> _apiUserRepository;
        private readonly Mock<IAuthenticationRepository> _authenticationService;
        private readonly Mock<IConfigurationWrapper> _configWrapper;
        private readonly ICampaignRepository _fixture;

        public CampaignRepositoryTest()
        {
            _ministryPlatformRest = new Mock<IMinistryPlatformRestRepository>();
            _ministryPlatformService = new Mock<IMinistryPlatformService>();
            _apiUserRepository = new Mock<IApiUserRepository>();
            _authenticationService = new Mock<IAuthenticationRepository>();
            _configWrapper = new Mock<IConfigurationWrapper>();
            _fixture = new CampaignRepository(_ministryPlatformService.Object, _authenticationService.Object, _configWrapper.Object, _ministryPlatformRest.Object, _apiUserRepository.Object );
        }

        [Test]
        public void ShouldGetPledgeCampaignWithAgeExceptions()
        {
            const string token = "234rwfdsa";
            const int ageExceptionsPage = 35346;
            const int pledgeCampaignId = 345;

            var columnList = new List<string>
            {
                "Pledge_Campaigns.Pledge_Campaign_ID",
                "Pledge_Campaigns.Campaign_Name",
                "Pledge_Campaign_Type_ID_Table.Campaign_Type",
                "Pledge_Campaigns.Start_Date",
                "Pledge_Campaigns.[End_Date]",
                "Pledge_Campaigns.[Campaign_Goal]",
                "Registration_Form_Table.[Form_ID]",
                "Registration_Form_Table.[Form_Title]",
                "Pledge_Campaigns.[Registration_Start]",
                "Pledge_Campaigns.[Registration_End]",
                "Pledge_Campaigns.[Registration_Deposit]",
                "Pledge_Campaigns.[Youngest_Age_Allowed]",
                "Event_ID_Table.[Event_Start_Date]",
                "Pledge_Campaigns.[Nickname]",
                "Event_ID_Table.[Event_ID]",
                "Pledge_Campaigns.[Program_ID]",
                "Pledge_Campaigns.Maximum_Registrants"
            };

            _ministryPlatformRest.Setup(m => m.UsingAuthenticationToken(token)).Returns(_ministryPlatformRest.Object);
            _ministryPlatformRest.Setup(m => m.Search<MpPledgeCampaign>($"Pledge_Campaigns.[Pledge_Campaign_ID] = {pledgeCampaignId}", columnList, It.IsAny<string>(), It.IsAny<bool>())).Returns(PledgeCampaignList());
            _configWrapper.Setup(m => m.GetConfigIntValue("GoTripAgeExceptions")).Returns(ageExceptionsPage);
            _ministryPlatformService.Setup(m => m.GetSubPageRecords(ageExceptionsPage, pledgeCampaignId, token)).Returns(AgeExceptions());


            var result = _fixture.GetPledgeCampaign(pledgeCampaignId, token);
            Assert.AreEqual(PledgeCampaignList()[0].Id, result.Id);
            Assert.Contains(3453245, result.AgeExceptions);
            Assert.Contains(234897, result.AgeExceptions);
        }

        [Test]
        public void ShouldThrowExceptionIfPledgeCampaignNotFound()
        {
            const string token = "234rwfdsa";
            const int ageExceptionsPage = 35346;
            const int pledgeCampaignId = 345;

            var columnList = new List<string>
            {
                "Pledge_Campaigns.Pledge_Campaign_ID",
                "Pledge_Campaigns.Campaign_Name",
                "Pledge_Campaign_Type_ID_Table.Campaign_Type",
                "Pledge_Campaigns.Start_Date",
                "Pledge_Campaigns.[End_Date]",
                "Pledge_Campaigns.[Campaign_Goal]",
                "Registration_Form_Table.[Form_ID]",
                "Registration_Form_Table.[Form_Title]",
                "Pledge_Campaigns.[Registration_Start]",
                "Pledge_Campaigns.[Registration_End]",
                "Pledge_Campaigns.[Registration_Deposit]",
                "Pledge_Campaigns.[Youngest_Age_Allowed]",
                "Event_ID_Table.[Event_Start_Date]",
                "Pledge_Campaigns.[Nickname]",
                "Event_ID_Table.[Event_ID]",
                "Pledge_Campaigns.[Program_ID]",
                "Pledge_Campaigns.Maximum_Registrants"
            };

            _ministryPlatformRest.Setup(m => m.UsingAuthenticationToken(token)).Returns(_ministryPlatformRest.Object);
            _ministryPlatformRest.Setup(m => m.Search<MpPledgeCampaign>($"Pledge_Campaigns.[Pledge_Campaign_ID] = {pledgeCampaignId}", columnList, It.IsAny<string>(), It.IsAny<bool>())).Returns(new List<MpPledgeCampaign>());
            _configWrapper.Setup(m => m.GetConfigIntValue("GoTripAgeExceptions")).Returns(ageExceptionsPage);
            _ministryPlatformService.Setup(m => m.GetSubPageRecords(ageExceptionsPage, pledgeCampaignId, token)).Returns(AgeExceptions());


            Assert.Throws<Exception>(() =>
            {
                _fixture.GetPledgeCampaign(pledgeCampaignId, token);
            });            
        }

        [Test]
        public void ShouldThrowExceptionIfMultiplePledgeCampaignsFound()
        {
            const string token = "234rwfdsa";
            const int ageExceptionsPage = 35346;
            const int pledgeCampaignId = 345;

            var columnList = new List<string>
            {
                "Pledge_Campaigns.Pledge_Campaign_ID",
                "Pledge_Campaigns.Campaign_Name",
                "Pledge_Campaign_Type_ID_Table.Campaign_Type",
                "Pledge_Campaigns.Start_Date",
                "Pledge_Campaigns.[End_Date]",
                "Pledge_Campaigns.[Campaign_Goal]",
                "Registration_Form_Table.[Form_ID]",
                "Registration_Form_Table.[Form_Title]",
                "Pledge_Campaigns.[Registration_Start]",
                "Pledge_Campaigns.[Registration_End]",
                "Pledge_Campaigns.[Registration_Deposit]",
                "Pledge_Campaigns.[Youngest_Age_Allowed]",
                "Event_ID_Table.[Event_Start_Date]",
                "Pledge_Campaigns.[Nickname]",
                "Event_ID_Table.[Event_ID]",
                "Pledge_Campaigns.[Program_ID]",
                "Pledge_Campaigns.Maximum_Registrants"
            };

            var campaigns = PledgeCampaignList();
            campaigns.Add(new MpPledgeCampaign());

            _ministryPlatformRest.Setup(m => m.UsingAuthenticationToken(token)).Returns(_ministryPlatformRest.Object);
            _ministryPlatformRest.Setup(m => m.Search<MpPledgeCampaign>($"Pledge_Campaigns.[Pledge_Campaign_ID] = {pledgeCampaignId}", columnList, It.IsAny<string>(), It.IsAny<bool>())).Returns(campaigns);
            _configWrapper.Setup(m => m.GetConfigIntValue("GoTripAgeExceptions")).Returns(ageExceptionsPage);
            _ministryPlatformService.Setup(m => m.GetSubPageRecords(ageExceptionsPage, pledgeCampaignId, token)).Returns(AgeExceptions());


            Assert.Throws<InvalidOperationException>(() =>
            {
                _fixture.GetPledgeCampaign(pledgeCampaignId, token);
            });
        }

        private List<Dictionary<string, object>> AgeExceptions()
        {
            return new List<Dictionary<string, object>>
            {
                new Dictionary<string, object>
                {
                    {"Contact_ID", 3453245 }
                },
                new Dictionary<string, object>
                {
                    {"Contact_ID", 234897 }
                }
            };
        }

        private List<MpPledgeCampaign> PledgeCampaignList()
        {
            return new List<MpPledgeCampaign>
            {
                new MpPledgeCampaign()
                {
                    StartDate = DateTime.Now,
                    EndDate = DateTime.Now,
                    EventId = 234,
                    FormId = 234,
                    Goal = 5000.00,
                    Id = 23409,
                    MaximumRegistrants = 45,
                    Name =  "Name"             
                }
            };
        }

    }
}