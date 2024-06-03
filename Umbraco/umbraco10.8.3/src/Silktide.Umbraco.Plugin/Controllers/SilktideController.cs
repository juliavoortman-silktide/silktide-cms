using System;

using Silktide.Plugin.Domain;
using Silktide.Plugin.DTO;
using Silktide.Umbraco.Plugin.Interfaces;

using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

using Umbraco.Cms.Web.BackOffice.Controllers;
using Umbraco.Cms.Web.Common.Attributes;

namespace Silktide.Plugin.Controllers
{
    [PluginController("SilktidePlugin")]
    public class SilktideController : UmbracoAuthorizedApiController
    {
        private readonly ISilktideSettingsService _settingsService;
        private readonly ISilktideRequestService _requestService;
        private readonly ILogger _logger;

        public SilktideController(ISilktideSettingsService settingsService,
            ISilktideRequestService requestService,
            ILogger<SilktideController> logger)
        {
            _settingsService = settingsService;
            _requestService = requestService;
            _logger = logger;
        }

        [HttpPost]
        public IActionResult Save([FromBody] SettingsDTO data)
        {
            try
            {
                _settingsService.Update(data.Key, data.IsDisabled);
            }
            catch (Exception ex)
            {
                _logger.LogError("Silktide: Error occurred while saving:  {Message}", ex.Message);
                return StatusCode(500);
            }

            return Ok();
        }

        [HttpPost]
        public ValidationResult ValidateApiKey([FromBody] string key)
        {
            try
            {
                return _requestService.ValidateApiKey(key);
            }
            catch (Exception ex)
            {
                _logger.LogError("Silktide: Error occurred while saving:  {Message}", ex.Message);
                return ValidationResult.Error;
            }
        }


        [HttpGet]
        public SilktideSettings Load()
        {
            try
            {
                return _settingsService.Load();
            }
            catch (Exception ex)
            {
                _logger.LogError("Silktide: Error occurred settings loading:  {Message}", ex.Message);
                return null;
            }
        }
    }
}
