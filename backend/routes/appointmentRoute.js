const express = require('express');
const router = express.Router();
const AppointmentController = require('../controllers/AppointmentController');

router.post('/', AppointmentController.createAppointment);
router.get('/', AppointmentController.getAllAppointments);
router.delete('/:id', AppointmentController.deleteAppointment);

module.exports = router;
