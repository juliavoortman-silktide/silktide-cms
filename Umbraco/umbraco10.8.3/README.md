# Introduction 
Silktide is a company that helps customers improve their websites by analyzing the content of
their website in a real browser to give recommendations on how they can improve their SEO,
check for mistakes in content and ensure the page is accessible. Silktide tests these sites every
5 days.
Silktide makes use of plugins for popular CMS’s to allow our customers to inform us when a
page has changed so we check it in under a minute instead of every 5 days. They also use this
plugin so when they have a problem, they can click within our tool on the page and be taken
directly to the edit screen within their CMS (if they’re logged in) to fix the issue we flag.
Silktide have been requested by one of our customers to build an Umbraco plugin.

# How to install the plugin

		dotnet add package Brimit.Silktide.Umbraco.Plugin

# How to remove the plugin

		dotnet remove package Brimit.Silktide.Umbraco.Plugin

# How to setup for the UI
In the .cshtml page template specify the following line in the header
@inject IHttpContextAccessor httpContextAccessor;
<meta name="silktide-cms" content="@Html.Raw(httpContextAccessor.HttpContext.Items["SILKTIDE.CMS"])">

# How to test
The plugin implements 2 things:
## Case A:  
Calling a remote API and passing a key and a list of updated site URLs to it.
- Register a temporary address on https://webhook.site
- Install the plugin in Umbraco
- Replace in ~/App_Plugins/Silktide/silktideConfig.json the ‘host’ parameter. You should get something like this

{"host":"https://webhook.site/55f007a2-aaa7-4ee6-a0f7-9558a2e337e0","apikey":"12321342134"}

- After replacing the address, save the setting again to update the cache
- Test saving content in a variety of ways (with and without additional languages)

### Expected result: 
	When publishing content in case of data changes the remote API should receive data as a POST request like this
	{
		"apiKey": "123456798",
		"urls": ["http://url1.local","http://url2.local"]
	}

## Case B: 
Rendering the path to the admin panel in JSON format in base64 encoding
- Install the plugin in Umbraco
- In the umbraco view  in .cshtml file specify the following lines:
@inject IHttpContextAccessor httpContextAccessor;
@Html.Raw(httpContextAccessor.HttpContext.Items["SILKTIDE.CMS"])


Make sure when you visit the page on which you inserted this code that you see something like this

eyJlZGl0b3JVcmwiOiJodHRwOi8vc2lsa3RpZGUtZW4ubG9jYWwvdW1icmFjbyMvY29udGVudC9jb250ZW50L2VkaXQvMTA2Nj9tY3VsdHVyZT1lbi1VUyJ9

•	Decode string using BASE64 decoder. You should get something like this:

{"editorUrl":"http://silktide-en.local/umbraco#/content/content/edit/1066?mculture=en-US"}

•	Make sure that the current page is available at the parameter specified in the ‘editorUrl’


### Expected result: 
	
	After inserting the code you should get a BASE64 format string which is a link to this page for editing in the admin panel