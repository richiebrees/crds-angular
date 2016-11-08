using System;
using System.Collections.Generic;
using MinistryPlatform.Translation.Repositories.Interfaces.Rules;

namespace MinistryPlatform.Translation.Repositories.Rules
{
    public class SchoolGradeRule : IRule
    {
        public DateTime StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public int MinGrade { get; set; }
        public int MaxGrade { get; set; }

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
                var grade = int.Parse(data["Grade"].ToString());
                return (MinGrade <= grade) && (grade <= MaxGrade);
            }
            catch (Exception e)
            {
                throw new Exception("Invalid data provided to School Grade Rule!" + e.Message);
            }
        }
    }
}
