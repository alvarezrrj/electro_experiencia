import { Handler, RequestParamHandler } from "express";
import { prisma } from "..";
import { CustomError, usedMaterialsRequest, SD } from "../interfaces/interfaces";
import { Materiales_Usados } from "@prisma/client";


export class usedMaterials {


  static index: Handler = async (req, res, next) => {



    try {
      let matUs= await prisma.materiales_Usados.findMany({
        include: {
            Reparacion: {
                select: {
                    id: true,
                    name: true,
                    costo: true,
                    descripcion: true,
                  
                    createdAt: true,
                    updatedAt: true,
                
                }
            },


            Material: {
              select: {
                  id: true,
                  name: true,
                  costo: true,
                  descripcion: true,
                  stock:true,

                
                  createdAt: true,
                  updatedAt: true,
              
              }
          },


            
        }
      });





      res.json(matUs);
    } catch (e) {
      next(e);
    } finally {
      prisma.$disconnect();
    }






  };

  //////
  static show: Handler = async (req: usedMaterialsRequest, res, next) => {
    prisma.$disconnect();


    if (!req.usedMaterials) return next(new Error());

    res.json(req.usedMaterials);
  };
/*
  static create: Handler = async (req, res, next) => {
    let data: Omit<Materiales_Usados, 'id' | 'createdAt' | 'updatedAt'> = req.body;

    let reparacion = await prisma.usuario.findFirst({
        where: {
            id: data.reparacion_id
        },
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



  public static UsedMaterialsRequestHandler: RequestParamHandler = async (
    req: usedMaterialsRequest,
    res,
    next,
    reparacion_id
  ) => {
    let matUsed: Materiales_Usados | null;
    let validated = parseInt(reparacion_id);
    if (isNaN(validated)) {
      let err = new CustomError("reparacionId debe ser int");
      err.name = "400";
      return next(err);
    }



    try {
      matUsed = await prisma.materiales_Usados.findUnique({
        where: {
          id: validated,
        },
        include: {
            Reparacion: {
                select: {
                  id: true,
                  name: true,
                  costo: true,
                  descripcion: true,
                
                  createdAt: true,
                  updatedAt: true,
                }


            },


            Material: {
              select: {
                  id: true,
                  name: true,
                  costo: true,
                  descripcion: true,
                  stock:true,
                  
                
                  createdAt: true,
                  updatedAt: true,
              
              }
          },

        }
      });
    } catch (e) {
      return next(e);
    }
    if (!reparacion_id) {
      let err = new CustomError("Recepción no encontrada");
      err.name = "404";
      return next(err);
    }
    req.usedMaterials = [usedMaterials];

    next();
  };
}