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
exports.User = void 0;
const __1 = require("..");
const interfaces_1 = require("../interfaces/interfaces");
const rol_1 = require("./rol");
const EmailValidator = __importStar(require("email-validator"));
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
        let emailValidated = EmailValidator.validate(data.email);
        if (!emailValidated) {
            let err = new interfaces_1.CustomError('Email inválido');
            err.name = '400';
            return next(err);
        }
        try {
            let userExists = await __1.prisma.usuario.findFirst({
                where: {
                    dni: data.dni
                }
            });
            if (userExists) {
                let err = new interfaces_1.CustomError('El usuario con ese dni ya existe');
                err.name = '400';
                return next(err);
            }
            if (!data.rol) {
                let defaultRol = await rol_1.Rol.findByDescripcion('cliente');
                if (!defaultRol) {
                    let err = new interfaces_1.CustomError('No pudimos encontrar un rol para asignarle a ese usuario');
                    err.name = '404';
                    return next(err);
                }
                data.rol = defaultRol.id_rol;
            }
            let hash = createHash('sha256');
            hash.update(data.contrasena);
            data.contrasena = hash.digest('hex');
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
            __1.prisma.$disconnect();
        }
    };
    static delete = async (req, res, next) => {
        if (!req.users)
            return;
        try {
            await __1.prisma.usuario.delete({
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
            __1.prisma.$disconnect();
        }
    };
    static userRequestHandler = async (req, res, next, dni) => {
        let user;
        let validated = parseInt(dni);
        if (isNaN(validated)) {
            let err = new interfaces_1.CustomError('dni debe ser int');
            err.name = '400';
            return next(err);
        }
        try {
            user = await __1.prisma.usuario.findUnique({
                where: {
                    dni: validated
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