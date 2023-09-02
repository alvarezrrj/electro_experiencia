import { Handler, RequestParamHandler } from "express";
import { prisma } from "..";
import { CustomError, RoleRequest } from "../interfaces/interfaces";

export class Rol {

    public static index: Handler = async (req: RoleRequest, res, next) => {
        try {
            let roles = await prisma.rol.findMany();
            res.json(roles);
        } catch (e) {
            next(e);
        } finally {
            prisma.$disconnect();
        }
    }

    public static show: Handler = (req: RoleRequest, res, next) => {
        prisma.$disconnect();
        res.json(req.roles);
    }

    public static create: Handler = async (req, res, next) => {
        let descripcion = req.body.descripcion.trim().toLowerCase();
        // Ensure rol doesn't already exist
        let exists = await this.findByDescripcion(descripcion);
        if (exists) {
            let err = new CustomError('Rol ya existe');
            err.name = '409';
            return next(err);
        }
        try {
            let rol = await prisma.rol.create({
                data: {
                    descripcion
                }
            });
            res.json(rol);
        } catch (e) {
            next(e);
        } finally {
            prisma.$disconnect();
        }
    }

    public static update: Handler = async (req: RoleRequest, res, next) => {
        if (!req.roles) return;
        try {
            let rol = await prisma.rol.update({
                where: {
                    id_rol: req.roles[0].id_rol
                },
                data: {
                    descripcion: req.body.descripcion.trim().toLowerCase()
                }
                });
            res.json(rol);
        } catch (e) {
            next(e);
        } finally {
            prisma.$disconnect();
        }
    }

    public static delete: Handler = async (req: RoleRequest, res, next) => {
        if (!req.roles) return;
        try {
            await prisma.rol.delete({
                where: {
                    id_rol: req.roles[0].id_rol
                }
            });
            res.send();
        } catch (e) {
            next(e);
        } finally {
            prisma.$disconnect();
        }
    }

    public static showUsers: Handler = async (req: RoleRequest, res, next) => {
        if (! req.roles) return;
        res.json(req.roles[0].usuarios);
    }

    public static async findByDescripcion(descripcion: string) {
        return await prisma.rol.findFirst({
            where: {
                descripcion
            }
        });
    }

    public static rolRequestHandler: RequestParamHandler = async (req: RoleRequest, res, next, id) => {
        let role;
        let validated = parseInt(id);
        if (isNaN(validated)) {
            let err = new CustomError('RolId debe ser int');
            err.name = '400';
            return next(err);
        } 
        try {
            role = await prisma.rol.findUnique({
                where: {
                    id_rol: validated
                },
                include: {
                    usuarios: req.url.includes('usuarios'),
                }
            });
        } catch (e) {
            return next(e);
        }
        if (! role) {
            let err = new CustomError('Rol no encontrado');
            err.name = '404';
            return next(err);
        }
        req.roles = [role];
        
        next();
    }
}