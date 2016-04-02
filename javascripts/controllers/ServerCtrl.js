app.controller("ServerCtrl", ["$scope","$http","$compile",
  function($scope,$http,$compile) {

    console.log("ServerCtrl is running");

    $http.get("http://cls.firebaseio.com/.json")
    .then(
      function(response) {
        console.log("read from Firebase:",response.data);
        $("tbody#searches").append("<tr>" +
                           "<td>user</td>" +
                           "<td>city</td>" +
                           "<td>searchterm</td>"+
                           "<td>filter</td>" +
                           "<td>phone</td>" +
                           "<td>interval</td>" +
                           "<td>created</td>" +
                           "<td>lastsearch</td>" +
                           "<td>messages</td>" +
                           "</tr>" );
        Object.keys(response.data).forEach(function(thisKey) {
          response.data[thisKey].hcreated = new Date(response.data[thisKey].created * 1000);
          response.data[thisKey].hlastsearch = new Date(response.data[thisKey].lastsearch * 1000);
          response.data[thisKey].key = thisKey;
          displayRow(response.data,thisKey);
        });
      },
      function(error) {
        console.log("something went awry");
      }
    );

    function displayRow(obj,thisKey) {
      $("tbody#searches").append(`<tr id='${thisKey}'>`);
      var rowSelector = "tr#" + thisKey;
      $(rowSelector).append("<td class='user'>" + obj[thisKey].user +"</td>");
      $(rowSelector).append("<td class='city'>" + obj[thisKey].city +"</td>");
      $(rowSelector).append("<td class='searchterm'>" + obj[thisKey].searchterm +"</td>");
      $(rowSelector).append("<td class='filter'>" + obj[thisKey].filter +"</td>");
      $(rowSelector).append("<td class='phone'>" + obj[thisKey].phone +"</td>");
      $(rowSelector).append("<td class='interval'>" + obj[thisKey].interval +"</td>");
      $(rowSelector).append("<td class='hcreated'>" + obj[thisKey].hcreated +"</td>");
      $(rowSelector).append("<td class='hlastsearch'>" + obj[thisKey].hlastsearch +"</td>");
      $(rowSelector).append("<td class='msgs_sent'>" + obj[thisKey].msgs_sent +"</td>");
      $(rowSelector).append("</tr>")
      $(`tr#${thisKey} td`).on("click",editCell);
    }


    $scope.gotEnter = function(e) {
      var id = $(e.target).parent().parent().attr("id");
      var field = $(e.target).attr("field");
      console.log("patching field " + field + " of",`http://cls.firebaseio.com/${id}.json`);
      var newObj = {};
      newObj[field] = $scope.editText;
      $http.patch(
        `https://cls.firebaseio.com/${id}.json`,
        JSON.stringify(newObj)
      )
      .then(
        () => console.log("patch successful"),      // Handle resolve
        (response) => console.log(response)  // Handle reject
      );
      $(e.target).replaceWith($scope.editText);
    }

    function editCell(e) {
      editing = e;
      console.log("bawwk");
      console.log("clicked on",e.target.classList[0]);
      var oldValue = e.target.innerHTML;
      var field = e.target.classList[0];
      var el = $compile(`<td><input type='text' field='${field}' autofocus=true placeholder='${oldValue}' ng-model='editText' ng-keyup='$event.which === 13 && gotEnter($event)'>`)($scope);
      $(e.target).replaceWith(el);
    }


    $scope.addSearch = function() {
      var newObj = {        "user": "",
                            "city": "",
                            "created": "",
                            "filter": "",
                            "interval": "",
                            "lastsearch": "never",
                            "msgs_sent": 0,
                            "phone": "",
                            "reported": [],
                            "searchterm": "" };
      $http.post("https://cls.firebaseio.com/.json", JSON.stringify(newObj))
        .success(function(response) {
            console.log("post successful");
            console.log("new key is ",response.name);
            var objForDisplay = {};
            objForDisplay[response.name] = newObj;
            console.log(objForDisplay[response.name].msgs_sent);
            displayRow(objForDisplay,response.name);
        }).error(function(error) {});
    }  // end addSearch
  }
]);
