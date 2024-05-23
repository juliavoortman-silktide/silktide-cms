using Brimit.Silktide.Plugin.Domain;

namespace Brimit.Silktide.Umbraco.Plugin.Interfaces
{
    public interface ISilktideCacheProvider
    {
        void Clear();
        SilktideSettings GetSettings();
        void SaveToCache(SilktideSettings settings);

    }
}
