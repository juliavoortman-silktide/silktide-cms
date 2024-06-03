function silktideResource($http, umbRequestHelper) {

	var controllerBase = "/umbraco/backoffice/SilktidePlugin/Silktide/";

	var loadSettings = function () {
		return $http.get(controllerBase + "load");
	};

	var saveSettings = function (apikey, isdisabled) {
		var data = {
			key: apikey,
			isdisabled: isdisabled
		}
		return $http.post(controllerBase + "save", data);
	};

	var validateApiKey = function (key) {
		return $http.post(controllerBase + "validateApiKey", JSON.stringify(key));
	}

	return {
		loadSettings: loadSettings,
		saveSettings: saveSettings,
		validateApiKey: validateApiKey
	}
}

angular.module("umbraco.resources").factory("silktideResource", silktideResource);