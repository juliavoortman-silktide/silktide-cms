using Brimit.Silktide.Plugin.Dashboard;
using Brimit.Silktide.Plugin.Providers;
using Brimit.Silktide.Plugin.Services;
using Brimit.Silktide.Umbraco.Plugin.Interfaces;
using Brimit.Silktide.Umbraco.Plugin.Notifications;

using Microsoft.Extensions.DependencyInjection;

using Umbraco.Cms.Core.Composing;
using Umbraco.Cms.Core.DependencyInjection;
using Umbraco.Cms.Core.Notifications;

namespace Brimit.Silktide.Umbraco.Plugin.App_Plugins.Brimit.Silktide.Umbraco.Plugin.Composers
{
    public class SilktideComposer : IComposer
    {
        public void Compose(IUmbracoBuilder builder)
        {
            builder.Dashboards().Add<SilktideDashboard>();
            builder.Services.AddTransient<ISilktideSettingsService, SilktideSettingsService>();
            builder.Services.AddTransient<ISilktideCacheProvider, SilktideCacheProvider>();
            builder.Services.AddTransient<ISilktideRequestService, SilktideRequestService>();
            builder.AddNotificationHandler<RoutingRequestNotification, OnPublishedRequestPrepared>();
            builder.AddNotificationHandler<ContentPublishingNotification, OnContentPublishing>();

            
        }
    }
}