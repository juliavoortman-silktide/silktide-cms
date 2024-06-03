using Silktide.Plugin.Domain;

namespace Silktide.Umbraco.Plugin.Interfaces
{
    public interface ISilktideSettingsService
    {
        void Update(string key, bool isDisabled);
        SilktideSettings Load();
    }
}
