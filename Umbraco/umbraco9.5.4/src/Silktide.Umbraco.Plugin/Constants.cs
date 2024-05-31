namespace Silktide.Plugin
{
	public class SilktideConstants
	{
		public const string SilktideContextKey = "SILKTIDE.CMS";
		public const string SilktideCacheKey = "SILKTIDE.CMS.CACHE";

		public const string SilktidePluginFolder = "/App_Plugins/Silktide.Umbraco.Plugin/";
		public const string SilktidePluginFolderWindowsPath = "App_Plugins\\Silktide.Umbraco.Plugin\\";


		public const string PluginAlias = "Silktide";
		public const string UmbracoDocumentEditPath = "#/content/content/edit/";


		public const string DefaultRemoteHost =
#if DEBUG
			"https://webhook.site/292aa852-b406-4a2c-a429-7a2c1b73b611";
#else
			"https://api.silktide.com/cms/update";
#endif
		public const string DefaultValidationUrl = "https://api.silktide.com/cms/test-key";


	}
}