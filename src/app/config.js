app.config(function($routeProvider, $locationProvider) {
	$routeProvider
		.when('/', {
			templateUrl: 'views/index.html',
			controller: 'IndexCtrl',
      controllerAs: 'index'
		})
		.when('/portfolio', {
    	templateUrl: 'views/portfolio.html',
  		controller: 'PortfolioCtrl',
    	controllerAs: 'portfolio'
    })
    .when('/contact', {
    	templateUrl: 'views/contact.html',
			controller: 'ContactCtrl',
    	controllerAs: 'contact'
  	});

    $locationProvider.html5Mode(true);
});