app.controller("RootCtrl", ["$scope",
  function($scope) {
    console.log("RootCtrl is running");
    $scope.searchCL = function() {
      console.log("searching for ",$scope.searchTerm);
    };
  }
]);