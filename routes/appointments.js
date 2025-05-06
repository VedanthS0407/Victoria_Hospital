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
    res.status(400).send("Error booking appointment.");
  }
});

// cancel appointment
router.post('/cancel/:id', async (req, res) => {
  try {
    await Appointment.findByIdAndUpdate(req.params.id, { status: 'cancelled' });
    res.send('Appointment cancelled');
  } catch {
    res.status(500).send('Error cancelling appointment');
  }
});
// reschedule appointment
router.post('/reschedule/:id', async (req, res) => {
  const { newDate, newTime } = req.body;
  try {
    await Appointment.findByIdAndUpdate(req.params.id, {
      date: newDate,
      time: newTime,
      status: 'rescheduled'
    });
    res.send('Appointment rescheduled');
  } catch {
    res.status(500).send('Error rescheduling appointment');
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