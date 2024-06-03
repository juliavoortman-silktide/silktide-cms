using System;
using System.Collections.Generic;
using System.Linq;

using Silktide.Umbraco.Plugin.Interfaces;

using Microsoft.Extensions.Logging;

using Umbraco.Cms.Core.Events;
using Umbraco.Cms.Core.Models;
using Umbraco.Cms.Core.Models.PublishedContent;
using Umbraco.Cms.Core.Notifications;
using Umbraco.Cms.Core.Web;
using Umbraco.Extensions;

namespace Silktide.Umbraco.Plugin.Notifications
{
    public class OnContentPublishing : INotificationHandler<ContentPublishingNotification>
    {
        private readonly ISilktideRequestService _requestService;
        private readonly ISilktideSettingsService _settingsService;
        private readonly IUmbracoContextFactory _umbracoContextFactory;
        private readonly ILogger _logger;

        public OnContentPublishing(ISilktideRequestService requestService,
            ISilktideSettingsService settingsService,
            IUmbracoContextFactory umbracoContextFactory,
            ILogger<OnContentPublishing> logger)
        {
            _requestService = requestService;
            _settingsService = settingsService;
            _umbracoContextFactory = umbracoContextFactory;
            _logger = logger;
        }

        public void Handle(ContentPublishingNotification notification)
        {
            try
            {
                var settings = _settingsService.Load();
                if (settings.IsDisabled)
                    return;

                List<string> urls = new();

                foreach (IContent content in notification.PublishedEntities)
                {
                    if (content == null)
                        continue;

                    var cultures = content.AvailableCultures;

                    if (cultures == null || !cultures.Any())
                    {
                        // simple content

                        var dirtyProperties = content.GetDirtyProperties()?.Except(new List<string>()
                        {
                            "CultureInfos",
                            "PublishCultureInfos",
                            "UpdateDate"
                        });

                        if (content.TemplateId.HasValue && dirtyProperties != null && dirtyProperties.Any())
                        {
                            using var reference = _umbracoContextFactory.EnsureUmbracoContext();
                            var umbracoContext = reference.UmbracoContext;

                            if (content.Id == 0) continue;

                            var url = umbracoContext.Content.GetById(content.Id).Url(mode: UrlMode.Absolute);
                            if (!string.IsNullOrEmpty(url))
                            {
                                urls.Add(url);
                            }
                        }
                    }
                    else
                    {
                        // varying by culture content

                        foreach (string culture in cultures)
                        {
                            bool isPublishingCulture = notification.IsPublishingCulture(content, culture);

                            var dirtyProperties = content.GetWereDirtyProperties()?.Except(new List<string>()
                            {
                                "CultureInfos",
                                "PublishCultureInfos",
                                "UpdateDate"
                            });

                            if (isPublishingCulture && content.TemplateId.HasValue && dirtyProperties != null && dirtyProperties.Any())
                            {
                                using var reference = _umbracoContextFactory.EnsureUmbracoContext();
                                var umbracoContext = reference.UmbracoContext;
                                var url = umbracoContext.Content.GetById(content.Id).Url(culture, mode: UrlMode.Absolute);

                                if (!string.IsNullOrEmpty(url))
                                {
                                    urls.Add(url);
                                }
                            }
                        }
                    }
                }

                if (urls != null && urls.Any())
                    _requestService.RequestToRemoteApiHost(urls);
            }
            catch (Exception exception)
            {
                _logger.LogError("Silktide: OnContentPublished error {Message}", exception.Message);
            }
        }
    }
}
