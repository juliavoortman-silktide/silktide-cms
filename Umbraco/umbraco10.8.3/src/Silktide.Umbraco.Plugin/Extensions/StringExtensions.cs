using System.Text;

namespace Silktide.Plugin.Extensions
{
	public static class StringExtensions
	{
		public static string ToBase64(this string target)
		{
			if(string.IsNullOrEmpty(target))
				return target;

			return System.Convert.ToBase64String(Encoding.UTF8.GetBytes(target));
		}
	}
}
