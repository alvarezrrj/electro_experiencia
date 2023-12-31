import { Proveedores } from "../controllers/proveedor";


const express = require('express');

const router = express.Router();

// ========= Proveedores =========

/**
 * Crear proveedores
 */
router.post('/proveedor', Proveedores.create);

/**
 * Ver todos los proveedores
 */
router.get('/proveedor/', Proveedores.index)

router.param('id', Proveedores.proveedoresRequestHandler);


router.get('/proveedor/Id', Proveedores.show);

/**
 * Actualizar proveedores
 */
router.put('/proveedor/Id', Proveedores.update);

/**
 * Eliminar proveedores
 */
router.delete('/proveedor/Id', Proveedores.delete);

// ========= Fin Proveedores =========


module.exports = router;