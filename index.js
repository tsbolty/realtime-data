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
  // vehiclePositionData()
  // tripUpdateData()
  grabValues()
})

const vehiclePosition = 'https://www.rtd-denver.com/files/gtfs-rt/VehiclePosition.pb';
const tripUpdate = 'https://www.rtd-denver.com/files/gtfs-rt/TripUpdate.pb';
const alerts = 'https://www.rtd-denver.com/files/gtfs-rt/Alerts.pb';

const requestSettings = {
  method: 'GET',
  url: tripUpdate,
  encoding: null
};
//DID NOT INCLUDE DIRECTION_ID OR TIMESTAMP. ALL OTHER INFO IS DONE.


function grabValues() {
  return request(requestSettings, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var feed = GtfsRealtimeBindings.transit_realtime.FeedMessage.decode(body);
      // const result = feed.entity[].tripUpdate

      // feed.entity.map(entity => {
      //   if (entity.tripUpdate){
      //     console.log(entity.tripUpdate.arrival)
      //   }
      //   });
        // console.log(result)
        process.exit()
      } else {
        console.log("Wrong path")
      }
    });
  }
  
  function tripUpdateData() {
    return request(requestSettings, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        var feed = GtfsRealtimeBindings.transit_realtime.FeedMessage.decode(body);
        const rowData = feed.entity.map(entity => {
          if (entity){
            return `(${entity.id} ${JSON.stringify(entity.tripUpdate)}), `
          }
        });
        const queryValues = rowData.join("").slice(0, -1).replace(/.$/, ";")
        // console.log(queryValues)
        connection.query(`INSERT INTO trip_update (id) VALUES ${queryValues}`)
        // .then(data =>console.log("That shit's in the database baby!"), process.exit())
        // .catch(err => {throw err})
      } else {
        console.log("nope")
      }
    });
  }
  
  function vehiclePositionData() {
    return request(requestSettings, async function (error, response, body) {
      if (!error && response.statusCode == 200) {
        var feed = GtfsRealtimeBindings.transit_realtime.FeedMessage.decode(body);
        const rowData = feed.entity.map(entity => {
          if (entity) {
            return `("${entity.id}", ${entity.vehicle.trip ? JSON.stringify(entity.vehicle.trip.tripId) : '"NA"'}, ${entity.vehicle.trip ? `"${entity.vehicle.trip.routeId}"` : '"NA"'}, ${entity.vehicle.trip ? entity.vehicle.trip.directionId : 99}, ${entity.vehicle.position ? entity.vehicle.position.latitude : 99.999}, ${entity.vehicle.position ? entity.vehicle.position.longitude : 99.999}, ${entity.vehicle.position ? entity.vehicle.position.bearing : 99}, ${entity.vehicle.currentStatus ? entity.vehicle.currentStatus : 99}, ${entity.vehicle.stopId ? `"${entity.vehicle.stopId}"` : '"NA"'}, ${entity.vehicle.vehicle && entity.vehicle.vehicle.id.length < 30 ? `"${entity.vehicle.vehicle.id}"` : '"NA"'}, ${entity.vehicle.vehicle ? `"${entity.vehicle.vehicle.label}"` : '"NA"'}), `
          }
        });
        const queryValues = rowData.join("").slice(0, -1).replace(/.$/, ";")
        await connection.query(`INSERT INTO historical_position (id, trip_id, route_id, direction_id, latitude, longitude, bearing, current_status, stop_id, vehicle_id, vehicle_label) VALUES ${queryValues}`)
        // .then(data =>console.log("That shit's in the database baby!"), process.exit())
        // .catch(err => throw err)
      } else {
        console.log("nope")
      }
    });
  }