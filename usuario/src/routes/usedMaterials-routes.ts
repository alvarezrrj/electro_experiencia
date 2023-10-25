
import { usedMaterials } from "../controllers/usedMaterials";

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
router.get('/materialesUsados/reparacion/', usedMaterials.index)

//router.param('id', usedMaterials.receptionRequestHandler);

/**
 * Ver recepción por material usado id
 */
router.get('/materialesUsados/reparacion/Id', usedMaterials.show);

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