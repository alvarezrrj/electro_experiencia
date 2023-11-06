import { Handler, RequestParamHandler } from "express";
import { prisma } from "..";
import { CustomError, proveedorRequest, SD } from "../interfaces/interfaces";
import { Proveedor } from "@prisma/client";

export class Proveedores {
  static index: Handler = async (req, res, next) => {
    try {
      let prov = await prisma.proveedor.findMany({

      include: {
          
Materials:true,
      },
    });



      res.json(prov);
    } catch (e) {
      next(e);
    } finally {
      prisma.$disconnect();
    }
  };

  //////
  static show: Handler = async (req: proveedorRequest, res, next) => {
    prisma.$disconnect();

    if (!req.Proveedores) return next(new Error());

    res.json(req.Proveedores);
  };
  
  static create: Handler = async (req, res, next) => {
    let data: Omit<Proveedor, 'id' | 'createdAt' | 'updatedAt'> = req.body;

    try {
      let prov = await prisma.proveedor.create({ data });
      res.json(prov);
    } catch (e) {
      next(e);
    }
  };



  public static update: Handler = async (req: proveedorRequest, res, next) => {

    let data: Omit<Proveedor, 'createdAt' | 'updatedAt'>  = req.body;
    try {
      let prov = await prisma.proveedor.update({
        where: {
          id: data.id,
        },
        data,
      });
      res.json(prov);
    } catch (e) {
      next(e);
    } finally {
      prisma.$disconnect();
    }
  };

  public static delete: Handler = async (req: proveedorRequest, res, next) => {

    if (!req.Proveedores) return;
    try {
      await prisma.recepcion.delete({
        where: {
          id: req.Proveedores[0].id,
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

  public static proveedoresRequestHandler: RequestParamHandler = async (
    req: proveedorRequest,
    res,
    next,
    proveedor_id
  ) => {
    let prov: Proveedor | null;
    let validated = parseInt(proveedor_id);
    if (isNaN(validated)) {
      let err = new CustomError("proveedorId debe ser int");
      err.name = "400";
      return next(err);
    }

    try {
      prov = await prisma.proveedor.findUnique({
        where: {
          id: validated,
        },
        include: {
          Materials: true,
        },
      });
    } catch (e) {
      return next(e);
    }

    if (!prov) {
      let err = new CustomError("Proveedor no encontrado");
      err.name = "404";
      return next(err);
    }
    req.Proveedores = [prov];

    next();
  };
}
