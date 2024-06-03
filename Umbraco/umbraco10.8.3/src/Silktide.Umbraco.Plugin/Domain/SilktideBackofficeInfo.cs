using Newtonsoft.Json;

namespace Silktide.Plugin.Domain
{
	public class SilktideBackofficeInfo
	{
		[JsonProperty(PropertyName = "editorUrl")]
		public string BackofficeUrl { get; set; }
	}
}