"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requiresUserFields = void 0;
const interfaces_1 = require("../interfaces/interfaces");
const requiresUserFields = (req, res, next) => {
    let data = req.body;
    if (!data) {
        let err = new interfaces_1.CustomError('Data del usuario debe ir en el cuerpo del request');
        err.name = '400';
        return next(err);
    }
    for (let field of interfaces_1.UserFields) {
        if (!(field in data)) {
            let err = new interfaces_1.CustomError('Falta el campo ' + field);
            err.name = '400';
            return next(err);
        }
    }
    next();
};
exports.requiresUserFields = requiresUserFields;
//# sourceMappingURL=user-middleware.js.map