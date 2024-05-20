using Brimit.Silktide.Plugin.Domain;

namespace Brimit.Silktide.Umbraco.Plugin.Interfaces
{
    public interface ISilktideSettingsService
    {
        void Update(string key, bool isDisabled);
        SilktideSettings Load();
    }
}
