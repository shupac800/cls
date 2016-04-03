app.controller("MainCtrl", ["$scope","getLatestFSPosts","dataService",
  function($scope,getLatestFSPosts,dataService) {
    console.log("MainCtrl is running");

    $scope.myFilter = function(row) {
      return;
      //return row.title.toLowerCase().match($scope.searchTerm.toLowerCase());
    }

    $scope.fetchResults = function() {
      getLatestFSPosts.load().then(
        function(cursor) {
          // display results
          console.log("got cursor:",cursor);
          $scope.cursor = cursor;
        },
        function (error) {
          console.log("something went awry, couldn't load results from CL");
        }
      );
    }

    var searchData = dataService.getSearchData();  // get parameters from dataService factory
    $scope.searchterm = searchData.searchterm;
    $scope.filter = searchData.filter;
    $scope.fetchResults();
  }
]);
