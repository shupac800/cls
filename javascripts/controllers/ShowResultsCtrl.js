app.controller("ShowResultsCtrl", ["$scope","$location","getLatestFSPosts",
  function($scope,$location,getLatestFSPosts) {
    // $scope.myFilter = function(row) {
    //   return;
    //   //return row.title.toLowerCase().match($scope.searchTerm.toLowerCase());
    // }
    console.log("ShowResultsCtrl is running");
    getLatestFSPosts.load().then(
      function(cursor) {
        $scope.cursor = cursor;
      },
      function (error) {
        console.log("something went wrong");
      }
    );
  }
]);