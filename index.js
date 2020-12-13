var GtfsRealtimeBindings = require('gtfs-realtime-bindings');
var request = require('request');
 
var requestSettings = {
  method: 'GET',
  url: 'https://www.rtd-denver.com/files/gtfs-rt/VehiclePosition.pb',
  encoding: null
};

function getData(){
return request(requestSettings, function (error, response, body) {
  if (!error && response.statusCode == 200) {
    var feed = GtfsRealtimeBindings.transit_realtime.FeedMessage.decode(body);
    console.log(feed.entity[0])
    feed.entity.forEach(function(entity) {
      // console.log(entity)
      if (entity) {
        console.log(entity);
      }
    });
  } else {
    console.log("nope")
  }
});
}

getData()

// setInterval(()=>{
//   getData()
// }, 30000)

