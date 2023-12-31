import { Presupuestos } from "../controllers/presupuesto";

const express = require('express');

const router = express.Router();
// ========= Presupuestos =========

/**
 * Crear presupuestos
 */
router.post('/presupuesto', Presupuestos.create);

/**
 * Ver todos los presupuestos
 */
router.get('/presupuesto/', Presupuestos.index)

router.param('id', Presupuestos.presupuestosRequestHandler);


router.get('/presupuesto/Id', Presupuestos.show);

/**
 * Actualizar presupuesto
 */
router.put('/presupuesto/Id', Presupuestos.update);

/**
 * Eliminar presupuesto
 */
router.delete('/presupuesto/Id', Presupuestos.delete);

// ========= Fin Presupuestos  =========

module.exports = router;