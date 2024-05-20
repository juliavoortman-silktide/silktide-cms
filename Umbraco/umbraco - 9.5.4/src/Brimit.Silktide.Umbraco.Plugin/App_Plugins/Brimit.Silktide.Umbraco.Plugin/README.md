# Silktide Umbraco CMS Integration

_Umbraco v9.5.4_

## How to integrate Silktide with Umbraco
Written by Julia Voortman

This guide details the Silktide CMS plugin for Umbraco: the Silktide features it enables and how to configure it.
![Image1](https://silktide-487cc78569db.intercom-attachments-7.com/i/o/765227120/7e1082c881fc55220e0b1e4a/8cc23bfec1090fdaea8919e6c7777e6d)
 
### What the Umbraco plugin does

This integration enables two main features:

- Users can easily make page updates where necessary with a one-click switch from the Silktide platform to the editor page in your Umbraco installation.
- Recently updated pages will be automatically checked in Silktide when published, so that your website results are always up-to-date.

### How the Umbraco plugin works

The integration is made up of a plugin, code snippet and API key.

The Silktide plugin does two things:

1. Allows us to find the corresponding editor page URL in Umbraco for a given public website URL.
2. Sends us a webhook when a page is updated in Umbraco.

A code snippet inserted in your master template adds a Silktide-readable meta tag to each page that enables our system to find the Umbraco editor URL.

An API key is used to authenticate calls to our API from Umbraco.

### Configuring the Umbraco CMS integration

#### Requirements

You will need an API key from Silktide, to be able to upload a plugin to your Umbraco installation, and to edit a core page template.

 
1. Install the plugin

[Install plugin here (V9)](https://www.nuget.org/packages/brimit.silktide.umbraco.plugin/9.5.4)
[Install plugin here (V10)](https://www.nuget.org/packages/brimit.silktide.umbraco.plugin/10.8.3)
[Install plugin here (V11)](https://www.nuget.org/packages/brimit.silktide.umbraco.plugin/11.5.0)
 

 i. Navigate to Packages, then Install local inside your Umbraco installation.
 
 ii. Accept the license and select Install package.

 
2. Add code snippet

In your Umbraco backend, navigate to your page templates (ideally your master template) and include the following snippet of code:


        meta name="silktide-cms" content="@Html.Raw(HttpContext.Current.Items["SILKTIDE.CMS"])"

 
3. Create your API key

Silktide provides an API key to authenticate calls to the API from Umbraco.

 
To obtain a key:

1. Login to Silktide.

2. Open the website in Silktide.

3. Select Settings > Integrations.

4. Select the New CMS button.

5. From the dropdown menu select Umbraco and then select the Add button.


You will then be offered an API key that you can copy.

_Note: you will need the appropriate website administrator permissions to set up a new API key._

 
4. API key configuration

Open your Umbraco backend and select Silktide from the Settings menu. Enter the API key provided by Silktide here and select “click here for verification”.

 

If this returns successfully, select Save for the changes to take effect.

 
5. Retesting your site

Once the plugin, API key and code snippet have been configured in Umbraco, you will then need to retest your website inside Silktide.

 

Login to Silktide and select the website, then select Retest in the top right and wait for the site to finish retesting.

 
6. Confirm integration is working

Once the website has finished retesting, you should find a CMS button beside your tested page URLs inside the Inventory:

 ![Image2](https://silktide-487cc78569db.intercom-attachments-7.com/i/o/765227132/bec279ababe7ed0ea10b2677/efc31caef6b894f76ee88e35cdf68519)

If everything is working properly, selecting the ‘CMS’ button here or elsewhere on the platform should open the associated editor page inside your Umbraco admin account.

 
7. Confirmation of working page update webhook

To test that the page update webhook is working, check for an active testing progress banner inside Silktide at the top of the website report the next time a page is updated in Umbraco.
![Image3](https://silktide-487cc78569db.intercom-attachments-7.com/i/o/765227143/09f4f08dfaf0e78aa8ba5ae8/0a2c23d146413eefb6bc38039c9ceb22)
 
Need more help?

If you require any assistance configuring this CMS integration, please reach out to [support@silktide.com](support@silktide.com).

refer to [Silktide](https://help.silktide.com/en/articles/8020884-how-to-integrate-silktide-with-umbraco) for more information


