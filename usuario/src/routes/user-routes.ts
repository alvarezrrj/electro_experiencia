import { Rol } from "../controllers/rol";
import { User } from "../controllers/user";
import { AuthGuard } from "../middleware/auth-middleware"
import { requiresDescription } from "../middleware/rol-middleware";
import { extractRoleFromUrl, validateUserFields } from "../middleware/user-middleware";

const express = require('express');

const router = express.Router();

// ========= Rol =========

/**
 * Crear rol
 */
router.post('/rol', AuthGuard.admin, requiresDescription, Rol.create);

router.param('rolId', Rol.rolRequestHandler);

/**
 * Ver todos los roles
 */
router.get("/rol", AuthGuard.admin, Rol.index);

/**
 * Ver rol por ID
 */
router.get('/rol/:rolId', AuthGuard.admin, Rol.show);

/**
 * Editar un rol
 */
router.post('/rol/:rolId', AuthGuard.admin, requiresDescription, Rol.update);

/**
 * Eliminar un rol
 */
router.delete('/rol/:rolId', AuthGuard.admin, Rol.delete);

// ========= Fin Rol =========

// ========= Usuario =========

/** 
 * Crear usuario (cualquier usuario, rol debe ser incluido en el body)
 */
router.post('/usuario', AuthGuard.admin, validateUserFields, User.create);

/**
 * Crear cliente
 */
router.post(
  "/usuario/clientes",
  validateUserFields,
  extractRoleFromUrl,
  User.create
);

/**
 * Crear empleado
 */
router.post(
  "/usuario/empleados",
  AuthGuard.admin,
  validateUserFields,
  extractRoleFromUrl,
  User.create
);

/**
 * Actualizar usuario
 */
router.put('/usuario', AuthGuard.userUpdate, User.update);

/**
 * Ver todos los usuarios
 */
router.get("/usuario", AuthGuard.employee, User.index);

/**
 * Ver clientes
 */
router.get('/usuario/clientes', AuthGuard.employee, extractRoleFromUrl, User.listByRole);

/**
 * Ver empleados
 */
router.get('/usuario/empleados', AuthGuard.employee, extractRoleFromUrl, User.listByRole);

router.param('dni', User.userRequestHandler);

/**
 * Ver usuario por DNI
 */
router.get('/usuario/:dni', AuthGuard.employee, User.show);

/**
 * Ver usuarios por rolId
 */
router.get('/rol/:rolId/usuarios', AuthGuard.employee, Rol.showUsers);


/**
 * Eliminar usuario
 */
router.delete('/usuario/:dni', AuthGuard.userDelete, User.delete);

// ========= Fin Usuario =========

module.exports = router;