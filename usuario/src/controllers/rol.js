"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Rol = void 0;
const __1 = require("..");
const interfaces_1 = require("../interfaces/interfaces");
class Rol {
    static index = async (req, res, next) => {
        try {
            let roles = await __1.prisma.rol.findMany();
            res.json(roles);
        }
        catch (e) {
            next(e);
        }
        finally {
            __1.prisma.$disconnect();
        }
    };
    static show = (req, res, next) => {
        __1.prisma.$disconnect();
        res.json(req.roles);
    };
    static create = async (req, res, next) => {
        let descripcion = req.body.descripcion.trim().toLowerCase();
        let exists = await this.findByDescripcion(descripcion);
        if (exists) {
            let err = new interfaces_1.CustomError('Rol ya existe');
            err.name = '409';
            return next(err);
        }
        try {
            let rol = await __1.prisma.rol.create({
                data: {
                    descripcion
                }
            });
            res.json(rol);
        }
        catch (e) {
            next(e);
        }
        finally {
            __1.prisma.$disconnect();
        }
    };
    static update = async (req, res, next) => {
        if (!req.roles)
            return;
        try {
            let rol = await __1.prisma.rol.update({
                where: {
                    id_rol: req.roles[0].id_rol
                },
                data: {
                    descripcion: req.body.descripcion.trim().toLowerCase(),
                }
            });
            res.json(rol);
        }
        catch (e) {
            next(e);
        }
        finally {
            __1.prisma.$disconnect();
        }
    };
    static delete = async (req, res, next) => {
        if (!req.roles)
            return;
        try {
            await __1.prisma.rol.delete({
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
            __1.prisma.$disconnect();
        }
    };
    static showUsers = async (req, res, next) => {
        if (!req.roles)
            return;
        res.json(req.roles[0].usuarios);
    };
    static async findByDescripcion(descripcion) {
        return await __1.prisma.rol.findFirst({
            where: {
                descripcion
            }
        });
    }
    static rolRequestHandler = async (req, res, next, id) => {
        let role;
        let validated = parseInt(id);
        if (isNaN(validated)) {
            let err = new interfaces_1.CustomError('RolId debe ser int');
            err.name = '400';
            return next(err);
        }
        try {
            role = await __1.prisma.rol.findUnique({
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
    };
}
exports.Rol = Rol;
//# sourceMappingURL=rol.js.map