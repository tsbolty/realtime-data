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

connection.connect(err =>{
  if (err) throw err;
  getData()
  // renderSqlValues()
})

const requestSettings = {
  method: 'GET',
  url: 'https://www.rtd-denver.com/files/gtfs-rt/VehiclePosition.pb',
  encoding: null
};

function getData(){
return request(requestSettings, function (error, response, body) {
  if (!error && response.statusCode == 200) {
    var feed = GtfsRealtimeBindings.transit_realtime.FeedMessage.decode(body);
    // const questionMarks = feed.entity.length % 2 === 0 ? "(?, ?)".repeat(feed.entity.length / 2) : "(?, ?)".repeat(Math.ceil(feed.entity.length))
    const rowData = feed.entity.map(entity => {
      return `("${entity.id}", ${entity.vehicle.trip ? JSON.stringify(entity.vehicle.trip.tripId) : '"NA"'}), `
    });
    const queryValues = rowData.join("").slice(0, -1).replace(/.$/,";")

    console.log(`INSERT INTO historical_position (id, trip_id) VALUES ${queryValues}`)
    connection.query(`INSERT INTO historical_position (id, trip_id) VALUES ${queryValues}`)
    // console.log(questionMarks)
    // feed.entity.forEach(async function(entity) {
    //   console.log(entity)
    //   if (entity) {
    //   }
    // });
  } else {
    console.log("nope")
  }
});
}

function renderSqlValues(){
  return request(requestSettings, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var feed = GtfsRealtimeBindings.transit_realtime.FeedMessage.decode(body);
      // console.log(feed.entity[0].vehicle.trip.tripId)
      const rowData = feed.entity.map(entity => {
        return `('${entity.id}', ${entity.vehicle.trip ? JSON.stringify(entity.vehicle.trip.tripId) : "NA"}), `
      });
      console.log(rowData.join(""))
    } else {
      console.log("nope")
    }
  });
}

// setInterval(()=>{
//   getData()
// }, 30000)

