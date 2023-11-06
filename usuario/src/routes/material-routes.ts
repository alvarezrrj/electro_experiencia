import { Materiales } from "../controllers/material";

const express = require('express');

const router = express.Router();

// ========= Materiales =========

/**
 * Crear materiales 
 */
router.post('/material', Materiales.create);

/**
 * Ver todas los materiales 
 */
router.get('/material/', Materiales.index)

router.param('id', Materiales.MaterialsRequestHandler);


router.get('/material/Id', Materiales.show);

/**
 * Actualizar material 
 */
router.put('/material/Id', Materiales.update);

/**
 * Eliminar material 
 */
router.delete('/material/Id', Materiales.delete);

// ========= Fin materiales  =========

module.exports = router;