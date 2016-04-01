var app = angular.module("clScrape", ['ngRoute'])
  .constant('firebaseURL', 'https://pizzapaperairplane.firebaseio.com/');  // ngRoute object from angular-route is dependency -- needed to run

app.config(['$routeProvider',  // $routeProvider object is given to us by ngRoute
  function($routeProvider) {
    $routeProvider.  // note similarity of this syntax to switch/case
      when('/', {
        templateUrl: 'partials/root.html',
        controller: 'RootCtrl'
      }).
      when('/showResults', {
        templateUrl: 'partials/show-results.html',
        controller: 'ShowResultsCtrl'
      }).
      otherwise({
        redirectTo: '/'
      });
  }
]);