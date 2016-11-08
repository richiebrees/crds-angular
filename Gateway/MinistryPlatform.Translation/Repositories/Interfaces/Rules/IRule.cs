using System.Collections.Generic;

namespace MinistryPlatform.Translation.Repositories.Interfaces.Rules
{
    public interface IRule
    {
        bool RuleIsActive();
        bool RulePasses(Dictionary<string, object> data);
    }
}
