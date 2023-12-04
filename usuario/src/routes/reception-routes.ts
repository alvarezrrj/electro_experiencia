import { Reception } from "../controllers/reception";
import { AuthGuard } from "../middleware/auth-middleware";

const express = require('express');

const router = express.Router();

// ========= Recepciones =========

/**
 * Solo empleados (recepcionista y tecnico) pueden acceder
 */
router.use(AuthGuard.authed, AuthGuard.employee);

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