using System;
using System.Collections.Generic;
using MinistryPlatform.Translation.Repositories.Interfaces.Rules;
using MinistryPlatform.Translation.Repositories.Rules;
using NUnit.Framework;

namespace MinistryPlatform.Translation.Test.Services
{
    [TestFixture]
    public class RulesTest
    {
        public IRule TestGenderRule;
        public IRule TestSchoolGradeRule;
        public IRule ExpiredTestRule;

        public Ruleset TestRuleset;

        [SetUp]
        public void Setup()
        {
            TestGenderRule = new GenderRule
            {
                StartDate = DateTime.Today.AddDays(-5),
                EndDate = null,
                AllowedGender = 1
            };

            TestSchoolGradeRule = new SchoolGradeRule
            {
                StartDate = DateTime.Today.AddDays(-10),
                EndDate = DateTime.Today.AddDays(10),
                MaxGrade = 12,
                MinGrade = 8
            };

            ExpiredTestRule = new CongregationRule
            {
                StartDate = DateTime.Today.AddDays(-10),
                EndDate = DateTime.Today.AddDays(-2),
                AllowedCongregation = 1
            };

            TestRuleset = new Ruleset();
            TestRuleset.Rules.Add(TestGenderRule);
            TestRuleset.Rules.Add(TestSchoolGradeRule);
            TestRuleset.Rules.Add(ExpiredTestRule);
        }

        [Test]
        public void GenderRuleShouldPass()
        {
            var testData = new Dictionary<string, object> {{"GenderId", 1}};
            Assert.IsTrue(TestGenderRule.RuleIsActive());
            Assert.IsTrue(TestGenderRule.RulePasses(testData));
        }

        [Test]
        public void GenderRuleShouldFail()
        {
            var testData = new Dictionary<string, object> { { "GenderId", 2 } };
            Assert.IsTrue(TestGenderRule.RuleIsActive());
            Assert.IsFalse(TestGenderRule.RulePasses(testData));
        }

        [Test]
        public void SchoolGradeRuleShouldPass()
        {
            var testData = new Dictionary<string, object> { { "Grade", 10 } };
            Assert.IsTrue(TestSchoolGradeRule.RuleIsActive());
            Assert.IsTrue(TestSchoolGradeRule.RulePasses(testData));
        }

        [Test]
        public void SchoolGradeRuleShouldFail()
        {
            var testData = new Dictionary<string, object> { { "Grade", 2 } };
            Assert.IsTrue(TestSchoolGradeRule.RuleIsActive());
            Assert.IsFalse(TestSchoolGradeRule.RulePasses(testData));
        }

        [Test]
        public void ExpiredRuleShouldNotFail()
        {
            var testData = new Dictionary<string, object> { {"CongregationId", 1} };
            Assert.IsFalse(ExpiredTestRule.RuleIsActive());
            Assert.IsTrue(ExpiredTestRule.RulePasses(testData));
        }

        [Test]
        public void RulesetShouldPass()
        {
            var testData = new Dictionary<string, object> { {"GenderId", 1}, {"CongregationId", 1}, {"Grade", 9} };
            Assert.IsTrue(TestRuleset.AllRulesPass(testData));
        }
    }
}
