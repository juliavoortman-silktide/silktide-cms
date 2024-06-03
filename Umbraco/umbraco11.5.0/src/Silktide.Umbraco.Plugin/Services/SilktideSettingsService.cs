using System;
using System.IO;

using Silktide.Plugin.Domain;
using Silktide.Umbraco.Plugin.Interfaces;

using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Logging;

using Newtonsoft.Json;

namespace Silktide.Plugin.Services
{
    public class SilktideSettingsService : ISilktideSettingsService
    {
        private readonly IWebHostEnvironment _webHostEnvironment;
        private readonly ILogger _logger;

        private string SettigsFile => Path.Combine(_webHostEnvironment.ContentRootPath, SilktideConstants.SilktidePluginFolderWindowsPath, "silktideConfig.json");

        private readonly ISilktideCacheProvider _cacheProvider;

        public SilktideSettingsService(ISilktideCacheProvider cacheProvider,
            ILogger<SilktideSettingsService> logger,
            IWebHostEnvironment webHostEnvironment)
        {
            _cacheProvider = cacheProvider;
            _logger = logger;
            _webHostEnvironment = webHostEnvironment;
        }

        public void Update(string key, bool isDisabled)
        {
            _cacheProvider.Clear();

            var settings = GetSettings();

            settings.ApiKey = key;
            settings.IsDisabled = isDisabled;

            if (string.IsNullOrEmpty(settings.RemoteHost))
                settings.RemoteHost = SilktideConstants.DefaultRemoteHost;

            if (string.IsNullOrEmpty(settings.ValidationUrl))
                settings.ValidationUrl = SilktideConstants.DefaultValidationUrl;

            SaveToFile(settings);
            _cacheProvider.SaveToCache(settings);
        }

        public SilktideSettings Load()
        {
            return GetSettings();
        }

        private SilktideSettings GetSettings()
        {
            var settingsFromCache = _cacheProvider.GetSettings();
            if (settingsFromCache == null)
            {
                var settings = LoadFromFile();
                _cacheProvider.SaveToCache(settings);

                return settings;
            }

            return settingsFromCache;
        }


        private void SaveToFile(SilktideSettings settings)
        {
            try
            {
                using StreamWriter file = File.CreateText(SettigsFile);
                JsonSerializer serializer = new();
                serializer.Serialize(file, settings);
            }
            catch (Exception ex)
            {
                _logger.LogError("Silktide: Error occurred while file updating file: {Message}", ex.Message);
                throw;
            }
        }


        private SilktideSettings LoadFromFile()
        {
            try
            {
                if (File.Exists(SettigsFile))
                {
                    return JsonConvert.DeserializeObject<SilktideSettings>(File.ReadAllText(SettigsFile));
                }
                else
                {
                    var settings = new SilktideSettings
                    {
                        RemoteHost = SilktideConstants.DefaultRemoteHost,
                        ValidationUrl = SilktideConstants.DefaultValidationUrl
                    };

                    // create by default

                    using (StreamWriter file = File.CreateText(SettigsFile))
                    {
                        JsonSerializer serializer = new();
                        serializer.Serialize(file, settings);
                    }

                    return settings;
                }
            }
            catch (Exception ex)
            {
                _logger.LogError("Silktide: Error occurred while file creating or reading:  {Message}", ex.Message);
                throw;
            }
        }
    }
}
