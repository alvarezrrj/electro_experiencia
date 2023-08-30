const express = require('express');
const bodyParser = require('body-parser');
import { Application, ErrorRequestHandler, Handler } from "express";
import { Prisma, PrismaClient, Rol } from "@prisma/client";
import { Usuario } from "@prisma/client";
import { RoleRequest, UserFields, UserRequest } from "./interfaces/interfaces";
import { CustomError } from "./interfaces/interfaces";
import { requiresDescription } from "./middleware/rol-middleware";
import { createRol, findRol } from "./db/rol";
import { findUser, createUser } from "./db/user";
import { requiresUserFields } from "./middleware/user-middleware";

// Load environment variables
require('dotenv').config();

const port = 4200;
const app: Application =  express();
app.use(bodyParser.json());

export const prisma = new PrismaClient();


/**
 * Crear rol
 * Req body: {
 *  description: string
 * }
 */
app.post('/rol', requiresDescription, async (req, res, next) => {
    let descripcion = req.body.descripcion.trim().toLowerCase();
    // Ensure rol doesn't already exist
    let exists = await findRol(descripcion);
    if (exists) {
        let err = new CustomError('Rol ya existe');
        err.name = '409';
        return next(err);
    }
    createRol(descripcion)
    .then(async (rol) => {
        await prisma.$disconnect();
        res.json(rol);
    })
    .catch(async (e) => {
        await prisma.$disconnect();
        next(e);
    })
});

/**
 * Populate req.roles with roles from db
 */
app.param('rolId', async (req: RoleRequest, res, next, id) => {
    let role;
    let validated = parseInt(id);
    if (isNaN(validated)) {
        let err = new CustomError('RolId debe ser int');
        err.name = '400';
        return next(err);
    } 
    try {
        role = await prisma.rol.findUnique({
            where: {
                id_rol: validated
            },
            include: {
                usuarios: req.url.includes('usuarios'),
            }
        });
    } catch (e) {
        return next(e);
    }
    if (! role) {
        let err = new CustomError('Rol no encontrado');
        err.name = '404';
        return next(err);
    }
    req.roles = [role];
    
    next();
});

/**
 * Ver rol por ID
 */
app.get('/rol/:rolId', (req: RoleRequest, res, next) => {
    prisma.$disconnect();
    res.json(req.roles);
});

/**
 * Ver todos los roles
 */
app.get("/rol", async (req: RoleRequest, res, next) => {
    try {
        let roles = await prisma.rol.findMany();
        res.json(roles);
    } catch (e) {
        next(e);
    } finally {
        prisma.$disconnect();
    }
});

/**
 * Editar un rol
 */
app.post('/rol/:rolId', requiresDescription, async (req: RoleRequest, res, next) => {
    if (!req.roles) return;
    try {
        let rol = await prisma.rol.update({
            where: {
                id_rol: req.roles[0].id_rol
            },
            data: {
                descripcion: req.body.descripcion.trim().toLowerCase()
            }
            });
        res.json(rol);
    } catch (e) {
        next(e);
    } finally {
        prisma.$disconnect();
    }
});

/**
 * Eliminar un rol
 */
app.delete('/rol/:rolId', async (req: RoleRequest, res, next) => {
    if (!req.roles) return;
    try {
        await prisma.rol.delete({
            where: {
                id_rol: req.roles[0].id_rol
            }
        });
        res.send();
    } catch (e) {
        next(e);
    } finally {
        prisma.$disconnect();
    }
});

/** 
 * Crear usuario
 */
// TO DO encrypt password
app.post('/usuario', requiresUserFields, async (req, res, next) => {
    let data = req.body;
    try {
        // Ensure user with same id doesn't exist
        let userExists = await findUser(data.dni);
        if(userExists) {
            let err = new CustomError('El usuario con ese dni ya existe');
            err.name = '400';
            return next(err);
        }
        // Find default rol if one is not assigned
        if (!data.rol) {
            let defaultRol = await findRol('cliente');
            data.rol = defaultRol?.id_rol;
        }
        let user = await createUser(data);
        res.json(user);
    } catch (e) {
        next(e);
    }
});

/**
 * Populate req.users with users from db
 */
app.param('dni', async (req: UserRequest, res, next, dni) => {
    let user: Usuario|null;
    let validated = parseInt(dni);
    if (isNaN(validated)) {
        let err = new CustomError('dni debe ser int');
        err.name = '400';
        return next(err);
    } 
    try {
        user = await prisma.usuario.findUnique({
            where: {
                dni: validated
            }
        });
    } catch (e) {
        return next(e);
    }
    if (! user) {
        let err = new CustomError('Usuario no encontrado');
        err.name = '404';
        return next(err);
    }
    req.users = [user];
    
    next();
});

/**
 * Actualizar usuario
 */
// TO DO Avoid users without the right permissions to update user role
app.post('/usuario/:dni', requiresUserFields, async (req: UserRequest, res, next) => {
    let data = req.body;
    if (req.users) {
        try {
            let user = await prisma.usuario.update({
                where: {
                    dni: req.users[0].dni
                },
                data
            });
            res.json(user);
        } catch (e) {
            next(e);
        } finally {
            prisma.$disconnect();
        }
    }
});

/**
 * Ver usuario por DNI
 */
app.get('/usuario/:dni', async (req: UserRequest, res, next) => {
    prisma.$disconnect();
    res.json(req.users);
});

/**
 * Ver usuarios por rolId
 */
app.get('/rol/:rolId/usuarios', async (req: RoleRequest, res, next) => {
    if (! req.roles) return;
    res.json(req.roles[0].usuarios);
});

/**
 * Ver todos los usuarios
 */
app.get("/usuario", async (req: UserRequest, res, next) => {
    try {
        req.users = await prisma.usuario.findMany();
        res.json(req.users);
    } catch (e) {
        next(e);
    } finally {
        prisma.$disconnect();
    }
});

/**
 * Eliminar usuario
 */
app.delete('/usuario/:dni', async (req: UserRequest, res, next) => {
    if (! req.users) return;
    try {
        await prisma.usuario.delete({
            where: {
                dni: req.users[0].dni
            }
        });
        res.send();
    } catch (e) {
        next(e);
    } finally {
        prisma.$disconnect();
    }
});


/**
 * Error handling
 */
const processPrismaError = (err: Prisma.PrismaClientKnownRequestError) => {
    switch (err.code) {
        case 'P2000': err.message = `Valor demasiado grande para la columna ${err.meta?.['column_name']}`; break;
        case 'P2003': err.message = 'No se puede eliminar, otras entidades dependen de esta.'; break;case 'P2005': err.message = 'Una restrición falló en la BD: '+err.meta?.['database_error']; break;
        case 'P2006': err.message = `El valor provisto ${err.meta?.['field_value']} para el campo ${err.meta?.['field_name']} del ${err.meta?.['model_name']} no es válido`; break;
        case 'P2011': err.message = `Null constraint violation on the ${err.meta?.constraint}`; break;
        case 'P2014': err.message = `El cambio que estás intentando hacer vilaría la relación ${err.meta?.['relation_name']} entre los modelos ${err.meta?.['model_a_name']} y ${err.meta?.['model_b_name']}`;
        break;
        case 'P2019': err.message = `Input error: ${err.meta?.details}`; break;
        case 'P2020': err.message = `Valor fuera de rango. ${err.meta?.details}`;



    }
    return err.message;
}
const error: ErrorRequestHandler = (err, req, res, next) => {
    prisma.$disconnect();
    res.status(parseInt(err.name) || 500);

    if (process.env.ENVIRONMENT === 'production') {
        if (err instanceof Prisma.PrismaClientKnownRequestError && err.meta) {

            err.message = processPrismaError(err);
            
        }
        else if (err instanceof Prisma.PrismaClientValidationError) {
            let message = 'Error de validación de datos ';
            message += err.message.split('Argument')[1].split(' at')[0];
            err.message = message;
        }
        else if (! (err instanceof CustomError)) {
            err.message = 'Database error';
        }
    }
    res.json({ error: err.message || 'Internal server error' });
};
app.use(error);

app.listen(port, () => console.log('Server listening on port ' + port));
