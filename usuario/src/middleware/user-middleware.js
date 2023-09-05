"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUserFields = exports.requiresUserFields = void 0;
const interfaces_1 = require("../interfaces/interfaces");
const EmailValidator = __importStar(require("email-validator"));
const rol_1 = require("../controllers/rol");
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
const validateUserFields = async (req, res, next) => {
    let data = req.body;
    let emailValidated = EmailValidator.validate(data.email);
    if (!emailValidated) {
        let err = new interfaces_1.CustomError('Email inválido');
        err.name = '400';
        return next(err);
    }
    if (data.password.length < 8 ||
        !/[A-Z]/.test(data.password) ||
        !/[a-z]/.test(data.password) ||
        !/[0-9]/.test(data.password) ||
        !/[^\w\b]/.test(data.password)) {
        let err = new interfaces_1.CustomError('La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un simbolo');
        err.name = '400';
        return next(err);
    }
    try {
        if (!data.rol) {
            let defaultRol = await rol_1.Rol.findByDescripcion('cliente');
            if (!defaultRol) {
                let err = new interfaces_1.CustomError('No pudimos encontrar un rol para asignarle a ese usuario');
                err.name = '404';
                return next(err);
            }
            data.rol = defaultRol.id_rol;
        }
    }
    catch (e) {
        next(e);
    }
};
exports.validateUserFields = validateUserFields;
//# sourceMappingURL=user-middleware.js.map