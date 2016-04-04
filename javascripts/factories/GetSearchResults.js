app.factory("getLatestFSPosts", function($q, $http,dataService) {

  var searchData = dataService.getSearchData();  // get parameters from dataService factory


  function loadCursor(rawHTML) {
    var cursor = [];
    // cursor is array that contains title, datetime, href, price, location
    // first three fields are guaranteed to be populated; last two are not
    var row = $(rawHTML).find(".row");
    console.log("got " + row.length + "rows from CL as raw HTML");

    for (i = 0; i < row.length; i++) {
      var title = row[i].querySelector("span #titletextonly").innerHTML;
      var href = `http://${searchData.city}.craigslist.org` + row[i].querySelector("a").getAttribute("href");
      var datetime = row[i].querySelector("time").getAttribute("title");
      var price = row[i].querySelector("span .price");
      if (!price) {
        price = "N/A";
      } else {
        price = price.innerHTML;
      }
      var loc = row[i].querySelector("small");
      if (!loc) {
        loc = "N/A";
      } else {
        loc = loc.innerHTML.replace(/[()]/g,"");
        loc = loc.slice(1,loc.length);
      }
      var data_pid = $(row[i]).attr("data-pid");
      var data_repost_of = $(row[i]).attr("data-repost-of");

      cursor.push( {title:       title,
                    href:        href,
                    datetime:    datetime,
                    price:       price,
                    loc:         loc,
                    id:          data_repost_of ? data_repost_of : data_pid       } );
    }
    return cursor;
  }


  return {
    load: function() {
      return $q(function(resolve, reject) {
        console.log("doing CORS request");
        $http.get(`https://cors-anywhere.herokuapp.com/http://${searchData.city}.craigslist.org/search/sss`)
        .then(
          function(response) {
            var rawHTML = response.data;
            cursor = loadCursor(rawHTML);
            console.log("I just put this data in the cursor:",cursor);
            resolve(cursor);
          },
          function(error) {
            console.log("uh-oh");
            reject(error);
          }
        );
      });
    }
  }

});