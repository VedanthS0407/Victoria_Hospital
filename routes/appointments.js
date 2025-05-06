const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');

// Book new appointment
router.post('/book', async (req, res) => {
  const { userId, service, date, time } = req.body;
  try {
    await Appointment.create({ userId, service, date, time });
    res.status(201).send("Appointment booked successfully.");
  } catch (e) {
    console.error(e);
    res.status(400).send("Error booking appointment.");
  }
});

// Get appointments for user
router.get('/user/:userId', async (req, res) => {
  try {
    const appts = await Appointment.find({ userId: req.params.userId });
    res.json(appts);
  } catch (e) {
    res.status(500).send("Could not fetch appointments");
  }
});

module.exports = router;