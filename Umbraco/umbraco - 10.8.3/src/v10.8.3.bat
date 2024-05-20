dotnet new install Umbraco.Templates::10.8.3
# Create solution/project
dotnet new sln --name "Brimit.Silktide.Umbraco.Plugin.v10"
dotnet new umbraco --force -n "Brimit.Silktide.Umbraco.Web"
dotnet sln add "Brimit.Silktide.Umbraco.Web"
dotnet new umbracopackage --force -n "Brimit.Silktide.Umbraco.Plugin"
dotnet sln add "Brimit.Silktide.Umbraco.Plugin"
dotnet run --project "Brimit.Silktide.Umbraco.Web"
#Running