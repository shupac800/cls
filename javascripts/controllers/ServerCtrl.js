app.controller("ServerCtrl", ["$scope","$http","$compile",
  function($scope,$http,$compile) {

    //global to this controller
    var editing = false;
    var previousRow = "";
    var previousCellNode = "";
    var previousEvent = "";
    var previousCellHTML = "";

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
          if (typeof response.data[thisKey] === typeof undefined) {
            response.data[thisKey].hlastsearch = "never";
          }
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
      $(rowSelector).append("<td class='user'><p>" + obj[thisKey].user +"</td></p>");
      $(rowSelector).append("<td class='city'><p>" + obj[thisKey].city +"</td></p>");
      $(rowSelector).append("<td class='searchterm'><p>" + obj[thisKey].searchterm +"</td></p>");
      $(rowSelector).append("<td class='filter'><p>" + obj[thisKey].filter +"</td></p>");
      $(rowSelector).append("<td class='phone'><p>" + obj[thisKey].phone +"</td></p>");
      $(rowSelector).append("<td class='interval'><p>" + obj[thisKey].interval +"</td></p>");
      $(rowSelector).append("<td class='hcreated'><p>" + obj[thisKey].hcreated +"</td></p>");
      $(rowSelector).append("<td class='hlastsearch'><p>" + obj[thisKey].hlastsearch +"</td></p>");
      $(rowSelector).append("<td class='msgs_sent'><p>" + obj[thisKey].msgs_sent +"</td></p>");
      $(rowSelector).append("</tr>")
      $(`tr#${thisKey} td`).on("click",editCell);
    }

    function formatTime(time) {

    }


    $scope.patchField = function(e) {
      var id = $(e.currentTarget).parent().attr("id");
      console.log(e.currentTarget.classList);
      var field = e.currentTarget.classList[0];
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
      editing = false;  // reset global flag
    }

    function editCell(e) {
      if (editing) {  // if we were already editing a cell
        if (!$scope.editText) {  // were the cell contents unchanged?
          // restore original cell contents
          $(`tr#${previousRow} td p`).show();
          $(`tr#${previousRow} td input`).remove();
          previousCellHTML = "";
          $scope.editText = "";
        } else {
          $scope.patchField(previousEvent);  // treat click on new cell as "enter" on previous cell
          $(previousCellNode).html($scope.editText);  // replace old <p> text with new
          $(`tr#${previousRow} td input`).remove();
          $(previousCellNode).show();
          $scope.editText = "";
        }
      }
      editing = true;
      console.log("clicked on",e.currentTarget.classList[0]);
      console.log("e.currentTarget is ",e.currentTarget);
      var field = e.currentTarget.classList[0];
      previousRow = $(e.currentTarget).parent().attr("id");
      previousEvent = e;
      previousCellNode = $(e.currentTarget).children("p")[0];
      previousCellHTML = previousCellNode.innerHTML;
      var el = $compile(`<input type='text' field='${field}' placeholder='${previousCellHTML}' ng-model='editText' ng-keyup='$event.which === 13 && patchField($event)'>`)($scope);
      $(e.currentTarget).children("p")[0].setAttribute("style","display:none");
      $(e.currentTarget).append(el);
      e.currentTarget.querySelector("input").focus();
      // hide old text, show input box!
    }


    $scope.addSearch = function() {
      var newObj = {        "user": "",
                            "city": "",
                            "created": Math.floor(Date.now() / 1000),
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
            displayRow(objForDisplay,response.name);
        }).error(function(error) {});
    }  // end addSearch
  }
]);
