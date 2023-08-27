"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.failIfRoleExists = exports.requiresDescription = void 0;
const interfaces_1 = require("../interfaces/interfaces");
const rol_1 = require("../db/rol");
const requiresDescription = (req, res, next) => {
    let descripcion = req.body.descripcion;
    if (!descripcion) {
        let err = new interfaces_1.CustomError('Descripcion es requerida');
        err.name = '400';
        return next(err);
    }
    next();
};
exports.requiresDescription = requiresDescription;
const failIfRoleExists = async (req, res, next) => {
    let role = await (0, rol_1.findRol)(req.body.descripcion);
    if (role) {
        let err = new interfaces_1.CustomError('Rol ya existe');
        err.name = '409';
        return next(err);
    }
    next();
};
exports.failIfRoleExists = failIfRoleExists;
//# sourceMappingURL=rol-middleware.js.map