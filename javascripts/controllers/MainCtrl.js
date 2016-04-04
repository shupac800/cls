app.controller("MainCtrl", ["$scope","getLatestFSPosts","dataService","$location",
  function($scope,getLatestFSPosts,dataService,$location) {
    console.log("MainCtrl is running");
    var searchData = dataService.getSearchData();  // get parameters from dataService factory

    $scope.myFilter = function(row) {
      return;
      //return row.title.toLowerCase().match($scope.searchTerm.toLowerCase());
    }

    $scope.fetchResults = function() {
      getLatestFSPosts.load().then(
        function(cursor) {
          $scope.cursor = cursor;  // display unfiltered results
        },
        function (error) {
          console.log("something went awry, couldn't load results from CL");
        }
      );
    }

    $scope.jumpToAdminView = function() {
      $location.url("/server");
      //$scope.$apply();
    }

    // $scope.searchterm = searchData.searchterm;
    // $scope.filter = searchData.filter;
    $scope.city = searchData.city;
    $scope.fetchResults();
  }
]);
