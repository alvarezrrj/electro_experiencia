import { Handler, RequestParamHandler } from "express";
import { prisma } from "..";
import { CustomError, presupuestosRequest, SD } from "../interfaces/interfaces";
import { presupuestos } from "@prisma/client";

export class Presupuestos {
  static index: Handler = async (req, res, next) => {
    try {
      let pres = await prisma.presupuestos.findMany({
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
  /*
  static create: Handler = async (req, res, next) => {
    let data: Omit<Materiales_Usados, 'id' | 'createdAt' | 'updatedAt'> = req.body;

    let reparacion = await prisma.usuario.findFirst({
        where: {
            id: data.reparacion_id
        },0
        include: {
            Rol: true
        }
    })

    
    if (reparacion?.Rol.descripcion !== SD.ROLES.EMPLOYEE) {
        let err = new CustomError("Ese usuario no es un empleado");
        err.name = "400";
        return next(err);
    }

    try {
      let matusados = await prisma.materiales_Usados.create({ data });
      res.json(matusados);
    } catch (e) {
      next(e);
    }
  }

  public static update: Handler = async (req: usedMaterialsRequest, res, next) => {
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
*/

  ///////////////////////

  public static presupuestosRequestHandler: RequestParamHandler = async (
    req: presupuestosRequest,
    res,
    next,
    presupuestos_id
  ) => {
    let pres: presupuestos | null;
    let validated = parseInt(presupuestos_id);
    if (isNaN(validated)) {
      let err = new CustomError("presupuestosId debe ser int");
      err.name = "400";
      return next(err);
    }

    try {
      pres = await prisma.presupuestos.findUnique({
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
