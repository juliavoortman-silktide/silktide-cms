using Umbraco.Cms.Core;
using Umbraco.Cms.Core.Composing;
using Umbraco.Cms.Core.Dashboards;

namespace Silktide.Plugin.Dashboard
{
    [Weight(100)]
    public class SilktideDashboard : IDashboard
    {
        public string Alias => SilktideConstants.PluginAlias;

        public string[] Sections => new[] { Constants.Applications.Settings };

        public string View => SilktideConstants.SilktidePluginFolder +"dashboard.html";

        public IAccessRule[] AccessRules
        {
            get	
            {
                var rules = new IAccessRule[]
                {
                    new AccessRule {Type = AccessRuleType.Deny, Value = Constants.Security.TranslatorGroupAlias},
                    new AccessRule {Type = AccessRuleType.Grant, Value = Constants.Security.AdminGroupAlias}
                };
                return rules;
            }
        }
    }
}