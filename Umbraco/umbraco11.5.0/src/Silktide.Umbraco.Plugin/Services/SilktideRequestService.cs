using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;

using Silktide.Plugin.Clients;
using Silktide.Plugin.Domain;
using Silktide.Plugin.Extensions;
using Silktide.Umbraco.Plugin.Interfaces;

using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

using Newtonsoft.Json;

using Umbraco.Cms.Core.Configuration.Models;
using Umbraco.Cms.Core.Hosting;
using Umbraco.Cms.Core.Routing;
using Umbraco.Extensions;

namespace Silktide.Plugin.Services
{
    public class SilktideRequestService : ISilktideRequestService
    {
        private readonly IOptions<GlobalSettings> _globalSettings;
        private readonly ISilktideSettingsService _settingsService;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IHostingEnvironment _env;
        private readonly ILogger _logger;

        public SilktideRequestService(ISilktideSettingsService settingsService,
            IOptions<GlobalSettings> globalSettings,
            ILogger<SilktideRequestService> logger,
            IHttpContextAccessor httpContextAccessor,
            IHostingEnvironment env)
        {
            _settingsService = settingsService;
            _globalSettings = globalSettings;
            _httpContextAccessor = httpContextAccessor;
            _logger = logger;
            _env = env;
        }


        public void RequestToRemoteApiHost(List<string> publishedUrl)
        {
            if (publishedUrl == null || !publishedUrl.Any())
                return;

            if (publishedUrl.Count > 0)
            {
                var settings = _settingsService.Load();

                if (settings.IsValid())
                {
                    var postData = GetPublishedPagesQuery(settings.ApiKey, publishedUrl);
                    try
                    {
                        RequestClient.Request(settings.RemoteHost, postData)
                            .ContinueWith(t => _logger.LogError
                                    ("Silktide: RequestToRemoteApiHost error {Message}", t.Exception?.Message), TaskContinuationOptions.OnlyOnFaulted);
                    }
                    catch (Exception ex)
                    {
                        _logger.LogError("Silktide: RequestToRemoteApiHost error {Message}", ex.Message);
                    }
                }
            }
        }

        public ValidationResult ValidateApiKey(string key)
        {
            var settings = _settingsService.Load();
            var postData = GetPublishedPagesQuery(key, new List<string>()
            {
                _httpContextAccessor.HttpContext.Request.Host.Value// fake url
            });

            try
            {
                var result = RequestClient.RequestWithResponse(settings.ValidationUrl, postData);

                if (result.IsSuccessStatusCode)
                {
                    return ValidationResult.Valid;
                }
                else if (result.StatusCode == HttpStatusCode.Forbidden || result.StatusCode == HttpStatusCode.Unauthorized)
                {
                    return ValidationResult.NotValid;
                }
                else
                {
                    return ValidationResult.Error;
                }
            }
            catch (Exception ex)
            {
                _logger.LogError("Silktide: RequestToRemoteApiHost error {Message}", ex.Message);
                return ValidationResult.Error;
            }
        }


        private static Dictionary<string, string> GetPublishedPagesQuery(string apiKey, List<string> urls)
        {
            if (string.IsNullOrEmpty(apiKey) || urls == null || !urls.Any())
                return null;

            Dictionary<string, string> dic = new()
            {
                {"apiKey", apiKey}
            };

            for (int i = 0; i < urls.Count; i++)
            {
                dic.Add("urls[" + i + "]", urls[i]);
            }

            return dic;
        }


        public void GenerateBackofficeUrl(IPublishedRequestBuilder request)
        {
            if (request.HasTemplate() && request.HasPublishedContent() && !request.IsInternalRedirect)
            {
                if (request.Domain != null)
                {
                    string dashboardUrl = GetDashboardPath(request.Domain.Uri, request.PublishedContent.Id, request.Culture.ToString());
                    if (!_httpContextAccessor.HttpContext.Items.ContainsKey(SilktideConstants.SilktideContextKey))
                    {
                        _httpContextAccessor.HttpContext.Items.Add(SilktideConstants.SilktideContextKey, GetBackofficeUrlAsJson(dashboardUrl, true));
                    }
                }
                else
                {
                    string dashboardUrl = GetDashboardPath(request.Uri, request.PublishedContent.Id, request.Culture.ToString());
                    if (!_httpContextAccessor.HttpContext.Items.ContainsKey(SilktideConstants.SilktideContextKey))
                    {
                        _httpContextAccessor.HttpContext.Items.Add(SilktideConstants.SilktideContextKey, GetBackofficeUrlAsJson(dashboardUrl, true));
                    }
                }
            }
        }

        private static string GetBackofficeUrlAsJson(string backofficeUrl, bool encode = false)
        {
            var backofficeInfo = new SilktideBackofficeInfo() { BackofficeUrl = backofficeUrl };
            return encode ? JsonConvert.SerializeObject(backofficeInfo).ToBase64() : JsonConvert.SerializeObject(backofficeInfo);
        }

        private string GetDashboardPath(Uri domain, int id, string culture)
        {
            return new Uri(domain, $"{_globalSettings.Value.GetUmbracoMvcArea(_env)}{SilktideConstants.UmbracoDocumentEditPath}{id}?mculture={culture}").ToString();
        }
    }
}
