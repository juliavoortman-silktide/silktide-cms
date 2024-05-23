using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace Brimit.Silktide.Plugin.Domain
{
    [JsonConverter(typeof(StringEnumConverter))]
    public enum ValidationResult
    {
        Valid,
        NotValid,
        Error
    }
}
