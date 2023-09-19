const express = require('express');
const bodyParser = require('body-parser');
const qs = require('qs');
import { Application } from "express";
import { PrismaClient } from "@prisma/client";
import { requiresDescription } from "./middleware/rol-middleware";
import { extractRoleFromUrl, validateUserFields } from "./middleware/user-middleware";
import { User } from "./controllers/user";
import { Rol }  from "./controllers/rol";
import { errorHandler } from "./middleware/error-handler";
import { Repair } from "./controllers/repair";
import { Reception } from "./controllers/reception";

// Load environment variables
require('dotenv').config();

const port = process.env.port || 4200;
const app: Application =  express();
app.use(bodyParser.json());
app.set('query parser', 'extended');

export const prisma = new PrismaClient();

// ========= Rol =========

/**
 * Crear rol
 */
app.post('/rol', requiresDescription, Rol.create);

app.param('rolId', Rol.rolRequestHandler);

/**
 * Ver todos los roles
 */
app.get("/rol", Rol.index);

/**
 * Ver rol por ID
 */
app.get('/rol/:rolId', Rol.show);

/**
 * Editar un rol
 */
app.post('/rol/:rolId', requiresDescription, Rol.update);

/**
 * Eliminar un rol
 */
app.delete('/rol/:rolId', Rol.delete);

// ========= Fin Rol =========

// ========= Usuario =========

/** 
 * Crear usuario (cualquier usuario, rol debe ser incluido en el body)
 */
app.post('/usuario', validateUserFields, User.create);

/**
 * Crear cliente
 */
app.post('/usuario/clientes', validateUserFields, extractRoleFromUrl, User.create);

/**
 * Crear empleado
 */
app.post('/usuario/empleados', validateUserFields, extractRoleFromUrl, User.create);

/**
 * Actualizar usuario
 */
app.put('/usuario', User.update);

/**
 * Ver todos los usuarios
 */
app.get("/usuario", User.index);

/**
 * Ver clientes
 */
app.get('/usuario/clientes', extractRoleFromUrl, User.listByRole);

/**
 * Ver empleados
 */
app.get('/usuario/empleados', extractRoleFromUrl, User.listByRole);

app.param('dni', User.userRequestHandler);

/**
 * Ver usuario por DNI
 */
app.get('/usuario/:dni', User.show);

/**
 * Ver usuarios por rolId
 */
app.get('/rol/:rolId/usuarios', Rol.showUsers);


/**
 * Eliminar usuario
 */
app.delete('/usuario/:dni', User.delete);

// ========= Fin Usuario =========

// ========= ReparacionNomencladaes =========

/**
 * Crear reparacion
 */
app.post('/reparacion', Repair.create);

/**
 * Ver todas las reparaciones  
 */
app.get("/reparacion", Repair.index);

/**
 * Buscar reparacion por palabra clave
 */
app.get('/reparacion/search', Repair.search);

app.param('repairId', Repair.repairRequestHandler);

/**
 * Ver reparacion por reparacionId
 */
app.get('/reparacion/:repairId', Repair.show);

/**
 * Actualizar reparación
 */
app.put('/reparacion/:repairId', Repair.update);

/**
 * Eliminar reparacion
 */
app.delete('/reparacion/:repairId', Repair.delete);

// ========= Fin ReparacionNomencladaes =========

// ========= Recepciones =========

/**
 * Crear recepción
 */
app.post('/recepcion', Reception.create);

/**
 * Ver todas las recepciones
 */
app.get('/recepcion', Reception.index)

app.param('receptionId', Reception.receptionRequestHandler);

/**
 * Ver recepción por recepcionId
 */
app.get('/recepcion/:receptionId', Reception.show);

/**
 * Actualizar recepción
 */
app.put('/recepcion/:receptionId', Reception.update);

/**
 * Eliminar recepción
 */
app.delete('/recepcion/:receptionId', Reception.delete);

// ========= Fin Recepciones =========



/**
 * Error handling
 */
app.use(errorHandler);

app.listen(port, () => console.log('Server listening on port ' + port));
