import { Proveedores } from "../controllers/proveedor";
import { AuthGuard } from "../middleware/auth-middleware";


const express = require('express');

const router = express.Router();

// ========= Proveedores =========

/**
 * Solo recepcionista tiene acceso
 */
router.use(AuthGuard.authed, AuthGuard.employee);

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