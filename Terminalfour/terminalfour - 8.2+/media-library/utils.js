/* vim :set autoindent expandtab smarttab shiftwidth=2 softtabstop=2 : */
/* global dbStatement, publishCache, section, content, language, isPreview, com, org */

/**
 * Javascript utilities for use within programmable layouts.
 */
({
    /**
     * Copyright notice
     */
    copyright: "TERMINALFOUR",

    /**
     * Version
     */
    version: "0.0.1",

    /**
     * Functions to get information about the TERMINALFOUR installation.
     */
    t4: {

      /**
       * Get the TERMINALFOUR version number.
       */
      version: function() {
        return com.terminalfour.sitemanager.SiteManagerVersion.version;
      },

      /**
       * Get the TERMINALFOUR build details.
       */
      buildDetails: function() {
        return com.terminalfour.sitemanager.SiteManagerVersion.buildDetails;
      }
    },

    /**
     * Function to process the T4 Tag that is provided as a parameter.
     *
     * @param t4Tag   The T4 Tag to be processed.
     *
     * @return    The result of the processed tag.
     */
    processTags: function (t4Tag, contentID, sectionID) {
      var oContent = content || null;
      var CachedSection = section;
      if (typeof contentID !== 'undefined') {
          if (typeof sectionID === 'undefined') {
              document.write('Error: sectionID is undefined');
              return '';
          }
          oContent = utils.getContentFromId(contentID);
          CachedSection = utils.getCachedSectionFromId(sectionID);
          if (CachedSection == '' || !oContent) {
              document.write('Error getting the custom content and section');
              return '';
          }
      }
      return com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, CachedSection, oContent, language, isPreview, t4Tag);
    },

    /**
     * Function to list all of the available properties of an object
     *
     * @param myObject  The object to get information about
     *
     * @return   A list of all object information
     */
    viewObjectProperties: function (myObject) {
      var output = "";
      for (var prop in myObject) {
        output += "object [" + prop + "] :  " + myObject[prop] + "<br/>";
      }
      return output;
    },

    /**
     * Function to match a string in an array
     *
     * @param string The string we're looking for
     * @param expressions Array of expressions we're looking in
     *
     * @return    true/false
     */
    matchInArray: function (string, expressions) {

      var len = expressions.length;

      for (i = 0; i < len; i++) {
          if (string.match(expressions[i])) {
              return true;
          }
      }

      return false;
    },

    /**
     * Function to return the correct link. In T4 links within the CMS and to external webpages are treated as separate elements.
     * Where we want to give users hte choice to add an internal or external link we have to have seperate elements on a content type.
     * Using this function we can pass both in and return the priorised one...
     *
     * @param string internal link
     * @param string external link
     *
     * @return    the link to use
     */
    processLink: function (internal, external) {

      //default
      var link = '#';

      //if internal isn't empty use it...
      if (internal && !internal.isEmpty()) {
        link = internal;
      }

      //if external empty use this and overwrite internal...
      if (external && !external.isEmpty()) {
        link = external;
      }

      return link;
    },
    /**
     * Function to check if a url starts with a protocol, if not it adds it
     *
     * @param string url
     *
     * @return The url with http added if needed
     */
    addHttp: function (url) {
     if (url && !url.isEmpty() && !/^(f|ht)tps?:\/\//i.test(url)) {
        url = "http://" + url;
     }
     return url;
    },

    getContentFromId: function (contentID) {
        if (contentID > 0) {
            var contentManager = com.terminalfour.spring.ApplicationContextProvider.getBean(com.terminalfour.content.IContentManager);
            return contentManager.get(contentID, language);
        }
    },

    getCachedSectionFromId: function (sectionID) {
        if (sectionID > 0) {
            return com.terminalfour.publish.utils.TreeTraversalUtils.findSection(publishCache.getChannel(), section, sectionID, language);
        } else {
            return '';
        }
    },

    getContentFromSection: function (excludeHidden, sectionID) {
        if (typeof sectionID === 'undefined') {
            sectionID = section.getID();
        }
        CachedSection = utils.getCachedSectionFromId(sectionID);
        if (typeof excludeHidden === 'undefined') {
            excludeHidden = true;
        }
        var mode = isPreview ? com.terminalfour.sitemanager.cache.CachedContent.CURRENT : com.terminalfour.sitemanager.cache.CachedContent.APPROVED;
        var sectionContentAll = com.terminalfour.sitemanager.cache.utils.CSHelper.extractCachedContent(CachedSection.getContent(publishCache.getChannel(), language, mode, false));
        sectionContentAll = CachedSection.getContent(language, mode);
        if (excludeHidden === true) {
            return com.terminalfour.sitemanager.cache.utils.CSHelper.extractCachedContent(com.terminalfour.sitemanager.cache.utils.CSHelper.removeSpecialContent(CachedSection.getContent(publishCache.getChannel(), language, mode, false)));
        } else {
            return com.terminalfour.sitemanager.cache.utils.CSHelper.extractCachedContent(CachedSection.getContent(publishCache.getChannel(), language, mode, false));
        }
    },

    getLinkFromSectionLinkElement: function (elementName) {
        if (typeof elementName === 'undefined') {
            document.write('Error: elementName is required.');
            return '';
        }
        var mySSLManager = com.terminalfour.navigation.ServerSideLinkManager.getManager();
        var oConn = dbStatement.getConnection();
        sectionElement = content.get(elementName);
        if (sectionElement.getValue() != '') {
            //myLink.toContentID
            //myLink.toSectionID
            return mySSLManager.getLink(oConn, sectionElement.getValue(), section.getID(), content.getID(), language);
        } else {
            //document.write('Link is empty');
            return '';
        }
    },

    getLayout: function (contentLayout, contentID, sectionID, displayError) {
        if (typeof contentLayout === 'undefined') {
            document.write('Error: contentLayout is required for getLayout (' + contentLayout + ' of ' + contentID + ').');
            return '';
        }
        var oContent = content || null;
        var CachedSection = section;
        if (typeof contentID !== 'undefined') {
            oContent = utils.getContentFromId(contentID);
            if (!oContent) {
                document.write('Error getting the custom content: ' + contentID);
                return '';
            }
            CachedSection = utils.getCachedSectionFromId(sectionID);
            if (CachedSection == '' || !oContent) {
                document.write('Error getting the custom content and section');
                return '';
            }
        }
        //document.write('oContent'+oContent.getID());
        try {
            var tid = oContent.getContentTypeID();
            formatter = contentLayout;
            format = publishCache.getTemplateFormatting(dbStatement, tid, formatter);
            formatString = format.getFormatting();
            processorType = format.getProcessor().getProcessorType();
            if (String(processorType) === 'JavaScript') {
                var sw = new java.io.StringWriter();
                var t4w = new com.terminalfour.utils.T4StreamWriter(sw);
                // BrokerUtils just searches for t4 tags, but this method fully processes the entire piece content using the layout provided
                new com.terminalfour.publish.ContentPublisher() // Tells the publish engine to process a piece of content using the "myLayout" layout
                    .write(t4w, dbStatement, publishCache, CachedSection, oContent, formatter, isPreview); //document here holds the  generated output
                return sw.toString(); //outputs the processed layout to the page
            } else {
                return utils.processTags(formatString, contentID, sectionID);
            }
        } catch (e) {
            if (typeof displayError === 'undefined') {
                displayError = true;
            }
            if (displayError == true) {
                document.write('Error: Content Layout not found: ' + contentLayout + ' of ' + contentID + '.');
            }
            return '';
        }
    },

    contentColumn: function (columnElements, columnLayout, type, htmlBeforeLayout, htmlAfterLayout, htmlBeforeColumnLayout, htmlAfterColumnLayout) {
        if (typeof columnElements === 'undefined') {
            document.write('Please specify the element');
            return '';
        }
        if (typeof columnLayout === 'undefined') {
            columnLayout = 'text/html';
        }
        if (typeof type === 'undefined') {
            type = 'both';
        } else if (type != 'section' && type != 'content') {
            type = 'both';
        }
        if (typeof htmlBeforeLayout === 'undefined') {
            htmlBeforeLayout = '';
        }
        if (typeof htmlAfterLayout === 'undefined') {
            htmlAfterLayout = '';
        }
        if (typeof htmlBeforeColumnLayout !== 'object') {
            htmlBeforeColumnLayout = [];
        }
        if (typeof htmlAfterColumnLayout !== 'object') {
            htmlAfterColumnLayout = [];
        }
        var html = '';
        if (htmlBeforeLayout) {
            html += utils.getLayout(htmlBeforeLayout);
        }
        for (var i = 0; i < columnElements.length; i++) {
            // Get content if content link was created
            if (htmlBeforeColumnLayout[i]) {
                html += utils.getLayout(htmlBeforeColumnLayout[i]);
            }
            var getElementLink = utils.getLinkFromSectionLinkElement(columnElements[i]);
            if (getElementLink != '') {
                if (getElementLink.toContentID > 0 && type != 'section') {
                    html += utils.getLayout(columnLayout, getElementLink.toContentID, getElementLink.toSectionID);
                } else if (getElementLink.toSectionID > 0 && type != 'content') {
                    var sectionContent = utils.getContentFromSection(true, getElementLink.toSectionID);
                    for (var s = 0; s < sectionContent.length; s++) {
                        html += utils.getLayout(columnLayout, sectionContent[s].getID(), getElementLink.toSectionID, false);
                    }
                } else {
                    var linkType = type + ' ';
                    if (linkType == 'both') {
                        linkType = '';
                    }
                    document.write('You didn\'t select a valid ' + linkType + 'link for ' + columnElements[i]);
                    return '';
                }
            }
            if (htmlAfterColumnLayout[i]) {
                html += utils.getLayout(htmlAfterColumnLayout[i]);
            }
        }
        if (htmlAfterLayout) {
            html += utils.getLayout(htmlAfterLayout);
        }
        return html;
    },

    /**
     * Functions to make working with and manipulating JSON easier.
     */
    json: {

      /**
       * Convert a JSON object to a string.
       *
       * @param   input   The JSON object.
       *
       * @return  The string representation of the json object.
       */
      stringify: function (input) {
        var json = "";
        for (var key in input) {
          if (typeof input[key] !== "function") {
            if (json !== "") {
              json += ",";
            }
            json += this.toNameValuePair(key, input[key]);
          }
        }
        json = "[{" + json + "}]";
        return json;
      },

      /**
       * Takes a name/value pair and escapes them into a combines them into a single string in JSON element format.
       *
       * @param   name    The name.
       * @param   value   The value.
       *
       * @return  A stringified JSON element.
       */
      toNameValuePair: function (name, value) {
        return "\"" + this.escapeString(name) + "\": " + ((value == "[object Object]") ? this.stringify(value) : ("\"" + this.escapeString(value)) + "\""); //eslint-disable-line eqeqeq
      },

      /**
       * Function to properly escape a string for use within JSON.
       *
       * @param   input The string to be escaped.
       *
       * @return  The JSON escaped version of the input string.
       */
      escapeString: function (input) {
        return org.apache.commons.lang.StringEscapeUtils.escapeJava(input);
      }
    },

    /**
     * Utility functions related to strings.
     */
    string: {

      /**
       * Function to truncate a string if it's over a specified length.
       *
       * @param   input   The string to be truncated.
       * @param   length  The length that the string should be truncated to.
       *
       * @return  The truncated string.
       */
      truncate: function (input, length) {
        if(input.length <= length) {
          return input;
        }

        return input.substring(0, length);
      }
    },

    /**
     * Utility functionality related to media.
     */
    media: {

      /**
       * Get the piece of media in the current language with the provided id.
       *
       * @param   The media id.
       *
       * @return  The media.
       */
      getMedia: function (mediaId) {
        if(this.base.t4.version().startsWith("7")) {
          return com.terminalfour.publish.utils.PublishUtils.getMedia(dbStatement, publishCache, mediaId, language);
        }
        else {
          return com.terminalfour.media.MediaManager.manager.get(dbStatement, mediaId, language);
        }
      },

      /**
       * Get the dimensions of a piece of media that is an image.
       *
       * @param   media   The piece of media to get the image dimensions of.

       * @return  The image dimensions as an array of numbers [ width | height ]
       */
      getMediaDimensions: function (media) {
        if (typeof this.base === "undefined") {
          throw "this.base not defined. \"init\" method must be called on main utils object.";
        }

        if ((typeof media === "number") || (!isNaN(media))) {
          media = this.getMedia(media);
        }

        return this.base.content.getImageDimensions(media.getContent(), "media");
      },

      /**
       * Get the id of all variants of the media with the provided id.
       *
       * @param   mediaId   The id of the media to get the variants of.
       *
       * @return  An array of the media variant ids.
       */
      getMediaVariants: function (mediaId) {
        return com.terminalfour.media.MediaManager.getMediaVariants(dbStatement.getConnection(), mediaId, language);
      }
    },

    /**
     * Utility functionality related to content.
     */
    content: {

      /**
       * Get the dimensions of an element wthin content that contains an image.
       *
       * <p>
       *  It should be noted that in this case the use of the word image refers to
       *  any element within the content that contains and image file, as opposed
       *  to the element being of type 'Image'.
       * </p>
       *
       * @param   content   The piece of content that contains the element.
       * @param   element   The element within the content that contains the image.

       * @return  The image dimensions as an array of numbers [ width | height ]
       */
      getImageDimensions: function (content, element) {
        return content.get(element).getImageDimensions();
      }
    },
    /**
     * Utility functions related to arrays.
     */
    array: {

      /**
       * Get the mimimum value from an array.
       *
       * @param   array   The array to get the minimum value from.
       *
       * @return  The minimum value from the array.
       */
      min: function (array) {
        return Math.min.apply(Math, array);
      },

      /**
       * Get the maximum value from an array.
       *
       * @param   array   The array to get the maximum value from.
       *
       * @return  The maximum value from the array.
       */
      max: function (array) {
        return Math.max.apply(Math, array);
      }
    },
    /**
     * Utility functions related to search.
     */
     search: {
      processSearchParameters: function (searchParameters) {

        if (typeof searchParameters === 'undefined' || searchParameters == '' ) {
          return '';
        }

        var html = '';
        searchParameters = decodeURI(searchParameters).split('&');

        for (i in searchParameters) {
            var searchParameter = searchParameters[i].split('=');

            if (searchParameter[0] && searchParameter[1]) {
              html += '<input type="hidden" name="' + searchParameter[0].replace('+', ' ') + '" value="' + searchParameter[1].replace('+', ' ') + '" />';
            }
        }
        return html;
      },
     },
    /**
     * Get the contents returned from a web URL.
     * @param {string} urlStr The web address of the page you wish to fetch.
     * @returns {string} The contents of the web page.
     */
    fetch: function(urlStr) {
      if (typeof java == "undefined") {
        throw "This script requires java to run.";
      }
      else {
        var url, urlStream, reader, json, line;

        importPackage(java.io, java.net);

        url = new URL(urlStr); // we pass in a URL to this argument
        urlStream = url.getContent(); // Gets the content of the remote page

        /*
         * InputStreamReader - Reads that return content in as latin-1 character set
         * BufferedReader - Allows you to read more than one character at a time, so its much more efficient
         */
        reader = new BufferedReader(new InputStreamReader(urlStream, "latin1"));

        json = ""; // creates a string to start with

        // loops through each line of the content
        while (line = reader.readLine()) {
          if (line === null) break;
          json+= line; // adds to that string
        }
        return json; //returns a string containing all the json
      }
    },
    getDomainURL: function(defaultDomain) {
      var domain, channel, myMicrosite, publishURL, sectionID, mySection;

      if (typeof defaultDomain === 'undefined') {
        defaultDomain = {};
      }
      sectionID = section.getID();
      mySection  = utils.getCachedSectionFromId(sectionID);
      //Check if is a MicroSite or a Channel
      myMicrosite = publishCache.getMicroSiteFromChild(mySection);
      channel = myMicrosite ? myMicrosite : publishCache.getChannel();
      try {
        publishURL = channel.getChannelPublishURL();
      }
      catch (e) {
        publishURL = '';
      }
      if (publishURL != '') {
          domain = publishURL;
      } else if (channel.getBaseHref() != '') {
          domain = channel.getBaseHref();
          //if my baseURL is just partial, the domain will be added before.
          if (domain.substring(0,1) == '/' && typeof defaultDomain[channel.getID()] !== 'undefined') {
              domain = defaultDomain[channel.getID()]+domain;
          }
      } else if (typeof defaultDomain[channel.getID()] !== 'undefined' && defaultDomain[channel.getID()] !== '') {
          domain = defaultDomain[channel.getID()];
      } else {
          domain = '';
      }
      //Last check is to remove double / and final slash since path already has already
      if (domain.length() >= 2 && domain.substring((domain.length() - 2)) == '//' ) {
          domain = domain.substring(0,(domain.length() - 2));
      } else if (domain.substring((domain.length() - 1)) == '/') {
          domain = domain.substring(0,(domain.length() - 1));
      }

      return domain;
    },
    getFullURL: function(defaultDomain, skipMirrored) {
      var domain, sectionID, mySection;
      fullURL = '';
      if (typeof defaultDomain === 'undefined') {
        defaultDomain = {};
      }
      if (typeof skipMirrored === 'undefined') {
        skipMirrored = true;
      }
      //Check if is a mirrored Section
      if (section.isMirroredSection() && skipMirrored) {
        return fullURL;
      } else if (section.isMirroredSection() && !skipMirrored){
        sectionID = section.getMirrorSource();
      } else {
        sectionID = section.getID();
      }
      mySection  = utils.getCachedSectionFromId(sectionID);
      domain = utils.getDomainURL(sectionID, defaultDomain);
      if (domain == '') {
        new Error('Domain is empty');
      }

      if (com.terminalfour.publish.utils.BrokerUtils.isFullTextPage(publishCache) && !isPreview) {
        var ThreadID, fullTextPageInfo, fullTextContentId, fulltextContent, fullTextTag;
        //get Fulltext CachedContent
        ThreadID = java.lang.Thread.currentThread().getId();
        fullTextPageInfo = publishCache.getGenericProp ('full-text-' + ThreadID);
        try {
          fullTextContentId = fullTextPageInfo.getContentID();
          if (!isNaN (fullTextContentId)) {
            fullTextTag = String(fullTextPageInfo.getT4Tag()).split('(');
            fulltextContent = utils.getContentFromId(fullTextContentId);
            if (fullTextTag !== '') {
              fullURL = domain + com.terminalfour.publish.utils.BrokerUtils.processT4Tags(dbStatement, publishCache, mySection, fulltextContent, language, isPreview, fullTextTag[0]);
            } else {
              fullURL = domain + com.terminalfour.publish.PathBuilder.getLink(dbStatement, section, mySection, publishCache,language,false).getLink();
            }
          } else {
            new Error('getFullURL: Issue with fullTextContentId');
          }
        }
        catch (e) {
          new Error(e);
        }
      } else {
        //get the full Section path
        fullURL = domain + com.terminalfour.publish.PathBuilder.getLink(dbStatement, section, mySection, publishCache,language,false).getLink();
      }
      return fullURL;
    },
    sendPost: function(url, debug, params, timeout, username, password) {
      if (typeof debug === 'undefined') {
        debug = false;
      }
      if (typeof params === 'undefined') {
        params = {};
      }
      if (typeof username === 'undefined') {
        username = '';
      }
      if (typeof password === 'undefined') {
        password = '';
      }
      if (typeof timeout === 'undefined') {
        timeout = 1000;
      } else {
        timeout = parseInt(timeout) > 0 ? parseInt(timeout) : 1000;
      }

      if ((username !== '' && password === '') || (username === '' && password !== '')) {
          new Error('username and password has to be passed both in order to be applied');
      }
      var post, client, config, builder, creds, jsonObj, string, response, br, line, responseString;

      config = org.apache.http.client.config.RequestConfig.custom();
      config.setConnectTimeout(timeout);
      config.setConnectionRequestTimeout(timeout);

      builder = org.apache.http.impl.client.HttpClientBuilder.create();
      builder.setDefaultRequestConfig(config.build());
      client = builder.build();

      if (username !== '' && password !== '') {
        creds = new org.apache.http.impl.client.BasicCredentialsProvider();
        creds.setCredentials(AuthScope.ANY, new org.apache.http.auth.UsernamePasswordCredentials(username, password));
        client.setDefaultCredentialsProvider(creds);
      }

      post = new org.apache.http.client.methods.HttpPost(url);
      if (params !== {}) {
        jsonObj = new org.json.JSONObject(params);
        post.addHeader("content-type", "application/json");
        post.setEntity(new org.apache.http.entity.StringEntity(jsonObj.toString()));
      }

      response = client.execute(post);
      if (response.getStatusLine().getStatusCode() == 200) {
        if (debug) {
          br = new java.io.BufferedReader(new java.io.InputStreamReader(response.getEntity().getContent()));
             responseString = "";
             line = br.readLine();
           while (line != null){
             responseString = response + line;
             line = br.readLine();
           }
          document.write(responseString);
        }
      } else {
        new Error('Silktide: Response Error for' + fullURL + ': ' + response.getStatusLine().getStatusCode() + ' - ' + response.getStatusLine());
      }
    },

    /**
     * Internal initialisation function.
     *
     * <p>
     *  It should be noted that this function self destructs (deletes) once called.
     * </p>
     */
    init: function (node) {
      node = node || this;

      node.base = this;

      for (var i in node) {
        if ((i !== "base") && (typeof node[i] === "object")) {
          this.init(node[i]);
        }
      }
      if (this === node) {
        delete this.init;
      }
      return this;
    }
  }).init();
