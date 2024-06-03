function silktideController($scope, $http, silktideResource, umbRequestHelper, notificationsService) {

	var vm = this;
	vm.settings = null;
	vm.saveSettings = saveSettings;
	vm.validateApiKey = validateApiKey;
	vm.loading = false;
	vm.keyisnotvalid = false;

	function saveSettings() {
		vm.loading = true;
		umbRequestHelper.resourcePromise(silktideResource.saveSettings(vm.settings.apikey, vm.settings.isdisabled), "Error saving data. Check Umbraco logs for more information.")
			.then(function (response) {
					notificationsService.remove(0);
					notificationsService.success("Silktide", "Settings saved successfully");
					vm.loading = false;
				}, function (err) {
					notificationsService.remove(0);
					notificationsService.error("Error", "There was an error saving the Silktide configuration. " + err);
					vm.loading = false;
				}
			);
	}

	function validateApiKey($event) {
		vm.loading = true;

		$event.preventDefault();

		if (vm.settings.apikey == '' || vm.settings.apikey == null || vm.settings.apikey.length != 32) {
			notificationsService.remove(0);
			notificationsService.warning("Silktide", "API key has wrong format. Length must be 32 characters.");
			vm.keyisnotvalid = true;
			vm.loading = false;
		} else {
			vm.keyisnotvalid = false;
		}

		if (!vm.keyisnotvalid) {
			umbRequestHelper.resourcePromise(silktideResource.validateApiKey(vm.settings.apikey))
				.then(function (response) {
						vm.loading = false;

						if (response == "Valid") {
							notificationsService.remove(0);
							notificationsService.success("Silktide", "API key is valid");
							vm.keyisnotvalid = false;
						}

						if (response == "NotValid") {
							notificationsService.remove(0);
							notificationsService.warning("Silktide", "API key is not valid");
							vm.keyisnotvalid = true;
						}

						if (response == "Error") {
							notificationsService.remove(0);
							notificationsService.warning("Silktide", "Problems with settings or with access to the remote server. Try again later or check the logs.");
							vm.keyisnotvalid = false;
						}

					}, function (err) {
						notificationsService.remove(0);
						notificationsService.error("Error", "There was an error in the Silktide configuration. " + err);
						vm.loading = false;
						vm.keyisnotvalid = false;
					}
				);
		}
	}

	function getSettings() {
		vm.loading = true;
		umbRequestHelper.resourcePromise(silktideResource.loadSettings(), "Error retrieving data.")
			.then(function (response) {
				vm.settings = response;
				vm.loading = false;
			});
	}

	getSettings();
}

angular.module("umbraco").controller("Silktide.Controller", silktideController);