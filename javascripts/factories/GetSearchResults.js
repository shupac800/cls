app.factory("getLatestFSPosts", function($q, $http,dataService) {


  function loadCursor(rawHTML) {
    var cursor = [];
    // cursor is array that contains title, datetime, href, price, location
    // first three fields are guaranteed to be populated; last two are not
    var row = $(rawHTML).find(".row");
    console.log("row length",row.length);

    for (i = 0; i < row.length; i++) {
      var title = row[i].querySelector("span #titletextonly").innerHTML;
      var href = `http://${searchData.city}.craigslist.com` + row[i].querySelector("a").getAttribute("href");
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

      cursor.push( {title:       title,
                    href:        href,
                    datetime:    datetime,
                    price:       price,
                    loc:         loc       } );
    }
    //console.log(cursor);
    return cursor;
  }

  var searchData = dataService.getSearchData();  // get parameters from dataService factory

  // factory must return something
  return {
    load: function() {
      return $q(function(resolve, reject) {
        $http.get(`https://cors-anywhere.herokuapp.com/http://${searchData.city}.craigslist.org/search/sss`)
        .then(
          function(response) {
            var rawHTML = response.data;
            console.log("read rawHTML from CL");
            //console.log(rawHTML);
            cursor = loadCursor(rawHTML);
            //console.log(cursor);
            resolve(cursor);
          },
          function(error) {
            console.log("fuck!!");
            reject(error);
          }
        );
      });
    }
  }

});