import { Handler, RequestParamHandler } from "express";
import { prisma } from "..";
import { CustomError, MaterialsRequest, SD } from "../interfaces/interfaces";
import { Materials } from "@prisma/client";

export class Materiales {
  static index: Handler = async (req, res, next) => {
    try {
      let mat = await prisma.materials.findMany({
        include: {
          Proveedor: {
            select: {
              id: true,
              name: true,
              telefono: true,
              email: true,
              detalles: true,
              createdAt: true,
              updatedAt: true,
            },
          },
        },
      });

      res.json(mat);
    } catch (e) {
      next(e);
    } finally {
      prisma.$disconnect();
    }
  };

  //////
  static show: Handler = async (req: MaterialsRequest, res, next) => {
    prisma.$disconnect();

    if (!req.Materials) return next(new Error());

    res.json(req.Materials);
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

  /*
  public static MaterialsRequestHandler: RequestParamHandler = async (
    req: MaterialsRequest,
    res,
    next,
    materials_id
  ) => {
    let mat: Materials | null;
    let validated = parseInt(materials_id);
    if (isNaN(validated)) {
      let err = new CustomError("materials_Id debe ser int");
      err.name = "400";
      return next(err);
    }

    try {
      mat = await prisma.materials.findUnique({
        where: {
          id: validated,
        },
        include: {

        
          Proveedor: {
            select: {
              id: true,
              name: true,
              telefono: true,
              email: true,
              detalles: true,

              createdAt: true,
              updatedAt: true,
            },
          },
          
        },
    
      });
    } catch (e) {
      return next(e);
    }
    if (!materials_id) {
      let err = new CustomError("Material no encontrado");
      err.name = "404";
      return next(err);
    }
    req.Materials = [mat];

    next();
  };

*/
}
