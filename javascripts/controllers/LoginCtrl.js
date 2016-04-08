// LoginCtrl.js

"use strict";

app.controller("LoginCtrl",
[
  "$scope",
  "$location",
  "$http",
  "authFactory",

  function($scope, $location, $http, authFactory) {

    // Local variables
    var ref = new Firebase("https://cls.firebaseio.com");

    // Variables on $scope for use in DOM
    $scope.account = { email: "", password: "" };
    $scope.message = "";

    /*
      Attempt to register a new user account.
      If successful, immediately log user in.
     */
    $scope.register = () => {
      ref.createUser({
        email    : $scope.account.email,
        password : $scope.account.password
      }, (error, userData) => {
        if (error) {
          console.log(`Error creating user: ${error}`);
        } else {
          console.log(`Created user account with uid: ${userData.uid}`);
          $scope.login();
        }
      });
    };

    /*
      Attempt to authenticate the user with the
      supplied credentials.
     */
    $scope.login = () => 
      authFactory
        .authenticate($scope.account)
        .then(() => {
          $location.url("/server");
          $scope.$apply();
        });


  }
]);
