using System.Collections.Generic;

using Brimit.Silktide.Plugin.Domain;

using Umbraco.Cms.Core.Routing;

namespace Brimit.Silktide.Umbraco.Plugin.Interfaces
{
    public interface ISilktideRequestService
    {
        void RequestToRemoteApiHost(List<string> contents);
        ValidationResult ValidateApiKey(string key);
        void GenerateBackofficeUrl(IPublishedRequestBuilder request);
    }
}
