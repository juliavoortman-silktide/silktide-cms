using SilktidePlugin.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using Telerik.Sitefinity.Abstractions;
using Telerik.Sitefinity.Data;
using Telerik.Sitefinity.Data.Events;
using Telerik.Sitefinity.Modules.Pages;
using Telerik.Sitefinity.Pages.Model;
using Telerik.Sitefinity.Personalization.Impl.Web.Events;
using Telerik.Sitefinity.Publishing;
using Telerik.Sitefinity.Services;
using Telerik.Sitefinity.Web;
using Telerik.Sitefinity.Web.Events;

namespace SitefinityWebApp
{
    public class Global : System.Web.HttpApplication
    {
        #region Application Start

        /// <summary>
        /// Method to initialized the pages when application is start
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        protected void Application_Start(object sender, EventArgs e)
        {
            Bootstrapper.Initialized += new EventHandler<Telerik.Sitefinity.Data.ExecutedEventArgs>(Bootstrapper_Initialized);
        }
        #endregion
        #region Register Page Event
        /// <summary>
        /// Method to register the page events when application is start
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void Bootstrapper_Initialized(object sender, Telerik.Sitefinity.Data.ExecutedEventArgs e)
        {
            if (e.CommandName == "Bootstrapped")
            {
                EventHub.Subscribe<IDataEvent>(Content_Action);
            }
        }
        #endregion
        #region Published Event Fired
        /// <summary>
        /// When page is published this Method is fired to Send page url with API key
        /// </summary>
        /// <param name="event"></param>
        private void Content_Action(IDataEvent @event)
        {
            var action = @event.Action;
            var contentType = @event.ItemType;
            var itemId = @event.ItemId;
            var providerName = @event.ProviderName;
            var manager = ManagerBase.GetMappedManager(contentType, providerName);

            if (contentType != typeof(PageNode))
            {
                return;
            }
            List<string> urls = new List<string>();
            if (action == "Updated" && @event.GetPropertyValue<bool>("HasPageDataChanged") == true && @event.GetPropertyValue<string>("ApprovalWorkflowState") == "Published")
            {
                var item = (PageNode)manager.GetItemOrDefault(contentType, itemId);
                var url = item.GetUrl(); //returns "~/pageName"
                var fullUrl = UrlPath.ResolveUrl(url, true, true); // returns full url - e.g. "http://localhost:6502/pageName"
                if (!string.IsNullOrEmpty(fullUrl))
                {
                    urls.Add(fullUrl);
                }
                if (urls != null && urls.Any())
                {
                    SilktideSettingsService objSilktideSettingsService = new SilktideSettingsService();
                    objSilktideSettingsService.RequestToRemoteApiHost(urls);
                }
            }
        }
        #endregion
    }
}