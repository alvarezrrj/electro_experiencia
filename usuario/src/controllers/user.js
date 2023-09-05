"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const __1 = require("..");
const interfaces_1 = require("../interfaces/interfaces");
const { createHash } = require('node:crypto');
class User {
    static index = async (req, res, next) => {
        try {
            req.users = await __1.prisma.usuario.findMany();
            res.json(req.users);
        }
        catch (e) {
            next(e);
        }
        finally {
            __1.prisma.$disconnect();
        }
    };
    static show = async (req, res, next) => {
        __1.prisma.$disconnect();
        res.json(req.users);
    };
    static create = async (req, res, next) => {
        let data = req.body;
        let hash = createHash('sha256');
        hash.update(data.password);
        data.password = hash.digest('hex');
        try {
            let user = await __1.prisma.usuario.create({ data });
            res.json(user);
        }
        catch (e) {
            next(e);
        }
    };
    static update = async (req, res, next) => {
        let data = req.body;
        if (!req.users)
            return;
        try {
            let user = await __1.prisma.usuario.update({
                where: {
                    id: req.users[0].id
                },
                data
            });
            res.json(user);
        }
        catch (e) {
            next(e);
        }
        finally {
            __1.prisma.$disconnect();
        }
    };
    static delete = async (req, res, next) => {
        if (!req.users)
            return;
        try {
            await __1.prisma.usuario.delete({
                where: {
                    id: req.users[0].id
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
    static userRequestHandler = async (req, res, next, id) => {
        let user;
        let validated = parseInt(id);
        if (isNaN(validated)) {
            let err = new interfaces_1.CustomError('id debe ser int');
            err.name = '400';
            return next(err);
        }
        try {
            user = await __1.prisma.usuario.findUnique({
                where: {
                    id: validated
                },
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
    };
}
exports.User = User;
//# sourceMappingURL=user.js.map