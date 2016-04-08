// ShowResultsCtrl.js

app.controller("MainCtrl", ["$scope","$location","getLatestFSPosts",
  function($scope,$location,getLatestFSPosts) {

    console.log("ShowResultsCtrl is running");

    function fetchResults() {
      getLatestFSPosts.load().then(
        function(cursor) {
          $scope.cursor = cursor;
        },
        function (error) {
          console.log("something went wrong, couldn't load data from CL");
        }
      );
    }
  }
]);
