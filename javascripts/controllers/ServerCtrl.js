app.controller("ServerCtrl", ["$scope","$http","$compile",
  function($scope,$http,$compile) {

    console.log("ServerCtrl is running");

    $http.get("http://cls.firebaseio.com/.json")
    .then(
      function(response) {
        console.log("read from Firebase:",response.data);
        $scope.searches = response.data;
        Object.keys($scope.searches).forEach(function(thisKey) {
          $scope.searches[thisKey].hcreated = new Date($scope.searches[thisKey].created * 1000);
          $scope.searches[thisKey].hlastsearch = new Date($scope.searches[thisKey].lastsearch * 1000);
        });
      },
      function(error) {
        console.log("something went awry");
      }
    );


    $scope.gotEnter = function(e) {
      console.log($scope.editText);
      $("#editing").replaceWith($scope.editText);

    }

    $scope.editCell= function(e) {
      editing = e;
      console.log("clicked on",e.target);
      var oldValue = e.target.innerHTML;
      //$(e.target).append("<td><input type='text' autofocus=true placeholder='" + oldValue + "' ng-model='newData' ng-keyup='gotKey($event)'>");
      var el = $compile("<td><input id='editing' type='text' ng-model='editText' ng-keyup='$event.which === 13 && gotEnter()'>")($scope);
      $(e.target).replaceWith(el);
    }


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
                            "searchterm": "spore",
                            "hcreated": new Date(1459611762000),
                            "hlastsearch": new Date(1459611762000) };
      $scope.searches.newKey = newData;
    }

  }
]);
