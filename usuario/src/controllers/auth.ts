import { Handler } from "express";
const { createHash } = require('node:crypto');

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
