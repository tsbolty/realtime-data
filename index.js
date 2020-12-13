var GtfsRealtimeBindings = require('gtfs-realtime-bindings');
var request = require('request');
const mysql = require('mysql')

const connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'Gladiator5972!',
  database: 'vehicle_position_db'
})

connection.connect(err => {
  if (err) throw err;
  // getData()
  grabValues()
})

const requestSettings = {
  method: 'GET',
  url: 'https://www.rtd-denver.com/files/gtfs-rt/VehiclePosition.pb',
  encoding: null
};

function getData() {
  return request(requestSettings, async function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var feed = GtfsRealtimeBindings.transit_realtime.FeedMessage.decode(body);
      const rowData = feed.entity.map(entity => {
        if (entity) {
          return `("${entity.id}", ${entity.vehicle.trip ? JSON.stringify(entity.vehicle.trip.tripId) : '"NA"'}, ${entity.vehicle.trip ? `"${entity.vehicle.trip.routeId}"` : '"NA"'}, ${entity.vehicle.trip ? entity.vehicle.trip.directionId : 99}, ${entity.vehicle.position ? entity.vehicle.position.latitude : 99.999}, ${entity.vehicle.position ? entity.vehicle.position.longitude : 99.999}, ${entity.vehicle.position ? entity.vehicle.position.bearing : 99}, ${entity.vehicle.currentStatus ? entity.vehicle.currentStatus : 99}), `
        }
      });
      const queryValues = rowData.join("").slice(0, -1).replace(/.$/, ";")
      await connection.query(`INSERT INTO historical_position (id, trip_id, route_id, direction_id, latitude, longitude, bearing, current_status) VALUES ${queryValues}`)
      console.log("That shit's in the database baby!")
      process.exit()
    } else {
      console.log("nope")
    }
  });
}

function grabValues() {
  return request(requestSettings, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var feed = GtfsRealtimeBindings.transit_realtime.FeedMessage.decode(body);
      const result = feed.entity[0].vehicle
      // feed.entity.map(entity => {
      //   if (entity.vehicle.trip){
      //   return `('${entity.id}', ${entity.vehicle.trip ? JSON.stringify(entity.vehicle.trip.tripId) : "NA"}), `
      // }
      console.log(result)
      // });
    } else {
      console.log("nope")
    }
  });
}

// setInterval(()=>{
//   getData()
// }, 30000)

