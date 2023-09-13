"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Repair = void 0;
const __1 = require("..");
const interfaces_1 = require("../interfaces/interfaces");
class Repair {
    static index = async (req, res, next) => {
        try {
            let repairs = await __1.prisma.reparacion.findMany({});
            res.json(repairs);
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
        if (!req.repairs)
            return next(new Error());
        res.json(req.repairs);
    };
    static create = async (req, res, next) => {
        let data = req.body;
        try {
            let repair = await __1.prisma.reparacion.create({ data });
            res.json(repair);
        }
        catch (e) {
            next(e);
        }
    };
    static update = async (req, res, next) => {
        if (!req.repairs) {
            let err = new interfaces_1.CustomError('Not found');
            err.name = "404";
            return next(err);
        }
        let old = req.repairs[0];
        let data = req.body;
        try {
            let repair = await __1.prisma.reparacion.update({
                where: {
                    id: old.id,
                },
                data,
            });
            res.json(repair);
        }
        catch (e) {
            next(e);
        }
        finally {
            __1.prisma.$disconnect();
        }
    };
    static delete = async (req, res, next) => {
        if (!req.repairs) {
            let err = new interfaces_1.CustomError('Not found');
            err.name = "404";
            return next(err);
        }
        try {
            await __1.prisma.reparacion.delete({
                where: {
                    id: req.repairs[0].id,
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
    static search = async (req, res, next) => {
        let { q } = req.query;
        if (!q) {
            let err = new interfaces_1.CustomError("¿Te olvidaste de incluir el parametro 'q' en la query string?");
            err.name = "400";
            return next(err);
        }
        if (!(typeof q === "string")) {
            let err = new interfaces_1.CustomError("q debe ser string");
            err.name = "400";
            return next(err);
        }
        try {
            let repair = await __1.prisma.reparacion.findFirst({
                where: {
                    OR: [
                        {
                            name: {
                                search: q,
                            },
                        },
                        {
                            descripcion: {
                                search: q,
                            },
                        },
                    ],
                },
            });
            if (!repair) {
                let err = new interfaces_1.CustomError('Not found');
                err.name = "404";
                return next(err);
            }
            res.json(repair);
        }
        catch (e) {
            next(e);
        }
        finally {
            __1.prisma.$disconnect();
        }
    };
    static repairRequestHandler = async (req, res, next, id) => {
        let repair;
        let validated = parseInt(id);
        if (isNaN(validated)) {
            let err = new interfaces_1.CustomError("id debe ser int");
            err.name = "400";
            return next(err);
        }
        try {
            repair = await __1.prisma.reparacion.findUnique({
                where: {
                    id: validated,
                },
            });
        }
        catch (e) {
            return next(e);
        }
        if (!repair) {
            let err = new interfaces_1.CustomError("Reparación no encontrada");
            err.name = "404";
            return next(err);
        }
        req.repairs = [repair];
        next();
    };
}
exports.Repair = Repair;
//# sourceMappingURL=repair.js.map