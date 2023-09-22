import { Reception } from "../controllers/reception";

const express = require('express');

const router = express.Router();

// ========= Recepciones =========

/**
 * Crear recepción
 */
router.post('/recepcion', Reception.create);

/**
 * Ver todas las recepciones
 */
router.get('/recepcion', Reception.index)

router.param('receptionId', Reception.receptionRequestHandler);

/**
 * Ver recepción por recepcionId
 */
router.get('/recepcion/:receptionId', Reception.show);

/**
 * Actualizar recepción
 */
router.put('/recepcion/:receptionId', Reception.update);

/**
 * Eliminar recepción
 */
router.delete('/recepcion/:receptionId', Reception.delete);

// ========= Fin Recepciones =========

module.exports = router;