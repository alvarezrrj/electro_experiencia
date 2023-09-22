import { Handler } from "express";
import { prisma } from "..";
import { CustomError } from "../interfaces/interfaces";
import { Usuario } from "@prisma/client";
const { createHash } = require('node:crypto');

declare module 'express-session' {
    interface SessionData {
        user: Usuario;
    }
}

export class Auth {

    static get loginError() {
        let err = new CustomError('Usuario o contraseña incorrecto');
        err.name = '400';
        return err;
    }

    static login: Handler = async (req, res, next) => {
        let { email, password } = req.body;
        let user = await prisma.usuario.findFirst({
            where: {
                email
            }
        });
        if (!user) return next(this.loginError);

        if (user.password !== this.hashPassword(password)) return next(this.loginError);

        req.session.user = user;
        req.session
        next();
    }

    static logout: Handler = async (req, res, next) => {
        delete req.session.user;
        next();
    }

    public static hashPassword(password: string) {
        let hash = createHash("sha256");
        hash.update(password);
        return hash.digest("hex");
    }
}
