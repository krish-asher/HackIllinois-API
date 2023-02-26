const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();

const getRooms = async (req, res, next) => {
  try {
    const data = fs.readFileSync(path.join(__dirname, './Room.json'));
    const stats = JSON.parse(data);
    const roomStats = stats.filter(room => room.UserBooked === null);
    if (!roomStats) {
      const err = new Error('Player stats not found');
      err.status = 404;
      throw err;
    }
    res.json(roomStats);
  } catch (e) {
    next(e);
  }
};

const ReserveRoom = async (req, res, next) => {
  try {
    const data = fs.readFileSync(path.join(__dirname, './Room.json'));
    const stats = JSON.parse(data);
    const roomStats1 = stats.find(allRoom => allRoom.Room === Number(req.params.Room) && allRoom.Time === Number(req.params.Time));
    console.log(Number(req.params.Room), Number(req.params.Time)); 
    if (roomStats1 != undefined) {
      const err = new Error('Kush is my Ginder');
      err.status = 404;
      throw err;
    }

    const newStatsData = {
      Room: req.params.Room,
      UserBooked: req.params.UserBooked,
      Time: req.params.Time
    };

    stats.push(newStatsData);
    fs.writeFileSync(path.join(__dirname, './Room.json'), JSON.stringify(stats, null, "\t"));
    res.status(200).json(newStatsData);
  } catch (e) {
    next(e);
  }
};

const DeleteRoom = async (req, res, next) => {
  try {
    const data = fs.readFileSync(path.join(__dirname, './Room.json'));
    const stats = JSON.parse(data);
    const roomStats1 = stats.find(allRoom => allRoom.UserBooked === Number(req.params.UserBooked));
    console.log(roomStats1);
    if (roomStats1 == undefined) {
      const err = new Error('Reservation Not Found');
      err.status = 404;
      throw err;
    }

    const newStatsData = {
      Room: roomStats1.Room,
		  UserBooked: null,
		  Time: null
    };

    const newStats = stats.map(allRoom => {
      if (allRoom.UserBooked === Number(req.params.UserBooked)) {
        console.log("Done")
        return newStatsData;
      } else {
        return allRoom;
      }
    });

    fs.writeFileSync(path.join(__dirname, './Room.json'), JSON.stringify(newStats, null, "\t"));
    res.status(200).json(newStatsData);
  } catch (e) {
    next(e);
  }
};

const GetReservation = async (req, res, next) => {
  try {
    const data = fs.readFileSync(path.join(__dirname, './Room.json'));
    const stats = JSON.parse(data);
    const roomStats = stats.find(room => room.UserBooked === Number(req.params.UserBooked));
    if (!roomStats) {
      const err = new Error('No Reservations by user');
      err.status = 404;
      throw err;
    }
    res.json(roomStats);
  } catch (e) {
    next(e);
  }
};

router
  .route('/api/v1/Rooms/')
  .get(getRooms)

router 
  .route('/api/v1/Rooms/:Room/:Time/:UserBooked')
  .put(ReserveRoom)

router
  .route('/api/v1/Rooms/:UserBooked')
  .get(GetReservation)
  .put(DeleteRoom)

module.exports = router;