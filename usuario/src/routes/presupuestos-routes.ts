import { Presupuestos } from "../controllers/presupuestos";

const express = require('express');

const router = express.Router();

// ========= Materiales usados =========

/**
 * Crear materiales usados
 */
//router.post('/materialesUsados', usedMaterials.create);

/**
 * Ver todas los materiales usados
 */
router.get('/presupuestos/', Presupuestos.index)

//router.param('id', usedMaterials.receptionRequestHandler);

/**
 * Ver recepción por material usado id
 */
router.get('/presupuestos/Id', Presupuestos.show);

/**
 * Actualizar material usado
 */
//router.put('/materialesUsados/Id', usedMaterials.update);

/**
 * Eliminar material usado
 */
//router.delete('/recepcion/receptionId', usedMaterials.delete);

// ========= Fin materiales usados =========

module.exports = router;