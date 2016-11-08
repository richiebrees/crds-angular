using System;
using System.Collections.Generic;
using MinistryPlatform.Translation.Repositories.Interfaces.Rules;

namespace MinistryPlatform.Translation.Repositories.Rules
{
    public class CongregationRule : IRule
    {
        public DateTime StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public int AllowedCongregation { get; set; }

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
                var congregationId = int.Parse(data["CongregationId"].ToString());
                return congregationId == AllowedCongregation;
            }
            catch (Exception e)
            {
                throw new Exception("Invalid data provided to Congregation Rule!" + e.Message);
            }
        }
    }
}
