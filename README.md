** Installing and Running CLackey **

1.  in your working directory, do "git clone https://github.com/shupac800/cls.git"

2.  in that same directory, do "bower install" (you need to have bower installed)

3.  launch http-server from "cls" directory (you need to have npm http-server installed)

4.  navigate to localhost:8080; you'll be presented with the login page

5.  log in as "a@a.com," password "a"

6.  Add a new search and click the magnifying glass to run it.  The search will then run automatically every [interval] minutes until you either click on "next search" (the box will turn yellow, meaning, auto-search postponed) or close the browser window (which will terminate all searches).  Whenever CLackey finds a matching item among the last 100 things posted on the city's general "forsale" page, it'll send a text the number associated with that search.

Note: the "view unfiltered results" button only works after you have defined a city by running one of your searches.

Note: I never got around to implementing the (rather important) functionality that would keep track of which listing ID's it has already texted you about, and ignore those ID's if it encounters them again.  Meaning, if you're doing a search every 1 minute, and in that 1 minute the item it's watching for hasn't been bumped off the top-100 list by new postings, the program will send you a duplicate text about the same item. 

Also, I suggest leaving the console window open; lots of fun stuff gets logged there.

Please be sure to "star" my Github repo if you deem it worthy.