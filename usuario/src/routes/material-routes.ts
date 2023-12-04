import { Router } from "express";
import { Materiales } from "../controllers/material";
import { AuthGuard } from "../middleware/auth-middleware";

const express = require('express');

const router: Router = express.Router();

// ========= Materiales =========

/**
 * Solo empleados (recepcionista) pueden acceder estas rutas
 */
router.use(AuthGuard.authed, AuthGuard.employee);

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