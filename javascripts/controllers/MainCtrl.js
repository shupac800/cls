app.controller("MainCtrl", ["$scope","getLatestFSPosts","dataService",
  function($scope,getLatestFSPosts,dataService) {
    console.log("MainCtrl is running");
    var searchData = dataService.getSearchData();  // get parameters from dataService factory

    $scope.myFilter = function(row) {
      return;
      //return row.title.toLowerCase().match($scope.searchTerm.toLowerCase());
    }

    $scope.fetchResults = function() {
      getLatestFSPosts.load().then(
        function(cursor) {
          cursor = cursor.filter(function(cRow) {
            return ( cRow.title.toLowerCase().match( searchData.searchterm.toLowerCase() ) 
                   && !( cRow.title.toLowerCase().match( searchData.filter.toLowerCase() ) ) );
          });
          $scope.cursor = cursor;  // display results
          // if item ID isn't in the "reported" array,
          // do Twilio REST thing for each thing in the cursor
        },
        function (error) {
          console.log("something went awry, couldn't load results from CL");
        }
      );
    }

    $scope.searchterm = searchData.searchterm;
    $scope.filter = searchData.filter;
    $scope.fetchResults();
  }
]);
