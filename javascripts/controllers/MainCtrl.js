app.controller("MainCtrl", ["$scope","getLatestFSPosts",
  function($scope,getLatestFSPosts) {
    console.log("MainCtrl is running");

    $scope.myFilter = function(row) {
      return row.title.toLowerCase().match($scope.searchTerm.toLowerCase());
    }

    $scope.fetchResults = function() {
      getLatestFSPosts.load().then(
        function(cursor) {
          $scope.cursor = cursor;
        },
        function (error) {
          console.log("something went wrong");
        }
      );
    }
  }
]);
