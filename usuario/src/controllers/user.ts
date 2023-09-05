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

        // Hash password
        let hash = createHash('sha256');
        hash.update(data.password);
        data.password = hash.digest('hex');
        
        try {
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
                    id: req.users[0].id
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
                    id: req.users[0].id
                }
            });
            res.send();
        } catch (e) {
            next(e);
        } finally {
            prisma.$disconnect();
        }
    }
    
    public static userRequestHandler: RequestParamHandler = async (req: UserRequest, res, next, id) => {
        let user: Usuario|null;
        let validated = parseInt(id);
        if (isNaN(validated)) {
            let err = new CustomError('id debe ser int');
            err.name = '400';
            return next(err);
        } 
        try {
            user = await prisma.usuario.findUnique({
                where: {
                    id: validated
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