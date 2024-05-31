using Silktide.Plugin.Dashboard;
using Silktide.Plugin.Providers;
using Silktide.Plugin.Services;
using Silktide.Umbraco.Plugin.Interfaces;
using Silktide.Umbraco.Plugin.Notifications;

using Microsoft.Extensions.DependencyInjection;

using Umbraco.Cms.Core.Composing;
using Umbraco.Cms.Core.DependencyInjection;
using Umbraco.Cms.Core.Notifications;

namespace Silktide.Umbraco.Plugin.App_Plugins.Silktide.Umbraco.Plugin.Composers
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