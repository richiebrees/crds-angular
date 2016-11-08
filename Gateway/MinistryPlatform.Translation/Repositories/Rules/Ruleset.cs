using System.Collections.Generic;
using System.Linq;
using MinistryPlatform.Translation.Repositories.Interfaces.Rules;

namespace MinistryPlatform.Translation.Repositories.Rules
{
    public class Ruleset
    {
        public List<IRule> Rules { get; set; }

        public Ruleset()
        {
            Rules = new List<IRule>();    
        }

        public bool AllRulesPass(Dictionary<string, object> testData )
        {
            return Rules.Where(rule => rule.RuleIsActive()).All(rule => rule.RulePasses(testData));
        }
    }
}
