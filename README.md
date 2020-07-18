# project1
The biggest gamble in promoting music is whether or not the band you book will sell enough tickets so you do not lose money.  Bands also do not want to play to an empty room either.
This site is a tool for music venues to use crowdsourcing to secure ticket sales before committing to 
booking the band. The focus would be on local and up-and-coming bands.  Prestige Worldwide is the name of our "venue".
When a fan comes to the venues page they can scroll through the bands and if they see a band in the list 
that they really want to see they can donate money to see that band. Their donation will then be translated into tickets. So if they donate $50 and tickets are going to be $10 each then they recieve 5 tickets. If a band does not meet their goal in the allotted time frame then the fan will not be charged.
On the website you can browse through the bands by clicking on the corresponding buttons. Each button will provide you with a picture and bio of each band.  The bandsintown api was used to grab the bands touring picture.  The bio was provided from wikipedia.  On the right hand side is a graph that shows each band and how much has been met of their goal.  
The ultimate goal of this site or concept is to be adapted into a site like bands in town or songkick. They would be able to provide this service as a tool for venues and booking agents for bands and could easliy adapt the code to search for openings within bands schedules so venues could see when they would most likely be able to book this band.  Its a great concept that benefits all parties including fans, bands, venues, and the host site.

Open AgorAPI - We used this API to run the donation tracking. It is a polling api that allows us to create a poll on the api servers and then send donations to the poll where it is tracked and the results are returned to us to be used in creating the chart showing the current donation progress. The api uses a credit system with each api call costing credits, so the poll information is saved to localStorage to allow the data to be displayed and worked with while minimizing the number of calls made.
Google Charts - When the poll data is updated, such as when a donation is made, the data returned from Open AgorAPI is given to Google Charts (a non-server side API) that creates the chart based on the current information.

https://github.com/jdlawton/prestige-worldwide - repo
https://jdlawton.github.io/prestige-worldwide/  - Live

![Project Screenshot1](/screenshot1.png?raw=true)
![Project Screenshot2](/screenshot2.png?raw=true)



