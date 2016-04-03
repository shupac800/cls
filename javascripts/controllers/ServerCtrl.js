app.controller("ServerCtrl", ["$scope","$http","$compile",
  function($scope,$http,$compile) {

    console.log("ServerCtrl is running");
    //$("body:not(td)").on("click",nonTDClick);

    fetchSearchData();
    //test();


    function test() {
    
    }


    function fetchSearchData() {
      $http.get("http://cls.firebaseio.com/.json")
      .then(
        function(response) {
          console.log("read from Firebase:",response.data);
          $("tbody#searches").append("<tr id='headerRow'>" +
                             "<td>user</td>" +
                             "<td>city</td>" +
                             "<td>searchterm</td>"+
                             "<td>filter</td>" +
                             "<td>phone</td>" +
                             "<td>interval</td>" +
                             "<td>created</td>" +
                             "<td>lastsearch</td>" +
                             "<td>messages</td>" +
                             "<td>delete</td>" +
                             "</tr>" );
          Object.keys(response.data).forEach(function(thisKey) {
            response.data[thisKey].hcreated = response.data[thisKey].created;
            response.data[thisKey].hlastsearch = response.data[thisKey].lastsearch;
            // if (typeof response.data[thisKey].hlastsearch === typeof undefined) {
            //   response.data[thisKey].hlastsearch = "never";
            // }
            response.data[thisKey].key = thisKey;
            displayRow(response.data,thisKey);
          });
        },
        function(error) {
          console.log("something went awry; couldn't load search data from Firebase");
        }
      );
    }


    function displayRow(obj,thisKey) {
      $("tbody#searches").append(`<tr id='${thisKey}'>`);
      var rowSelector = "tr#" + thisKey;
      $(rowSelector).append("<td class='user'><p>" + obj[thisKey].user +"</p></td>");
      $(rowSelector).append("<td class='city'><p>" + obj[thisKey].city +"</p></td>");
      $(rowSelector).append("<td class='searchterm'><p>" + obj[thisKey].searchterm +"</p></td>");
      $(rowSelector).append("<td class='filter'><p>" + obj[thisKey].filter +"</p></td>");
      $(rowSelector).append("<td class='phone'><p>" + obj[thisKey].phone +"</p></td>");
      $(rowSelector).append("<td class='interval'><p>" + obj[thisKey].interval +"</p></td>");
      $(rowSelector).append("<td class='hcreated'><p>" + obj[thisKey].hcreated +"</p></td>");
      $(rowSelector).append("<td class='hlastsearch'><p>" + obj[thisKey].hlastsearch +"</p></td>");
      $(rowSelector).append("<td class='msgs_sent'><p>" + obj[thisKey].msgs_sent +"</p></td>");
      $(rowSelector).append("<td class='delete'><p>X</p></td>");
      $(rowSelector).append("</tr>")

      // add listeners to fields that can be edited
      $(`tr#${thisKey} td.user`).on("click",tdClick);
      $(`tr#${thisKey} td.city`).on("click",tdClick);
      $(`tr#${thisKey} td.searchterm`).on("click",tdClick);
      $(`tr#${thisKey} td.filter`).on("click",tdClick);
      $(`tr#${thisKey} td.phone`).on("click",tdClick);
      $(`tr#${thisKey} td.interval`).on("click",tdClick);

      // add "delete" graphic to delete field
      $(`tr#${thisKey} td.delete`).html(`<img src="redx.png">`);
      // add listener to "delete" field
      $(`tr#${thisKey} td.delete`).on("click",deleteRow);
    }


    function deleteRow(e) {
      var id = $(e.currentTarget).parent().attr("id");
      $http.delete(`https://cls.firebaseio.com/${id}.json`)
      .success(function(){
        console.log("delete successful");
        // remove deleted row from the DOM
        $(`tr#${id}`).remove();
      }).error(function() {
        console.log("something went awry; delete unsuccessful");
      });
    }


    function formatTime(time) {

    }


    function nonTDClick(e) {
      console.log("non td click");
      var previousCellNode = checkForOpenInput();
      if (previousCellNode) {
        closePreviousCellNode(previousCellNode);
      }
      return;
    }


    function tdClick(e) {
      console.log("td click");
      // are we clicking on a td that has an input in it?
      var tdInputNode = e.currentTarget.querySelector("input");
      console.log("tdInputNode",tdInputNode);
      if (tdInputNode) {  // if so
        console.log("tdInputNode is true");
        $(tdInputNode).focus();  // input box in this td gets focus
        return;  // do nothing else
      } else {  // we clicked on a td with no input box in it
        console.log("did not click on td with input in it");
        // are there any other open input boxes in the table?
        var previousCellNode = checkForOpenInput();
        //console.log("previousCellNode"),previousCellNode;
        if (previousCellNode) {  // found an open input box in the table
          console.log("detected previousCellNode truthy");
          // was any new text entered into that input box?
          if (($scope.editText === "") || ($scope.editText === previousCellNode.querySelector("p").innerHTML)) {  // no change?
            closePreviousCellNode(previousCellNode);
          } else {  // cell contents were changed
            // patch FB with changed cell contents
            //console.log("patching firebase with new text: ",$scope.editText);
            patchField(previousCellNode);
            // update <p> contents of previousCellNode with contents of input box
            $(previousCellNode).find("p").text($scope.editText);
            closePreviousCellNode(previousCellNode);
          }
        } else {
          console.log("detected previousCellNode falsy");
        }
      }
      // hide <p> node
      e.currentTarget.querySelector("p").setAttribute("style","display:none");
      // open a new input box
      console.log("new input");
      $(e.currentTarget).append($compile(`<input type='text' placeholder='${e.currentTarget.querySelector("p").innerHTML}' ng-model='editText'>`)($scope));
      $scope.editText = "";
      e.currentTarget.querySelector("input").focus();
    }


    function checkForOpenInput() {
      // is there an input box open somewhere in the table?
      var openInputNode = document.getElementsByTagName("tbody")[0].querySelectorAll("input")[0];
      if (openInputNode) {  // found one?
        console.log("found open input somewhwere in table");
        var previousCellNode = $(openInputNode).parent()[0];  // parent of input box becomes "previousCellNode"
        console.log("its parent is",previousCellNode);
        return previousCellNode;
      } else {  // there was no open input box in the table?
        console.log("found no open input box anywhere in table");
        return "";
      }
    }


    function closePreviousCellNode(previousCellNode) {
      console.log("running closePreviousCellNode");
      // remove input box from previousCellNode
      previousCellNode.querySelector("input").remove();
      // unhide <p> in previousCellNode
      previousCellNode.querySelector("p").setAttribute("style","display:inline");
    }


    function patchField(cellNode) {
      var id = $(cellNode).parent().attr("id");
      //console.log(cellNode.classList);
      var field = cellNode.classList[0];
      console.log("patching field " + field + " of",`http://cls.firebaseio.com/${id}.json`);
      var newObj = {};
      newObj[field] = $scope.editText;
      $http.patch(`https://cls.firebaseio.com/${id}.json`,JSON.stringify(newObj))
      .success(function() {
        console.log("patch successful");
      }).error(function() {
        console.log("something went awry; patch unsuccessful");
      });
    }


    $scope.addSearch = function() {
      var newObj = {        "user": "",
                            "city": "",
                            "created": Math.floor(Date.now() / 1000),  // divide JS time by 1000 to get UNIX time
                            "filter": "",
                            "interval": "",
                            "lastsearch": "never",
                            "msgs_sent": 0,
                            "phone": "",
                            "reported": [],
                            "searchterm": "" };
      $http.post("https://cls.firebaseio.com/.json",JSON.stringify(newObj))
        .success(function(response) {
          console.log("post successful");
          console.log("new key is ",response.name);
          var objForDisplay = {};
          objForDisplay[response.name] = newObj;
          objForDisplay[response.name].hcreated = objForDisplay[response.name].created;
          objForDisplay[response.name].hlastsearch = objForDisplay[response.name].lastsearch;
          console.log("objForDisplay",objForDisplay);
          displayRow(objForDisplay,response.name);
        }).error(function(error) {
          console.log("something went awry; post unsuccessful");
        });
    }  // end addSearch


  }
]);
