﻿using System;
using System.Collections.Generic;
using MinistryPlatform.Translation.Models.Rules;
using MinistryPlatform.Translation.Repositories.Interfaces;
using MinistryPlatform.Translation.Repositories.Rules;
using Moq;
using NUnit.Framework;

namespace MinistryPlatform.Translation.Test.Services
{
    [TestFixture]
    public class RulesetRepositoryTest
    {
        private RulesetRepository _fixture;
        private Mock<IApiUserRepository> _apiUserRepository;
        private Mock<IMinistryPlatformRestRepository> _mpRestRepository;
        private readonly string _mockToken = "iRule";

        [SetUp]
        public void SetUpTests()
        {
            _apiUserRepository = new Mock<IApiUserRepository>();
            _mpRestRepository = new Mock<IMinistryPlatformRestRepository>();
            _fixture = new RulesetRepository(_apiUserRepository.Object, _mpRestRepository.Object);
            _apiUserRepository.Setup(m => m.GetToken()).Returns(_mockToken);
            _mpRestRepository.Setup(m => m.UsingAuthenticationToken(_mockToken)).Returns(_mpRestRepository.Object);
        }

        [TearDown]
        public void TearItDown()
        {
            _apiUserRepository.VerifyAll();
            _mpRestRepository.VerifyAll();
        }

        [Test]
        public void ShouldGetRuleset()
        {
            const int ruleSetId = 1;

            var mockRuleSet = new MPRuleSet {Name = "MockRuleset"};

            _mpRestRepository.Setup(m => m.Get<MPRuleSet>(ruleSetId, null)).Returns(mockRuleSet);

            var result = _fixture.GetRulesetFromMP(ruleSetId);

            Assert.AreEqual("MockRuleset", result.Name);
        }

        [Test]
        public void ShouldGetRulesInRuleset()
        {
            const int ruleSetId = 1;

            _mpRestRepository.Setup(m => m.Search<MPGenderRule>($"Ruleset_ID = {ruleSetId}", null as string, null, false)).Returns(MockGenderRules());
            _mpRestRepository.Setup(m => m.Search<MPRegistrationRule>($"Ruleset_ID = {ruleSetId}", null as string, null, false)).Returns(MockRegistrationRules());

            var result = _fixture.GetRulesInRuleset(ruleSetId);
            Assert.AreEqual(2, result.Count);
        }

        [Test]
        public void ShouldGetRulesInRulesetNoGenderRules()
        {
            const int ruleSetId = 1;

            _mpRestRepository.Setup(m => m.Search<MPGenderRule>($"Ruleset_ID = {ruleSetId}", null as string, null, false)).Returns(new List<MPGenderRule>());
            _mpRestRepository.Setup(m => m.Search<MPRegistrationRule>($"Ruleset_ID = {ruleSetId}", null as string, null, false)).Returns(MockRegistrationRules());

            var result = _fixture.GetRulesInRuleset(ruleSetId);
            Assert.AreEqual(1, result.Count);
        }

        [Test]
        public void ShouldPassAllRules()
        {
            const int ruleSetId = 1;
            var testData = new Dictionary<string, object>
            {
                {"GenderId", 2},
                {"registrantCount", 54}
            };

            _mpRestRepository.Setup(m => m.Search<MPGenderRule>($"Ruleset_ID = {ruleSetId}", null as string, null, false)).Returns(MockGenderRules());
            _mpRestRepository.Setup(m => m.Search<MPRegistrationRule>($"Ruleset_ID = {ruleSetId}", null as string, null, false)).Returns(MockRegistrationRules());
            var rules = _fixture.GetRulesInRuleset(ruleSetId);

            var result = _fixture.AllRulesPass(rules, testData);
            Assert.IsTrue(result.AllRulesPass);
            Assert.AreEqual(2, result.RuleResults.Count);
        }

        [Test]
        public void ShouldPassIfThereAreNoRulesInRuleset()
        {            
            const int ruleSetId = 1;
            var testData = new Dictionary<string, object>
            {
                {"GenderId", 2},
                {"registrantCount", 54}
            };

            _mpRestRepository.Setup(m => m.Search<MPGenderRule>($"Ruleset_ID = {ruleSetId}", null as string, null, false)).Returns(new List<MPGenderRule>());
            _mpRestRepository.Setup(m => m.Search<MPRegistrationRule>($"Ruleset_ID = {ruleSetId}", null as string, null, false)).Returns(new List<MPRegistrationRule>());
            var rulesFetched = _fixture.GetRulesInRuleset(ruleSetId);

            var res = _fixture.AllRulesPass(rulesFetched, testData);
            Assert.IsTrue(res.AllRulesPass);
        }

        private List<MPGenderRule> MockGenderRules()
        {
            return new List<MPGenderRule>
            {
                new MPGenderRule
                {
                    AllowedGenderId = 2,
                    StartDate = DateTime.MinValue,
                    EndDate = DateTime.MaxValue
                }
            };
        }

        private List<MPRegistrationRule> MockRegistrationRules()
        {
            return new List<MPRegistrationRule>
            {
                new MPRegistrationRule
                {
                    MinimumRegistrants = 0,
                    MaximumRegistrants = 9999,
                    StartDate = DateTime.MinValue,
                    EndDate = DateTime.MaxValue
                }
            };
        }
    }
}
