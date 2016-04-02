var app = angular.module("cls",['ngRoute']);

app.config(['$routeProvider',  // $routeProvider object is given to us by ngRoute
  function($routeProvider) {
    $routeProvider.  // note similarity of this syntax to switch/case
      when('/', {
        templateUrl: 'partials/main.html',
        controller: 'MainCtrl'
      }).
      otherwise({
        redirectTo: '/'
      });
  }
]);