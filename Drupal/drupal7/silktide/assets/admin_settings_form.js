(function ($) {
  Drupal.behaviors.silktideAdminSettings = {
    attach: function (context, settings) {
      $('input.silktide-endpoint').click(function () {
        $(this).select();
      });
    }
  };

  $(function () {
	 $('#apidata').click(function() {
	   var apikey = document.getElementById("edit-silktide-api-key").value;

	   var URL = 'https://api.silktide.com/cms/test-key?apiKey='+apikey;
     $.ajax({
      type: "POST",
      url:URL,
      dataType: "json",
      contentType: 'application/json; charset=utf-8',
      success: function(data,status,xhr) {
        if (data.status === 'ok') {
          alert('Congratulations! Your API key is valid.');
        } else{
          alert('Oh no! Your API key is not valid.');
        }
      },
      error: function(xhr, status, error) {
		    alert('Oh no! Your API key is not valid.');
		  },
    });
	 });
  });
})(jQuery);
