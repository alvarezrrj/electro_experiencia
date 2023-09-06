"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const __1 = require("..");
const interfaces_1 = require("../interfaces/interfaces");
const { createHash } = require('node:crypto');
class User {
    static index = async (req, res, next) => {
        try {
            let users = await __1.prisma.usuario.findMany({
                include: {
                    Rol: true,
                },
            });
            res.json(this.exclude(users, ["password"]));
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
        if (!req.users)
            return next(new Error());
        res.json(this.exclude(req.users, ["password"]));
    };
    static create = async (req, res, next) => {
        let data = req.body;
        let hash = createHash("sha256");
        hash.update(data.password);
        data.password = hash.digest("hex");
        try {
            let user = await __1.prisma.usuario.create({ data });
            res.json(this.exclude([user], ["password"])[0]);
        }
        catch (e) {
            next(e);
        }
    };
    static update = async (req, res, next) => {
        let data = req.body;
        try {
            let user = await __1.prisma.usuario.update({
                where: {
                    id: data.id,
                },
                data,
            });
            res.json(this.exclude([user], ["password"])[0]);
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
                    id: req.users[0].id,
                },
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
            let err = new interfaces_1.CustomError("id debe ser int");
            err.name = "400";
            return next(err);
        }
        try {
            user = await __1.prisma.usuario.findUnique({
                where: {
                    id: validated,
                },
                include: {
                    Rol: req.method === "GET",
                },
            });
        }
        catch (e) {
            return next(e);
        }
        if (!user) {
            let err = new interfaces_1.CustomError("Usuario no encontrado");
            err.name = "404";
            return next(err);
        }
        req.users = [user];
        next();
    };
    static exclude(users, keys) {
        return users.map((user) => Object.fromEntries(Object.entries(user).filter(([key]) => !keys.includes(key))));
    }
}
exports.User = User;
//# sourceMappingURL=user.js.map