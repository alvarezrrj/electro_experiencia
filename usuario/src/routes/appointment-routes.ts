import { Appointment } from "../controllers/appointment";

const express = require('express');

const router = express.Router();

// ========= Recepciones =========
/**
 * Ver todos los turnos
 */
router.get('/turno', Appointment.index);

router.param('turnoId', Appointment.appointmentRequestHandler);
/**
 * Ver turno por ID
 */
router.get('/turno/:id', Appointment.show);

/**
 * Crear turno
 */
router.post('/turno', Appointment.create);

/**
 * Editar turno
 */
router.put('/turno/:id', Appointment.update);

/**
 * Eliminar turno
 */
router.delete('/turno/:id', Appointment.delete);

// ========= Fin Recepciones =========

module.exports = router;
