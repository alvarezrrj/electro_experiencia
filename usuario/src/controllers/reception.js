"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Reception = void 0;
const __1 = require("..");
const interfaces_1 = require("../interfaces/interfaces");
class Reception {
    static index = async (req, res, next) => {
        try {
            let receptions = await __1.prisma.recepcion.findMany({
                include: {
                    Employee: {
                        select: {
                            id: true,
                            first_name: true,
                            last_name: true,
                            email: true,
                            gender: true,
                            username: true,
                            createdAt: true,
                            updatedAt: true,
                            Rol: true
                        }
                    },
                }
            });
            res.json(receptions);
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
        if (!req.receptions)
            return next(new Error());
        res.json(req.receptions);
    };
    static create = async (req, res, next) => {
        let data = req.body;
        let employee = await __1.prisma.usuario.findFirst({
            where: {
                id: data.employee_id
            },
            include: {
                Rol: true
            }
        });
        if (employee?.Rol.descripcion !== interfaces_1.SD.ROLES.EMPLOYEE) {
            let err = new interfaces_1.CustomError("Ese usuario no es un empleado");
            err.name = "400";
            return next(err);
        }
        try {
            let reception = await __1.prisma.recepcion.create({ data });
            res.json(reception);
        }
        catch (e) {
            next(e);
        }
    };
    static update = async (req, res, next) => {
        if (!req.receptions)
            return;
        let old = req.receptions[0];
        let data = req.body;
        try {
            let reception = await __1.prisma.recepcion.update({
                where: {
                    id: old.id,
                },
                data,
            });
            res.json(reception);
        }
        catch (e) {
            next(e);
        }
        finally {
            __1.prisma.$disconnect();
        }
    };
    static delete = async (req, res, next) => {
        if (!req.receptions)
            return;
        try {
            await __1.prisma.recepcion.delete({
                where: {
                    id: req.receptions[0].id,
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
    static receptionRequestHandler = async (req, res, next, receptionId) => {
        let recepcion;
        let validated = parseInt(receptionId);
        if (isNaN(validated)) {
            let err = new interfaces_1.CustomError("recepcionId debe ser int");
            err.name = "400";
            return next(err);
        }
        try {
            recepcion = await __1.prisma.recepcion.findUnique({
                where: {
                    id: validated,
                },
                include: {
                    Employee: {
                        select: {
                            id: true,
                            first_name: true,
                            last_name: true,
                            email: true,
                            gender: true,
                            username: true,
                            createdAt: true,
                            updatedAt: true,
                            Rol: true,
                        }
                    },
                }
            });
        }
        catch (e) {
            return next(e);
        }
        if (!recepcion) {
            let err = new interfaces_1.CustomError("Recepción no encontrada");
            err.name = "404";
            return next(err);
        }
        req.receptions = [recepcion];
        next();
    };
}
exports.Reception = Reception;
//# sourceMappingURL=reception.js.map