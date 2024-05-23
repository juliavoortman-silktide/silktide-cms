try {
    var EvalMediaTagImports = JavaImporter(
        org.apache.commons.io.IOUtils,
        com.terminalfour.media.IMediaManager,
        com.terminalfour.spring.ApplicationContextProvider
    )

    with(EvalMediaTagImports) {
        var silkTydeApiURL,
            silkTideApiKey,
            silkTideDeferSec,
            utils,
            utilsMediaID,
            mediaManager,
            fullURL,
            params

        silkTideApiURL = 'https://api.silktide.com/cms/update'
        silkTideApiKey = '<!-- INSERT SILKTIDE TOKEN -->'
        utilsMediaID = <!-- INSERT ID-->
        silkTideDeferSec = 1800

        if (
            typeof silkTideApiURL === 'undefined' ||
            typeof silkTideApiKey === 'undefined'
        ) {
            new Error('Silktide variables not set correctly')
        }
        if (silkTideApiURL === '' || silkTideApiKey === '') {
            new Error('Silktide variables are empty')
        }

        if (!isPreview) {
            if (typeof silkTideDeferSec === 'undefined') {
                silkTideDeferSec = 1800
            } else {
                silkTideDeferSec =
                    parseInt(silkTideDeferSec) > 0 ? parseInt(silkTideDeferSec) : 1800
            }
            mediaManager = ApplicationContextProvider.getBean(IMediaManager)
            var channel = publishCache.getChannel()
            if (mediaManager.exists(utilsMediaID)) {
                utils = eval(
                    String(
                        IOUtils.toString(
                            mediaManager.get(utilsMediaID, language).getMedia()
                        )
                    )
                )

                var filesToPublish = ''
                var mediaPath = channel.getFileOutputPath() + 'media/'
                var list = {};
                list['silkTideApiURL'] = silkTideApiURL;
                list['silkTideApiKey'] = silkTideApiKey;
                list['silkTideDeferSec'] = silkTideDeferSec;
                list['rootURL'] = utils.getDomainURL();
              	list['now'] = new Date().getTime();

            }
            var jsonObj = new org.json.JSONObject(list);
            document.write(jsonObj.toString());

        }
    }
} catch (e) {

    java.lang.System.out.println(
        'Silktide:  Config File: ' +
        content.getID() +
        ' and section: ' +
        section.getID() +
        ' Error: ' +
        e
    )
}
