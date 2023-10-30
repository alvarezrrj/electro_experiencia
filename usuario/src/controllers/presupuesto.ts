import { Handler, RequestParamHandler } from "express";
import { prisma } from "..";
import { CustomError, presupuestosRequest, SD } from "../interfaces/interfaces";
import { Presupuesto } from "@prisma/client";
import { User } from "./user";

export class Presupuestos {
  static index: Handler = async (req, res, next) => {
    try {
      let pres = await prisma.presupuesto.findMany({
        include: {
          Recepcion: {
            select: {
              id: true,
              first_name: true,
              last_name: true,
              email: true,
              telefono: true,
              equipo: true,
              tipo: true,
              descripcion: true,
              createdAt: true,
              updatedAt: true,
              Employee:true,
            },
          },

          Usuario: {
            select: {
              id: true,
              first_name: true,
              last_name: true,
              email: true,
              telefono: true,
              cuit: true,
              condicion_iva: true,
              createdAt: true,
              updatedAt: true,
              Rol:true,
            },
          },
        },
      });

      res.json(pres);
    } catch (e) {
      next(e);
    } finally {
      prisma.$disconnect();
    }
  };

  //////
  static show: Handler = async (req: presupuestosRequest, res, next) => {
    prisma.$disconnect();

    if (!req.Presupuestos) return next(new Error());

    res.json(req.Presupuestos);
  };
  
  static create: Handler = async (req, res, next) => {


    let data: Omit<Presupuesto, 'id' | 'createdAt' | 'updatedAt'> = req.body;


    let cliente = await prisma.usuario.findFirst({
      where: {
        id: data.client_id,
      },
      include: {
        Rol: true,
      },
    });


    if (cliente?.Rol.descripcion !== SD.ROLES.Usuario) {
      let err = new CustomError("Ese usuario no es un cliente");
      err.name = "400";
      return next(err);
    }

    try {
      let pres = await prisma.presupuesto.create({ data });
      res.json(pres);
    } catch (e) {
      next(e);
    }
  }

  public static update: Handler = async (req: presupuestosRequest, res, next) => {
    if (! req.Presupuestos) return;

    let old: Presupuesto = req.Presupuestos[0];
    let data: Omit<Presupuesto, 'createdAt' | 'updatedAt'> = req.body;
    try {
      let pres = await prisma.presupuesto.update({
        where: {
          id: old.id,
        },
        data,
      });
      res.json(pres);
    } catch (e) {
      next(e);
    } finally {
      prisma.$disconnect();
    }
  }

  public static delete: Handler = async (req: presupuestosRequest, res, next) => {
    if (!req.Presupuestos) return;
    try {
      await prisma.presupuesto.delete({
        where: {
          id: req.Presupuestos[0].id,
        },
      });
      res.send();
    } catch (e) {
      next(e);
    } finally {
      prisma.$disconnect();
    }
  }


  ///////////////////////

  public static presupuestosRequestHandler: RequestParamHandler = async (
    req: presupuestosRequest,
    res,
    next,
    presupuestos_id
  ) => {
    let pres: Presupuesto | null;
    let validated = parseInt(presupuestos_id);
    if (isNaN(validated)) {
      let err = new CustomError("presupuestosId debe ser int");
      err.name = "400";
      return next(err);
    }

    try {
      pres = await prisma.presupuesto.findUnique({
        where: {
          id: validated,
        },
        include: {
          Recepcion: {
            select: {
              id: true,
              first_name: true,
              last_name: true,
              email: true,
              telefono: true,
              equipo: true,
              tipo: true,
              descripcion: true,
              createdAt: true,
              updatedAt: true,
              Employee:true,
            },
          },

          Usuario: {
            select: {
              id: true,
              first_name: true,
              last_name: true,
              email: true,
              telefono: true,
              cuit: true,
              condicion_iva: true,
              createdAt: true,
              updatedAt: true,
              Rol:true,
            },
          },
        },
      });
    } catch (e) {
      return next(e);
    }
    if (!pres) {
      let err = new CustomError("Presupuesto no encontrado");
      err.name = "404";
      return next(err);
    }
    req.Presupuestos = [pres];

    next();
  };
}
