const express = require('express');
const bodyParser = require('body-parser');
import { Application } from "express";
import { PrismaClient } from "@prisma/client";
import { requiresDescription } from "./middleware/rol-middleware";
import { requiresUserFields, validateUserFields } from "./middleware/user-middleware";
import { User } from "./controllers/user";
import { Rol }  from "./controllers/rol";
import { errorHandler } from "./middleware/error-handler";

// Load environment variables
require('dotenv').config();

const port = process.env.port || 4200;
const app: Application =  express();
app.use(bodyParser.json());

export const prisma = new PrismaClient();


/**
 * Crear rol
 */
app.post('/rol', requiresDescription, Rol.create);

/**
 * Poblar req.roles con roles presentes en la bd
 */
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

/** 
 * Crear usuario
 */
app.post('/usuario', requiresUserFields, validateUserFields, User.create);

/**
 * Populate req.users with users from db
 */
app.param('dni', User.userRequestHandler);

/**
 * Actualizar usuario
 */
app.post('/usuario/:dni', requiresUserFields, User.update);

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

/**
 * Error handling
 */
app.use(errorHandler);

app.listen(port, () => console.log('Server listening on port ' + port));
