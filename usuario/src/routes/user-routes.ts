import { Rol } from "../controllers/rol";
import { User } from "../controllers/user";
import { requiresDescription } from "../middleware/rol-middleware";
import { extractRoleFromUrl, validateUserFields } from "../middleware/user-middleware";

const express = require('express');

const router = express.Router();

// ========= Rol =========

/**
 * Crear rol
 */
router.post('/rol', requiresDescription, Rol.create);

router.param('rolId', Rol.rolRequestHandler);

/**
 * Ver todos los roles
 */
router.get("/rol", Rol.index);

/**
 * Ver rol por ID
 */
router.get('/rol/:rolId', Rol.show);

/**
 * Editar un rol
 */
router.post('/rol/:rolId', requiresDescription, Rol.update);

/**
 * Eliminar un rol
 */
router.delete('/rol/:rolId', Rol.delete);

// ========= Fin Rol =========

// ========= Usuario =========

/** 
 * Crear usuario (cualquier usuario, rol debe ser incluido en el body)
 */
router.post('/usuario', validateUserFields, User.create);

/**
 * Crear cliente
 */
router.post('/usuario/clientes', validateUserFields, extractRoleFromUrl, User.create);

/**
 * Crear empleado
 */
router.post('/usuario/empleados', validateUserFields, extractRoleFromUrl, User.create);

/**
 * Actualizar usuario
 */
router.put('/usuario', User.update);

/**
 * Ver todos los usuarios
 */
router.get("/usuario", User.index);

/**
 * Ver clientes
 */
router.get('/usuario/clientes', extractRoleFromUrl, User.listByRole);

/**
 * Ver empleados
 */
router.get('/usuario/empleados', extractRoleFromUrl, User.listByRole);

router.param('dni', User.userRequestHandler);

/**
 * Ver usuario por DNI
 */
router.get('/usuario/:dni', User.show);

/**
 * Ver usuarios por rolId
 */
router.get('/rol/:rolId/usuarios', Rol.showUsers);


/**
 * Eliminar usuario
 */
router.delete('/usuario/:dni', User.delete);

// ========= Fin Usuario =========

module.exports = router;