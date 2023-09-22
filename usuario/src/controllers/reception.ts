import { Handler, RequestParamHandler } from "express";
import { prisma } from "..";
import { CustomError, ReceptionRequest, SD } from "../interfaces/interfaces";
import { Recepcion } from "@prisma/client";
import { User } from "./user";

export class Reception {
  static index: Handler = async (req, res, next) => {
    try {
      let receptions = await prisma.recepcion.findMany({
        include: {
            Employee: {
                select: {
                    id: true,
                    first_name: true,
                    last_name: true,
                    email: true,
                    cuit: true,
                    condicion_iva: true,
                    createdAt: true,
                    updatedAt: true,
                    Rol: true
                }
            },
        }
      });

      res.json(receptions);
    } catch (e) {
      next(e);
    } finally {
      prisma.$disconnect();
    }
  };

  static show: Handler = async (req: ReceptionRequest, res, next) => {
    prisma.$disconnect();
    if (!req.receptions) return next(new Error());
    res.json(req.receptions);
  };

  static create: Handler = async (req, res, next) => {
    let data: Omit<Recepcion, 'id' | 'createdAt' | 'updatedAt'> = req.body;

    let employee = await prisma.usuario.findFirst({
        where: {
            id: data.employee_id
        },
        include: {
            Rol: true
        }
    })
    if (employee?.Rol.descripcion !== SD.ROLES.EMPLOYEE) {
        let err = new CustomError("Ese usuario no es un empleado");
        err.name = "400";
        return next(err);
    }

    try {
      let reception = await prisma.recepcion.create({ data });
      res.json(reception);
    } catch (e) {
      next(e);
    }
  }

  public static update: Handler = async (req: ReceptionRequest, res, next) => {
    if (! req.receptions) return;

    let old: Recepcion = req.receptions[0];
    let data: Omit<Recepcion, 'createdAt' | 'updatedAt'> = req.body;
    try {
      let reception = await prisma.recepcion.update({
        where: {
          id: old.id,
        },
        data,
      });
      res.json(reception);
    } catch (e) {
      next(e);
    } finally {
      prisma.$disconnect();
    }
  }

  public static delete: Handler = async (req: ReceptionRequest, res, next) => {
    if (!req.receptions) return;
    try {
      await prisma.recepcion.delete({
        where: {
          id: req.receptions[0].id,
        },
      });
      res.send();
    } catch (e) {
      next(e);
    } finally {
      prisma.$disconnect();
    }
  }

  public static receptionRequestHandler: RequestParamHandler = async (
    req: ReceptionRequest,
    res,
    next,
    receptionId
  ) => {
    let recepcion: Recepcion | null;
    let validated = parseInt(receptionId);
    if (isNaN(validated)) {
      let err = new CustomError("recepcionId debe ser int");
      err.name = "400";
      return next(err);
    }
    try {
      recepcion = await prisma.recepcion.findUnique({
        where: {
          id: validated,
        },
        include: {
            Employee: {
                select: {
                    id: true,
                    first_name: true,
                    last_name: true,
                    email: true,
                    cuit: true,
                    condicion_iva: true,
                    createdAt: true,
                    updatedAt: true,
                    Rol: true,
                }
            },
        }
      });
    } catch (e) {
      return next(e);
    }
    if (!recepcion) {
      let err = new CustomError("Recepción no encontrada");
      err.name = "404";
      return next(err);
    }
    req.receptions = [recepcion];

    next();
  };
}