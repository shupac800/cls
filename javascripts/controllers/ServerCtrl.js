app.controller("ServerCtrl", ["$scope","$http","$compile","dataService","$location","getLatestFSPosts",
  function($scope,$http,$compile,dataService,$location,getLatestFSPosts) {

    console.log("ServerCtrl is running");
    //$("body:not(td)").on("click",nonTDClick);

    fetchSearchData();
    //test();


    function test() {
    
    }


    $scope.jumpToShowResultsView = function() {
      $location.url("/main");
      $scope.$apply();
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
                             "<td>run</td>" +
                             "<td>next search</td>" +
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
      $(rowSelector).append("<td class='created'><p>" + obj[thisKey].created +"</p></td>");
      $(rowSelector).append("<td class='created_conv'><p>" + convertTimestamp(obj[thisKey].created) +"</p></td>");
      $(rowSelector).append("<td class='lastsearch'><p>" + obj[thisKey].lastsearch +"</p></td>");
      $(rowSelector).append("<td class='lastsearch_conv'><p>" + convertTimestamp(obj[thisKey].lastsearch) +"</p></td>");
      $(rowSelector).append("<td class='msgsSent'><p>" + obj[thisKey].msgsSent +"</p></td>");
      $(rowSelector).append("<td class='delete'><p></p></td>");
      $(rowSelector).append("<td class='searchnow'><p></p></td>");
      $(rowSelector).append("<td class='nextsearch'><p>N/S</p></td>");
      $(rowSelector).append("<td class='nextsearch_conv'><p>N/S</p></td>");
      $(rowSelector).append("</tr>")

      if (obj[thisKey].lastsearch === "never") {
        $(`tr#${thisKey} td.lastsearch_conv`).text("never");
      }

      // add listeners to fields that can be edited
      $(`tr#${thisKey} td.user`).on("click",tdClick);
      $(`tr#${thisKey} td.city`).on("click",tdClick);
      $(`tr#${thisKey} td.searchterm`).on("click",tdClick);
      $(`tr#${thisKey} td.filter`).on("click",tdClick);
      $(`tr#${thisKey} td.phone`).on("click",tdClick);
      $(`tr#${thisKey} td.interval`).on("click",tdClick);

      // add "delete" graphic to delete field
      $(`tr#${thisKey} td.delete`).html("<img src='redx.png'>");
      // add listener to "delete" field
      $(`tr#${thisKey} td.delete`).on("click",deleteRow);

      // add "search" graphic to search field
      $(`tr#${thisKey} td.searchnow`).html("<img src='Search.png'>");
      // add listener to "search" field
      $(`tr#${thisKey} td.searchnow`).on("click",function() {
        // store search parameters in dataService factory
        dataService.setSearchData( $(`tr#${thisKey} td.searchterm`).text(),
                                   $(`tr#${thisKey} td.city`).text(),
                                   $(`tr#${thisKey} td.filter`).text(),
                                   $(`tr#${thisKey} td.phone`).text(),
                                   $(`tr#${thisKey} td.interval`).text(),
                                   $(`tr#${thisKey} td.msgsSent`).text() );
        //console.log("retrieved from factory:",dataService.getScopeData());
        $scope.fetchResults(thisKey);  // gets results, sends text, schedules next search
      });

      // add listener to "nextsearch_conv" field
      $(`tr#${thisKey} td.nextsearch_conv`).on("click",function() {
        console.log("cleeeck");
        var ns = $(`tr#${thisKey} td.nextsearch_conv`);
        console.log("bg color is",$(ns).css("background-color"));
        if ($(ns).css("background-color") === "rgb(127, 255, 0)") {  //chartreuse
          console.log("green");
          postponeSearch(thisKey);
        } else if ($(ns).css("background-color") === "rgb(255, 255, 0)") {  // yellow
          console.log("yella");
          unPostponeSearch(thisKey);
        }
      });
    }


    function scheduleSearch(key) {
      var intervalInSeconds = $(`tr#${key} td.interval`).text() * 60;
      $scope.timeoutID = setTimeout(function() {
        $scope.fetchResults(key);
      }, intervalInSeconds * 1000);
      $(`tr#${key} td.nextsearch_conv`).css("background-color","chartreuse");
      return 
    }


    function postponeSearch(key) {
      console.log("clearing timeout with id",$scope.timeoutID);
      clearTimeout($scope.timeoutID);
      $(`tr#${key} td.nextsearch_conv`).css("background-color","yellow");
    }


    function unPostponeSearch(key) {
      var intervalInSeconds = parseInt($(`tr#${key} td.nextsearch`).text()) - Math.floor(Date.now() / 1000);
      // what if interval is < 0?
      if (intervalInSeconds > 0) {
        console.log("next search will be " + intervalInSeconds + " seconds from now");
        $scope.timeoutID = setTimeout(function() {
          $scope.fetchResults(key);
        }, intervalInSeconds * 1000);
        $(`tr#${key} td.nextsearch_conv`).css("background-color","chartreuse");
      } else {
        console.log("Error: can't reinstate search scheduled for the past. Do 'run' instead.");
        $(`tr#${key} td.nextsearch_conv`).css("background-color","red");
      }
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
            // update <p> contents of previousCellNode with contents of input box
            $(previousCellNode).find("p").text($scope.editText);
            // patch Firebase with changed cell contents
            patchField(previousCellNode);
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
      var field = cellNode.classList[0];
      var newObj = {};
      newObj[field] = $(cellNode).text();
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
                            "msgsSent": 0,
                            "phone": "",
                            "reported": [-1],  // contains one dummy value so it'll show up in FB
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

    // from https://gist.github.com/kmaida/6045266
    function convertTimestamp(timestamp) {
      var d = new Date(timestamp * 1000), // Convert the passed timestamp to milliseconds
        yyyy = d.getFullYear(),
        mm = ('0' + (d.getMonth() + 1)).slice(-2),  // Months are zero based. Add leading 0.
        dd = ('0' + d.getDate()).slice(-2),     // Add leading 0.
        hh = d.getHours(),
        h = hh,
        min = ('0' + d.getMinutes()).slice(-2),   // Add leading 0.
        ampm = 'AM',
        dayIndex = d.getDay(),
        time;
          
      if (hh > 12) {
        h = hh - 12;
        ampm = 'PM';
      } else if (hh === 12) {
        h = 12;
        ampm = 'PM';
      } else if (hh == 0) {
        h = 12;
      }
      
      // ie: 2013-02-18, 8:35 AM  
      var dayOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      var month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      time = dayOfWeek[dayIndex] + " " + dd + " " + month[mm - 1] + ", " + h + ":" + min + " " + ampm;
      //time = yyyy + '-' + mm + '-' + dd + ', ' + h + ':' + min + ' ' + ampm;
        
      return time;
    }


    $scope.fetchResults = function(key) {
      var searchterm = $(`tr#${key} td.searchterm`).text();
      var filter =     $(`tr#${key} td.filter`).text();
      var user =       $(`tr#${key} td.user`).text();
      var phone =      $(`tr#${key} td.phone`).text();
      var city =       $(`tr#${key} td.city`).text();

      getLatestFSPosts.load().then(
        function(cursor) {
          //console.log(cursor.length+" items in cursor");
          cursor = cursor.filter(function(cRow) {
            return ( cRow.title.toLowerCase().match( searchterm.toLowerCase() ) 
                   && !( cRow.title.toLowerCase().match( filter.toLowerCase() ) ) );
          });
          //console.log("after filter, "+cursor.length+" items in cursor");
          cursor.forEach(function(cRow) {
            console.log("calling Twilio REST API");
            console.log(`texting ${user} at ${phone} about "${cRow.title}"`);
            // if item ID isn't in the "reported" array,
            /////////////////////////////////////////
            ///////////////// DO REPORTED ARRAY CHECK
            /////////////////////////////////////////
            // do Twilio REST thing for each thing in the cursor
            var message = city + " CL alert: " + cRow.title;
            twilio(key,message);
          });
          //$scope.cursor = cursor;  // display results

          // update lastsearch
          // put new time in td node
          $(`tr#${key} td.lastsearch`).text(Math.floor(Date.now() / 1000));
          $(`tr#${key} td.lastsearch_conv`).text(convertTimestamp(Math.floor(Date.now() / 1000)))
            .addClass("flashgreen");
          setTimeout(function() {
            $(`tr#${key} td.lastsearch_conv`).removeClass("flashgreen");
          }, 2000);
          // then send updated node to patchField
          patchField( document.getElementById(`${key}`).querySelector("td.lastsearch") );
          // update nextsearch cell
          $(`tr#${key} td.nextsearch`).text(Math.floor((Date.now() / 1000) + ($(`tr#${key} td.interval`).text() * 60)));
          $(`tr#${key} td.nextsearch_conv`).text(convertTimestamp(Math.floor((Date.now() / 1000) + ($(`tr#${key} td.interval`).text() * 60))))
            .addClass("flashgreen");
          setTimeout(function() {
            $(`tr#${key} td.nextsearch_conv`).removeClass("flashgreen");
          }, 2000);
          // schedule nextsearch
          scheduleSearch(key);
          console.log("scheduled the next search for ",convertTimestamp(Math.floor((Date.now() / 1000) + ($(`tr#${key} td.interval`).text() * 60))));
        },
        function (error) {
          console.log("something went awry, couldn't load results from CL");
        }
      );
    }

    function twilio(key,message) {
      console.log("twilio-ing to phone: ","+1" + $(`tr#${key} td.phone`).text());
      console.log("message is ",message);
      $.ajax({
        type: "POST",
        headers: {"Authorization": "Basic " + btoa("ACda875cca4cfd121417e0d744cb52d000" + ":" + "3c6a196d2930ad0779cc7ec78ecee18b")},
        username: "ACda875cca4cfd121417e0d744cb52d000",
        password: "3c6a196d2930ad0779cc7ec78ecee18b",
        url: "https://api.twilio.com/2010-04-01/Accounts/ACda875cca4cfd121417e0d744cb52d000/Messages",
        data: {
          "To" : "+1" + $(`tr#${key} td.phone`).text(),
          "From" : "+12019032712",
          "Body" : message
        },
        success: function(data) {
          console.log("AJAX reports successful POST to Twilio");
          // Update msgsSent td
          msgs_sent_node = document.getElementById(`${key}`).querySelector("td.msgsSent");
          var msgs_sent = parseInt(msgs_sent_node.querySelector("p").innerHTML);
          msgs_sent++;
          msgs_sent_node.querySelector("p").innerHTML = msgs_sent;
          // update msgsSent record in Firebase
          patchField(msgs_sent_node);
          $(`tr#${key} td.msgsSent`).addClass("flashgreen");
          setTimeout(function() {
            $(`tr#${key} td.msgsSent`).removeClass("flashgreen");
          }, 2000);
        },
        error: function(data) {
          console.log("something went awry; post to Twilio unsuccessful");
        }
      });
    }

  }
]);


// if user adjusts "interval" and search is running,
// what should be done?

// think generally about whether we can edit fields while search is running, effects of that




