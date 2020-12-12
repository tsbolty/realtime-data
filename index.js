var GtfsRealtimeBindings = require('gtfs-realtime-bindings');
var request = require('request');
 
var requestSettings = {
  method: 'GET',
  url: 'https://www.rtd-denver.com/files/gtfs-rt/TripUpdate.pb',
  encoding: null
};
request(requestSettings, function (error, response, body) {
  if (!error && response.statusCode == 200) {
    var feed = GtfsRealtimeBindings.transit_realtime.FeedMessage.decode(body);
    console.log(feed.entity[0].tripUpdate)
    // feed.entity.forEach(function(entity) {
    //   if (entity.tripUpdate) {
    //     console.log(entity.tripUpdate);
    //   }
    // });
  } else {
    console.log("nope")
  }
});

