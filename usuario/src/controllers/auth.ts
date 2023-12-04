import { Handler } from "express";
import { prisma } from "..";
import { CustomError } from "../interfaces/interfaces";
import { Rol, Usuario } from "@prisma/client";
const { createHash } = require('node:crypto');

interface SessionUser extends Usuario {
    Rol: Rol
}

declare module 'express-session' {
    interface SessionData {
        user: SessionUser;
    }
}

export class Auth {
    static login: Handler = async (req, res, next) => {
        if (req.user) {
            res.status(200).send();
            next();
        } else {
            res.send('Usuario o contraseña incorrecto');
        }
    }

    static logout: Handler = async (req, res, next) => {
        req.logout(err => {
            if (err) return next(err);
            res.status(200).send();
        });
    }

    public static hashPassword(password: string) {
        let hash = createHash("sha256");
        hash.update(password);
        return hash.digest("hex");
    }
}
