using Newtonsoft.Json;

namespace Brimit.Silktide.Plugin.Domain
{
	public class SilktideBackofficeInfo
	{
		[JsonProperty(PropertyName = "editorUrl")]
		public string BackofficeUrl { get; set; }
	}
}