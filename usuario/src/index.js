"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
const express = require('express');
const bodyParser = require('body-parser');
const client_1 = require("@prisma/client");
const interfaces_1 = require("./interfaces/interfaces");
const rol_middleware_1 = require("./middleware/rol-middleware");
const rol_1 = require("./db/rol");
const user_1 = require("./db/user");
const user_middleware_1 = require("./middleware/user-middleware");
require('dotenv').config();
const port = 4200;
const app = express();
app.use(bodyParser.json());
exports.prisma = new client_1.PrismaClient();
app.post('/rol', rol_middleware_1.requiresDescription, async (req, res, next) => {
    let descripcion = req.body.descripcion.trim().toLowerCase();
    let exists = await (0, rol_1.findRol)(descripcion);
    if (exists) {
        let err = new interfaces_1.CustomError('Rol ya existe');
        err.name = '409';
        return next(err);
    }
    (0, rol_1.createRol)(descripcion)
        .then(async (rol) => {
        await exports.prisma.$disconnect();
        res.json(rol);
    })
        .catch(async (e) => {
        await exports.prisma.$disconnect();
        next(e);
    });
});
app.param('rolId', async (req, res, next, id) => {
    let role;
    let validated = parseInt(id);
    if (isNaN(validated)) {
        let err = new interfaces_1.CustomError('RolId debe ser int');
        err.name = '400';
        return next(err);
    }
    try {
        role = await exports.prisma.rol.findUnique({
            where: {
                id_rol: validated
            },
            include: {
                usuarios: req.url.includes('usuarios'),
            }
        });
    }
    catch (e) {
        return next(e);
    }
    if (!role) {
        let err = new interfaces_1.CustomError('Rol no encontrado');
        err.name = '404';
        return next(err);
    }
    req.roles = [role];
    next();
});
app.get('/rol/:rolId', (req, res, next) => {
    exports.prisma.$disconnect();
    res.json(req.roles);
});
app.get("/rol", async (req, res, next) => {
    try {
        let roles = await exports.prisma.rol.findMany();
        res.json(roles);
    }
    catch (e) {
        next(e);
    }
    finally {
        exports.prisma.$disconnect();
    }
});
app.post('/rol/:rolId', rol_middleware_1.requiresDescription, async (req, res, next) => {
    if (!req.roles)
        return;
    try {
        let rol = await exports.prisma.rol.update({
            where: {
                id_rol: req.roles[0].id_rol
            },
            data: {
                descripcion: req.body.descripcion.trim().toLowerCase()
            }
        });
        res.json(rol);
    }
    catch (e) {
        next(e);
    }
    finally {
        exports.prisma.$disconnect();
    }
});
app.delete('/rol/:rolId', async (req, res, next) => {
    if (!req.roles)
        return;
    try {
        await exports.prisma.rol.delete({
            where: {
                id_rol: req.roles[0].id_rol
            }
        });
        res.send();
    }
    catch (e) {
        next(e);
    }
    finally {
        exports.prisma.$disconnect();
    }
});
app.post('/usuario', user_middleware_1.requiresUserFields, async (req, res, next) => {
    let data = req.body;
    try {
        let userExists = await (0, user_1.findUser)(data.dni);
        if (userExists) {
            let err = new interfaces_1.CustomError('El usuario con ese dni ya existe');
            err.name = '400';
            return next(err);
        }
        if (!data.rol) {
            let defaultRol = await (0, rol_1.findRol)('cliente');
            data.rol = defaultRol?.id_rol;
        }
        let user = await (0, user_1.createUser)(data);
        res.json(user);
    }
    catch (e) {
        next(e);
    }
});
app.param('dni', async (req, res, next, dni) => {
    let user;
    let validated = parseInt(dni);
    if (isNaN(validated)) {
        let err = new interfaces_1.CustomError('dni debe ser int');
        err.name = '400';
        return next(err);
    }
    try {
        user = await exports.prisma.usuario.findUnique({
            where: {
                dni: validated
            }
        });
    }
    catch (e) {
        return next(e);
    }
    if (!user) {
        let err = new interfaces_1.CustomError('Usuario no encontrado');
        err.name = '404';
        return next(err);
    }
    req.users = [user];
    next();
});
app.post('/usuario/:dni', user_middleware_1.requiresUserFields, async (req, res, next) => {
    let data = req.body;
    if (req.users) {
        try {
            let user = await exports.prisma.usuario.update({
                where: {
                    dni: req.users[0].dni
                },
                data
            });
            res.json(user);
        }
        catch (e) {
            next(e);
        }
        finally {
            exports.prisma.$disconnect();
        }
    }
});
app.get('/usuario/:dni', async (req, res, next) => {
    exports.prisma.$disconnect();
    res.json(req.users);
});
app.get('/rol/:rolId/usuarios', async (req, res, next) => {
    if (!req.roles)
        return;
    res.json(req.roles[0].usuarios);
});
app.get("/usuario", async (req, res, next) => {
    try {
        req.users = await exports.prisma.usuario.findMany();
        res.json(req.users);
    }
    catch (e) {
        next(e);
    }
    finally {
        exports.prisma.$disconnect();
    }
});
app.delete('/usuario/:dni', async (req, res, next) => {
    if (!req.users)
        return;
    try {
        await exports.prisma.usuario.delete({
            where: {
                dni: req.users[0].dni
            }
        });
        res.send();
    }
    catch (e) {
        next(e);
    }
    finally {
        exports.prisma.$disconnect();
    }
});
const error = (err, req, res, next) => {
    exports.prisma.$disconnect();
    res.status(parseInt(err.name) || 500);
    if (process.env.ENVIRONMENT === 'production') {
        if (err instanceof client_1.Prisma.PrismaClientKnownRequestError && err.meta) {
            err.message = '';
            for (let key in err.meta) {
                err.message += key + ': ' + err.meta[key] + '\n';
            }
        }
        else if (err instanceof client_1.Prisma.PrismaClientValidationError) {
            console.log('VALIDATION ERROR');
            let message = 'Error de validación de datos ';
            message += err.message.split('Argument')[1].split(' at')[0];
            err.message = message;
        }
        else if (!(err instanceof interfaces_1.CustomError)) {
            err.message = 'Database error';
        }
    }
    res.json({ error: err.message || 'Internal server error' });
};
app.use(error);
app.listen(port, () => console.log('Server listening on port ' + port));
//# sourceMappingURL=index.js.map