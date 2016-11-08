using System;
using System.Collections.Generic;
using MinistryPlatform.Translation.Repositories.Interfaces.Rules;

namespace MinistryPlatform.Translation.Repositories.Rules
{
    public class GenderRule : IRule
    {
        public DateTime StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public int AllowedGender { get; set; }

        public bool RuleIsActive()
        {
            var now = DateTime.Now;
            return now >= StartDate && (EndDate == null || now < EndDate);
        }

        public bool RulePasses(Dictionary<string, object> data)
        {
            if (!RuleIsActive())
            {
                return true;
            }

            try
            {
                var genderId = int.Parse(data["GenderId"].ToString());
                return genderId == AllowedGender;
            }
            catch (Exception e)
            {
                throw new Exception("Invalid data provided to Gender Rule!" + e.Message);
            }
        }
    }
}
