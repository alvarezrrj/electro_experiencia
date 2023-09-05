import { Handler, RequestParamHandler } from "express";
import { prisma } from "..";
import { CustomError, UserRequest } from "../interfaces/interfaces";
import { Rol } from "./rol";
import { Usuario } from "@prisma/client";
import * as EmailValidator from 'email-validator';
const { createHash } = require('node:crypto');

export class User {

    static index: Handler = async (req: UserRequest, res, next) => {
        try {
            req.users = await prisma.usuario.findMany();
            res.json(req.users);
        } catch (e) {
            next(e);
        } finally {
            prisma.$disconnect();
        }
    }

    static show: Handler = async (req: UserRequest, res, next) => {
        prisma.$disconnect();
        res.json(req.users);
    }
        
    // TODO Check password requirements
    static create: Handler = async (req, res, next) => {
        let data: Usuario = req.body;
        // validate email
        let emailValidated = EmailValidator.validate(data.email);
        if (!emailValidated) {
            let err = new CustomError('Email inválido');
            err.name = '400';
            return next(err);
        }
        try {
            // Ensure user with same id doesn't exist
            let userExists = await prisma.usuario.findFirst({
                where: {
                    dni: data.dni
                }
            });
            if(userExists) {
                let err = new CustomError('El usuario con ese dni ya existe');
                err.name = '400';
                return next(err);
            }
            // Find default rol if one is not assigned
            if (!data.rol) {
                let defaultRol = await Rol.findByDescripcion('cliente');
                if (! defaultRol) {
                    let err = new CustomError('No pudimos encontrar un rol para asignarle a ese usuario');
                    err.name = '404';
                    return next(err);
                }
                data.rol = defaultRol.id_rol;
            }
            // Hash password
            let hash = createHash('sha256');
            hash.update(data.contrasena);
            data.contrasena = hash.digest('hex');
            let user = await prisma.usuario.create({ data });
            res.json(user);
        } catch (e) {
            next(e);
        }
    }

    // TO DO Avoid users without the right permissions to update user role
    public static update: Handler = async (req: UserRequest, res, next) => {
        let data = req.body;
        if (! req.users) return;
        try {
            let user = await prisma.usuario.update({
                where: {
                    dni: req.users[0].dni
                },
                data
            });
            res.json(user);
        } catch (e) {
            next(e);
        } finally {
            prisma.$disconnect();
        }
    }

    public static delete: Handler = async (req: UserRequest, res, next) => {
        if (! req.users) return;
        try {
            await prisma.usuario.delete({
                where: {
                    dni: req.users[0].dni
                }
            });
            res.send();
        } catch (e) {
            next(e);
        } finally {
            prisma.$disconnect();
        }
    }
    
    public static userRequestHandler: RequestParamHandler = async (req: UserRequest, res, next, dni) => {
        let user: Usuario|null;
        let validated = parseInt(dni);
        if (isNaN(validated)) {
            let err = new CustomError('dni debe ser int');
            err.name = '400';
            return next(err);
        } 
        try {
            user = await prisma.usuario.findUnique({
                where: {
                    dni: validated
                },
                // include: {
                //     Rol: true,
                // }
            });
        } catch (e) {
            return next(e);
        }
        if (! user) {
            let err = new CustomError('Usuario no encontrado');
            err.name = '404';
            return next(err);
        }
        req.users = [user];
        
        next();
    }
}