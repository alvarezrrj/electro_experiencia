"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requiresDescription = void 0;
const interfaces_1 = require("../interfaces/interfaces");
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
//# sourceMappingURL=rol-middleware.js.map