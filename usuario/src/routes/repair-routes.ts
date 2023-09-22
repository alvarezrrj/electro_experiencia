import { Repair } from "../controllers/repair";

const express = require('express');

const router = express.Router();


// ========= ReparacionNomencladaes =========

/**
 * Crear reparacion
 */
router.post('/reparacion', Repair.create);

/**
 * Ver todas las reparaciones  
 */
router.get("/reparacion", Repair.index);

/**
 * Buscar reparacion por palabra clave
 */
router.get('/reparacion/search', Repair.search);

router.param('repairId', Repair.repairRequestHandler);

/**
 * Ver reparacion por reparacionId
 */
router.get('/reparacion/:repairId', Repair.show);

/**
 * Actualizar reparación
 */
router.put('/reparacion', Repair.update);

/**
 * Eliminar reparacion
 */
router.delete('/reparacion/:repairId', Repair.delete);

// ========= Fin ReparacionNomencladaes =========

module.exports = router;