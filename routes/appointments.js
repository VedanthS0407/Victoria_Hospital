const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');
const sendEmail = require('../utils/mailer');
const User = require('../models/user');
// Book new appointment
router.post('/book', async (req, res) => {
  const { userId, service, date, time } = req.body;
  try {
    const appointment = await Appointment.create({ userId, service, date, time });
    const user = await User.findById(userId);

    await sendEmail(user.email, "Appointment Confirmation", `
      <h3>Your appointment is booked!</h3>
      <p><strong>Service:</strong> ${service}</p>
      <p><strong>Date:</strong> ${new Date(date).toDateString()}</p>
      <p><strong>Time:</strong> ${time}</p>
    `);

    res.status(201).send("Appointment booked and email sent.");
  } catch (e) {
    res.status(400).send("Error booking appointment.");
  }
});
router.post('/cancel/:id', async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(req.params.id, { status: 'cancelled' });
    const user = await User.findById(appointment.userId);

    await sendEmail(user.email, "Appointment Cancelled", `
      <h3>Your appointment has been cancelled.</h3>
      <p><strong>Service:</strong> ${appointment.service}</p>
    `);

    res.send('Appointment cancelled and email sent.');
  } catch {
    res.status(500).send('Error cancelling appointment');
  }
});

router.post('/reschedule/:id', async (req, res) => {
  const { newDate, newTime } = req.body;
  try {
    const appointment = await Appointment.findByIdAndUpdate(req.params.id, {
      date: newDate,
      time: newTime,
      status: 'rescheduled'
    });

    const user = await User.findById(appointment.userId);

    await sendEmail(user.email, "Appointment Rescheduled", `
      <h3>Your appointment has been rescheduled.</h3>
      <p><strong>New Date:</strong> ${new Date(newDate).toDateString()}</p>
      <p><strong>New Time:</strong> ${newTime}</p>
    `);

    res.send('Appointment rescheduled and email sent.');
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