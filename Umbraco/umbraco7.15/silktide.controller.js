function silktideController($scope, $http, silktideResource, umbRequestHelper, notificationsService) {
	var vm = this;
  vm.settings = {};
  vm.apikey = '';
	vm.saveSettings = saveSettings;
	vm.validateApiKey = validateApiKey;
	vm.loading = false;
	vm.keyisnotvalid = false;
  vm.isdisabled = false;

	function saveSettings() {
		vm.loading = true;
		umbRequestHelper.resourcePromise(silktideResource.saveSettings(vm.apikey, vm.isdisabled), "Error saving data. Check Umbraco logs for more information.")
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

		if (vm.apikey == '' || vm.apikey == null) {
			notificationsService.remove(0);
			notificationsService.warning("Silktide", "API key has wrong format.");
			vm.keyisnotvalid = true;
			vm.loading = false;
		} else {
			vm.keyisnotvalid = false;
		}

		if (!vm.keyisnotvalid) {
			umbRequestHelper.resourcePromise(silktideResource.validateApiKey(vm.apikey))
				.then(function (response) {
						vm.loading = false;
            response = response.replace('"', '').replace('"', '');

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

    umbRequestHelper.resourcePromise(silktideResource.getSettings(), "Error retrieving data.")
			.then(function (response) {
        vm.settings = response;
        vm.apikey = response.apikey;
        vm.isdisabled = response.isdisabled;
				vm.loading = false;
			});
	}

	getSettings();
}

angular.module("umbraco").controller("Silktide.Controller", silktideController);
