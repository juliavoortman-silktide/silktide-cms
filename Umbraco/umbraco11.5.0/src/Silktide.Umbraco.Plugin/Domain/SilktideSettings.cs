using Newtonsoft.Json;

namespace Silktide.Plugin.Domain
{
	public class SilktideSettings
	{
		[JsonProperty(PropertyName = "host")]
		public string RemoteHost { get; set; }

		[JsonProperty(PropertyName = "validationurl")]
		public string ValidationUrl { get; set; }

		[JsonProperty(PropertyName = "apikey")]
		public string ApiKey { get; set; }

		[JsonProperty(PropertyName = "isdisabled")]
		public bool IsDisabled { get; set; }
	}

	public static class SilktideSettingsEx
	{
		public static bool IsValid(this SilktideSettings settings)
		{
			if (settings != null)
			{
				if (!string.IsNullOrEmpty(settings.RemoteHost) 
				    && !string.IsNullOrEmpty(settings.ApiKey) && settings.RemoteHost != "#")
				{
					return true;
				}
			}

			return false;
		}
	}
}
