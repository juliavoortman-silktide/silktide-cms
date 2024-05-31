dotnet new install Umbraco.Templates::9.5.4
# Create solution/project
dotnet new sln --name "Silktide.Umbraco.Plugin.v9"
dotnet new umbraco --force -n "Silktide.Umbraco.Web"
dotnet sln add "Silktide.Umbraco.Web"
dotnet new umbracopackage --force -n "Silktide.Umbraco.Plugin"
dotnet sln add "Silktide.Umbraco.Plugin"
#dotnet run --project "Silktide.Umbraco.Web"
#Running