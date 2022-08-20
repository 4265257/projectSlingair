const { MongoClient } = require("mongodb");
require("dotenv").config();
const { MONGO_URI } = process.env;
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};
const { flights, reservations } = require("./backend/data");

const batchImportRes = async () => {
  const client = new MongoClient(MONGO_URI, options);
  try {
    await client.connect();
    const db = client.db("SlingAirProject");
    const result = await db.collection("reservations").insertMany(
      reservations
      );
    console.log("result",result)
  } catch (err) {
    console.log(err.stack);
  }
  client.close();
};

const batchImportFlights = async () => {
  const client = new MongoClient(MONGO_URI, options);
  try {
    await client.connect();
    const db = client.db("SlingAirProject");
    const result = await db.collection("flights").insertMany(flights);
    console.log("result",result)
  } catch (err) {
    console.log(err.stack);
  }
  client.close();
};


batchImportFlights()
batchImportRes();


//  const flightNum = Object.keys(flights)[0]
//   for (const key in flights) {
//     console.log(`${key}: ${Object.keys(flights)[key]}`);
// }
  //  const flight = { 
  //   flight: flightNum,
  //   seats: flights[flightNum]
  // }