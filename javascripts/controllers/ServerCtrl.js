app.controller("ServerCtrl", ["$scope","$http",
  function($scope,$http) {
    console.log("ServerCtrl is running");

    $http.get("http://cls.firebaseio.com/.json")
    .then(
      function(response) {
        console.log("read from Firebase:",response.data);
        $scope.searches = response.data;
      },
      function(error) {
        console.log("something went awry");
      }
    );

    $scope.addSearch = function($http) {
      console.log($scope.searches);
       var newData =      { "user": "DSS",
                            "city": "miami",
                            "created": 1459611762,
                            "filter": "",
                            "interval": 120,
                            "lastsearch": 1459611762,
                            "msgs-sent": 0,
                            "phone": 6155552348,
                            "reported": [],
                            "searchterm": "spore" };
      $scope.searches.newKey = newData;
    }

  }
]);
