const express = require('express');
const bodyParser = require('body-parser');
const qs = require('qs');
import { Application } from "express";
import { PrismaClient } from "@prisma/client";
import { requiresDescription } from "./middleware/rol-middleware";
import { validateUserFields } from "./middleware/user-middleware";
import { User } from "./controllers/user";
import { Rol }  from "./controllers/rol";
import { errorHandler } from "./middleware/error-handler";
import { Repair } from "./controllers/repair";

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
 * Crear usuario
 */
app.post('/usuario', validateUserFields, User.create);


app.param('dni', User.userRequestHandler);

/**
 * Actualizar usuario
 */
app.put('/usuario', User.update);

/**
 * Ver todos los usuarios
 */
app.get("/usuario", User.index);

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

// ========= Reparaciones =========

/**
 * Crear reparacion
 */
app.post('/reparacion', Repair.create);

/**
 * Ver todas las reparaciones  
 */
app.get("/reparacion/", Repair.index);

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

// ========= Fin Reparaciones =========


/**
 * Error handling
 */
app.use(errorHandler);

app.listen(port, () => console.log('Server listening on port ' + port));
