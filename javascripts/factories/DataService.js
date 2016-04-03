app.factory("dataService", function() {

  var searchData = {};

  return {
    setSearchData:  function(searchterm,city,filter,phone,interval,msgs_sent) {
      searchData.searchterm = searchterm;
      searchData.city = city;
      searchData.filter = filter;
      searchData.phone = phone;
      searchData.interval = interval;
      searchData.msgs_sent = msgs_sent;
    },
    getSearchData:  function() {
      return searchData;
    }
  };

});