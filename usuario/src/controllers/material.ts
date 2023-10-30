import { Handler, RequestParamHandler } from "express";
import { prisma } from "..";
import { CustomError, MaterialsRequest, SD } from "../interfaces/interfaces";
import { Material } from "@prisma/client";

export class Materiales {
  static index: Handler = async (req, res, next) => {
    try {
      let mat = await prisma.material.findMany({
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

  static create: Handler = async (req, res, next) => {
    let data: Omit<Material, 'id' | 'createdAt' | 'updatedAt'> = req.body;

 


    try {
      let mat = await prisma.material.create({ data });
      res.json(mat);
    } catch (e) {
      next(e);
    }
  }

  public static update: Handler = async (req: MaterialsRequest, res, next) => {



    let data: Omit<Material, 'createdAt' | 'updatedAt'> = req.body;

    try {
      let mat = await prisma.material.update({
        where: {
          id: data.id,
        },
        data,
      });
      res.json(mat);
    } catch (e) {
      next(e);
    } finally {
      prisma.$disconnect();
    }
  }

  public static delete: Handler = async (req: MaterialsRequest, res, next) => {

    if (!req.Materials) {
      let err = new CustomError('Not found');
      err.name = "404";
      return next(err);
  }
  try {
    await prisma.material.delete({
      where: {
        id: req.Materials[0].id,
      },
    });
    res.send();
  } catch (e) {
    next(e);
  } finally {
    prisma.$disconnect();
  }
};


  ///////////////////////

  public static MaterialsRequestHandler: RequestParamHandler = async (
    req: MaterialsRequest,
    res,
    next,
    materials_id
  ) => {
    let mat: Material | null;
    let validated = parseInt(materials_id);
    if (isNaN(validated)) {
      let err = new CustomError("materials_Id debe ser int");
      err.name = "400";
      return next(err);
    }

    try {
      mat = await prisma.material.findUnique({
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
    if (!mat) {
      let err = new CustomError("Material no encontrado");
      err.name = "404";
      return next(err);
    }
    req.Materials = [mat];

    next();
  };
}
