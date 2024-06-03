using System;

using Silktide.Umbraco.Plugin.Interfaces;

using Microsoft.Extensions.Logging;

using Umbraco.Cms.Core.Events;
using Umbraco.Cms.Core.Notifications;

namespace Silktide.Umbraco.Plugin.Notifications
{
	public class OnPublishedRequestPrepared : INotificationHandler<RoutingRequestNotification>
	{
		private readonly ISilktideRequestService _requestService;
		private readonly ISilktideSettingsService _settingsService;
		private readonly ILogger _logger;

		public OnPublishedRequestPrepared(ISilktideRequestService requestService,
			ISilktideSettingsService settingsService,
			ILogger<OnPublishedRequestPrepared> logger
			)
		{
			_requestService = requestService;
			_settingsService = settingsService;
			_logger = logger;
		}

		public void Handle(RoutingRequestNotification notification)
		{
			try
			{
				var settings = _settingsService.Load();
				if (settings.IsDisabled)
					return;

				if (notification != null)
				{

					_requestService.GenerateBackofficeUrl(notification.RequestBuilder);
				}
			}
			catch (Exception exception)
			{
				_logger.LogError("Silktide: OnPublishedRequest error {Message}", exception.Message);
			}
		}
	}
}
