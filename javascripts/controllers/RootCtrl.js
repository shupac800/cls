// RootCtrl.js

app.controller("RootCtrl", ["$scope","$location",
  function($scope,$location) {
    console.log("RootCtrl is running");
    $scope.searchCL = function() {
      $location.url("/showResults");
    };
  }
]);
