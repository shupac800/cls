app.controller("ServerCtrl", ["$scope","$http","$compile",
  function($scope,$http,$compile) {

    //global to this controller
    var editing = false;
    var previousRow = "";
    var previousCellNode = "";
    var previousEvent = "";
    var previousCellHTML = "";

    console.log("ServerCtrl is running");
    //$("body:not(td)").on("click",nonTDClick);

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

    test();

    function test() {
    
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
      $(rowSelector).append("<td class='delete'><p></p></td>");

      $(rowSelector).append("</tr>")
      $(`tr#${thisKey} td`).on("click",tdClick);
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
      console.log("currentTarget",e.currentTarget);
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
        console.log("cfoi returns",checkForOpenInput());
//weird flow here...
        var previousCellNode = checkForOpenInput();  // PROBLEM IS RIGHT HERE.... WHAT'S GOING ON
        //console.log("previousCellNode"),previousCellNode;
        if (previousCellNode) {  // found an open input box in the table
          console.log("detected previousCellNode truthy");
          // was any new text entered into that input box?
          console.log("scope.editText",$scope.editText);
          console.log("previous cell text",previousCellNode.querySelector("p").innerHTML);
          if ($scope.editText === previousCellNode.querySelector("p").innerHTML) {  // no change?
            console.log("closing");
            closePreviousCellNode(previousCellNode);
          } else {  // cell contents were changed
            // patch FB with changed cell contents
            console.log("patching firebase with new text: ",$scope.editText);
            // update <p> contents of previousCellNode with contents of input box
            $(previousCellNode).find("p").text($scope.editText);
            console.log("closing");
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
      $(e.currentTarget).append(`<input type='text' ng-model='editText' placeholder='${e.currentTarget.querySelector("p").innerHTML}'>`);
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
      //$(previousCellNode).find("input").remove();
      // unhide <p> in previousCellNode
      previousCellNode.querySelector("p").setAttribute("style","display:inline");
      //$(previousCellNode).find("p").show();
      return;
    }


    $scope.OLDpatchField = function(e) {
      console.log(e.keyCode);
      if (e.keyCode !== 13 &&     // enter key
          e.keyCode !== 9 ) {     // tab key
        return;
      }

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
        (response) => console.log(response)        // Handle reject
      );
      editing = false;  // reset global flag
    }

/*    function OLDeditCell(e) {
      if (editing) {  // if we were already editing a cell
        // was it this cell?  ( click on input field)
        if (!$scope.editText) {  // were the cell contents unchanged?
          // restore original cell contents
          $(`tr#${previousRow} td p`).show();
          $(`tr#${previousRow} td input`).remove();
          previousCellHTML = "";
          $scope.editText = "";
        } else {  // cell contents were changed, so write the patch
          previousEvent.keyCode = 13;  // fake a press on the "enter" key
          $scope.patchField(previousEvent);  // treat click on new cell as "enter" on previous cell
          $(previousCellNode).html($scope.editText);  // replace old <p> text with new
          $(`tr#${previousRow} td input`).remove();  // remove the input box
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
      var el = $compile(`<input type='text' field='${field}' placeholder='${previousCellHTML}' ng-model='editText' ng-keyup='patchField($event)'>`)($scope);
      $(e.currentTarget).children("p")[0].setAttribute("style","display:none");
      $(e.currentTarget).append(el);
      e.currentTarget.querySelector("input").focus();
    }*/


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
