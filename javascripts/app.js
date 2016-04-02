var app = angular.module("cls",['ngRoute']);

app.config(['$routeProvider',  // $routeProvider object is given to us by ngRoute
  function($routeProvider) {
    $routeProvider.  // note similarity of this syntax to switch/case
      when('/main', {
        templateUrl: 'partials/main.html',
        controller: 'MainCtrl'
      }).
      when('/', {
        templateUrl: 'partials/server.html',
        controller: 'ServerCtrl'
      }).
      otherwise({
        redirectTo: '/'
      });
  }
]);