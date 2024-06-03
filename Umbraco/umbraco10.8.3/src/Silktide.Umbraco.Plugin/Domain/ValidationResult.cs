using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace Silktide.Plugin.Domain
{
    [JsonConverter(typeof(StringEnumConverter))]
    public enum ValidationResult
    {
        Valid,
        NotValid,
        Error
    }
}
