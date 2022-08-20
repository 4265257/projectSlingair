const { MongoClient } = require("mongodb");
require("dotenv").config();
const { MONGO_URI } = process.env;
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

("use strict");

const { query } = require("express");

// use this package to generate unique ids: https://www.npmjs.com/package/uuid
const { v4: uuidv4 } = require("uuid");

// use this data. Changes will persist until the server (backend) restarts.
const { flights, reservations } = require("./data");
const { connect } = require("http2");

// returns a list of all flights
const getFlights = async (req, res) => {
  console.log("MONGO_URI", MONGO_URI);
  const client = new MongoClient(MONGO_URI, options);

  await client.connect();
  console.log("connect");
  const db = client.db("SlingAirProject");
  const flights = await db
    .collection("flights")
    .find().project({ flightNum: 1 })
    .toArray();
 // console.log("flights", flights);
  if (flights.length) {
    res.status(200).json({ status: 200, data: flights });
  } else if (flights.length === 0) {
    res.status(404).json({ status: 404, data: flights, message: "Not found" });
  }
  client.close();
};
// returns all the seats on a specified flight
const getFlight = async (req, res) => {
  const client = new MongoClient(MONGO_URI, options);
  await client.connect();
  const db = client.db("SlingAirProject");
  const flight = req.params.flight;
  const result = await db.collection("flights").findOne({ flightNum: flight });
  result
    ? res.status(200).json({ status: 200, flight, data: result })
    : res.status(404).json({ status: 404, flight, data: "Not Found" });
  client.close();
};

// returns all reservations
const getReservations = async (req, res) => {
  const client = new MongoClient(MONGO_URI, options);
  await client.connect();
  const db = client.db("SlingAirProject");
  const reservations = await db.collection("reservations").find().toArray();
//  console.log("reservations", reservations);
  if (reservations.length) {
    res.status(200).json({ status: 200, data: reservations });
  } else if (reservations.length === 0) {
    res
      .status(404)
      .json({ status: 404, data: reservations, message: "Not found" });
  }
  client.close();
};

// returns a single reservation
const getSingleReservation = async (req, res) => {
  const client = new MongoClient(MONGO_URI, options);
  await client.connect();
  const db = client.db("SlingAirProject");
  const reservationId = req.params.reservationId;
  const result = await db
    .collection("reservations")
    .findOne({ id: reservationId });
  result
    ? res.status(200).json({ status: 200, reservationId, data: result })
    : res.status(404).json({ status: 404, reservationId, data: "Not Found" });
  client.close();
};

// creates a new reservation
const addReservation = async (req, res) => {
  const client = new MongoClient(MONGO_URI, options);
  await client.connect();
  try {
    const db = client.db("SlingAirProject");
    const resultRes = await db.collection("reservations").insertOne({
      id: uuidv4(),
      flight: req.body.flight,
      seat: req.body.seat,
      givenName: req.body.givenName,
      surname: req.body.surname,
      email: req.body.email,
    });
    const resultFlight = await db.collection("flights").updateMany(
      { flightNum: req.body.flight },
      {
        $set: {
          "seats.$[element].isAvailable": false,
        },
      },
      { arrayFilters: [{ "element.id": req.body.seat }] }
    );
    res
      .status(201)
      .json({ status: 201, data: resultRes, message: "reservation added." });
  } catch (err) {
    res.status(500).json({ status: 500, data: req.body, message: err.message });
    console.log(err.stack);
  }
  client.close();
};

// updates an existing reservation
const updateReservation = async (req, res) => {
  try {
    const client = new MongoClient(MONGO_URI, options);
    await client.connect();
    const db = client.db("SlingAirProject");
    if (req.body) {
      const { reservationId } = req.params;
      const query = { id: reservationId };
      const newValues = { $set: { ...req.body } };
      const findRes = await db.collection("reservations").findOne(query);
      if (findRes?.seat !== req.body.seat) {
        const resultOldSeat = await db.collection("flights").updateMany(
          { flightNum: req.body.flight },
          {
            $set: {
              "seats.$[element].isAvailable": true,
            },
          },
          { arrayFilters: [{ "element.id": findRes.seat }] }
        );
        console.log("resultOldSeat", resultOldSeat);
        const resultNewSeat = await db.collection("flights").updateMany(
          { flightNum: req.body.flight },
          {
            $set: {
              "seats.$[element].isAvailable": false,
            },
          },
          { arrayFilters: [{ "element.id": req.body.seat }] }
        );
        console.log("resultNewSeat", resultNewSeat);
      }
      const resultRes = await db
        .collection("reservations")
        .updateOne(query, newValues);
      client.close();
      res
        .status(201)
        .json({ status: 201, resultRes, message: "reservation updated." });
      console.log("success");
    } else if (req.body === undefined) {
      res.status(400).json({ status: 400, message: "Not Found" });
      console.log("fail");
    }
  } catch (err) {
    res.status(500).json({ status: 500, message: err.message });
    console.log(err.stack);
  }
};

// deletes a specified reservation
const deleteReservation = async (req, res) => {
  try {
    const client = new MongoClient(MONGO_URI, options);
    await client.connect();
    const db = client.db("SlingAirProject");
    const { reservationId } = req.params;
    const query = { id: reservationId };
    const findRes = await db.collection("reservations").findOne(query);
    console.log("findRes", findRes);
    if (findRes?.seat && findRes?.flight) {
      const resultFlight = await db.collection("flights").updateMany(
        { flightNum: findRes.flight },
        {
          $set: {
            "seats.$[element].isAvailable": true,
          },
        },
        { arrayFilters: [{ "element.id": findRes.seat }] }
      );
      console.log("resultFlight", resultFlight);
      const resultRes = await db
        .collection("reservations")
        .deleteOne({ id: reservationId });
      client.close();
      res
        .status(200)
        .json({ status: 200, resultRes, message: "reservation deleted." });
    } else {
      res.status(404).json({ status: 404, message: "Not Found" });
      console.log("fail");
    }
  } catch (err) {
    res.status(500).json({ status: 500, message: err.message });
    console.log(err.stack);
  }
};

module.exports = {
  getFlights,
  getFlight,
  getReservations,
  addReservation,
  getSingleReservation,
  updateReservation,
  deleteReservation,
};
