using System.Collections.Generic;
using System.Net.Http;
using System.Threading.Tasks;

namespace Silktide.Plugin.Clients
{
    public class RequestClient : BaseRequestClient
    {
        //private static readonly HttpClient Client = new HttpClient();  // static solves the problem of opening too many sockets under load

        public static async Task Request(string url, Dictionary<string, string> postData)
        {
            var content = new FormUrlEncodedContent(postData);
            await Client.PostAsync(url, content).ConfigureAwait(false);
        }

        public static HttpResponseMessage RequestWithResponse(string url, Dictionary<string, string> postData)
        {
                var content = new FormUrlEncodedContent(postData);
                var result = Client.PostAsync(url, content).Result;
                return result;
        }
    }
}