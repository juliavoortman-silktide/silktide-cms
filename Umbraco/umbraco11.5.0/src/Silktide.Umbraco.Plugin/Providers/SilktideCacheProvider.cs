using Silktide.Plugin.Domain;
using Silktide.Umbraco.Plugin.Interfaces;

using Umbraco.Cms.Core.Cache;
using Umbraco.Extensions;

namespace Silktide.Plugin.Providers
{
    public class SilktideCacheProvider : ISilktideCacheProvider
    {
        private readonly IAppCache appCache;

        public SilktideCacheProvider(
            AppCaches appCaches)
        {
            this.appCache = appCaches.RuntimeCache;
        }

        public void Clear()
        {
            appCache.ClearByKey(SilktideConstants.SilktideCacheKey);
        }

        public SilktideSettings GetSettings()
        {
            return appCache.GetCacheItem<SilktideSettings>(SilktideConstants.SilktideCacheKey);
        }

        public void SaveToCache(SilktideSettings settings)
        {
            appCache.ClearByKey(SilktideConstants.SilktideCacheKey);
            appCache.GetCacheItem(SilktideConstants.SilktideCacheKey, () => settings);
        }
    }


}
