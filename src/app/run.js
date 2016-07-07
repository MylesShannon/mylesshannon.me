app.run(function($rootScope) {
	$(document).ready(function() {
		// collapse the navbar menu when a tab is tapped on mobile
		$(document).on('click','.navbar-collapse.in',function(e) {
		    if( $(e.target).is('a') && $(e.target).attr('class') != 'dropdown-toggle' ) {
		        $(this).collapse('hide');
		    }
		});
	})
})