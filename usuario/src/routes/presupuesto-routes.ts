import { Presupuestos } from "../controllers/presupuesto";
import { AuthGuard } from "../middleware/auth-middleware";

const express = require('express');

const router = express.Router();

// ========= Presupuestos =========

/**
 * Solo usuarios logueados pueden acceder
 */
router.use(AuthGuard.authed);

/**
 * Crear presupuestos (solo tecnico tiene acceso)
 */
router.post('/presupuesto', AuthGuard.employee, Presupuestos.create);

/**
 * Ver todos los presupuestos (solo recepcionista tiene acceso)
 */
router.get('/presupuesto/', AuthGuard.employee, Presupuestos.index)

router.param('id', Presupuestos.presupuestosRequestHandler);

/**
 * Ver presupuesto individual (solo empleado y cliente tienen acceso)
 */
router.get('/presupuesto/Id', AuthGuard.presupuesto, Presupuestos.show);

/**
 * Actualizar presupuesto (solo tecnico tiene acceso)
 */
router.put('/presupuesto/Id', AuthGuard.employee, Presupuestos.update);

/**
 * Eliminar presupuesto (solo tecnico tiene acceso)
 */
router.delete('/presupuesto/Id', AuthGuard.employee, Presupuestos.delete);

// ========= Fin Presupuestos  =========

module.exports = router;