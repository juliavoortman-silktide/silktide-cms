using Silktide.Plugin.Domain;

namespace Silktide.Umbraco.Plugin.Interfaces
{
    public interface ISilktideCacheProvider
    {
        void Clear();
        SilktideSettings GetSettings();
        void SaveToCache(SilktideSettings settings);

    }
}
