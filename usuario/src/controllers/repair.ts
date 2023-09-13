import { Handler, RequestParamHandler } from "express";
import { prisma } from "..";
import { ReparacionNomenclada } from "@prisma/client";
import { CustomError, RepairRequest } from "../interfaces/interfaces";

export class Repair {
  static index: Handler = async (req, res, next) => {
    try {
      let repairs = await prisma.reparacionNomenclada.findMany({});
      res.json(repairs);
    } catch (e) {
      next(e);
    } finally {
      prisma.$disconnect();
    }
  };

  static show: Handler = async (req: RepairRequest, res, next) => {
    prisma.$disconnect();
    if (!req.repairs) return next(new Error());
    res.json(req.repairs);
  };

  static create: Handler = async (req, res, next) => {
    let data: ReparacionNomenclada = req.body;

    try {
      let repair = await prisma.reparacionNomenclada.create({ data });
      res.json(repair);
    } catch (e) {
      next(e);
    }
  };

  public static update: Handler = async (req: RepairRequest, res, next) => {
    if (! req.repairs) {
        let err = new CustomError('Not found');
        err.name = "404";
        return next(err);
    }
    let old: ReparacionNomenclada = req.repairs[0];
    let data = req.body;
    try {
      let repair = await prisma.reparacionNomenclada.update({
        where: {
          id: old.id,
        },
        data,
      });
      res.json(repair);
    } catch (e) {
      next(e);
    } finally {
      prisma.$disconnect();
    }
  };

  public static delete: Handler = async (req: RepairRequest, res, next) => {
    if (!req.repairs) {
        let err = new CustomError('Not found');
        err.name = "404";
        return next(err);
    }
    try {
      await prisma.reparacionNomenclada.delete({
        where: {
          id: req.repairs[0].id,
        },
      });
      res.send();
    } catch (e) {
      next(e);
    } finally {
      prisma.$disconnect();
    }
  };

  public static search: Handler = async (req, res, next) => {
    let { q } = req.query;
    if (! q) {
      let err = new CustomError(
        "¿Te olvidaste de incluir el parametro 'q' en la query string?"
      );
      err.name = "400";
      return next(err);
    }
    if (! (typeof q === "string")) {
      let err = new CustomError("q debe ser string");
      err.name = "400";
      return next(err);
    }
    try {
      let repair = await prisma.reparacionNomenclada.findFirst({
        where: {
          OR: [
            {
              name: {
                search: q,
              },
            },
            {
              descripcion: {
                search: q,
              },
            },
          ],
        },
      });
      if (! repair) {
        let err = new CustomError('Not found');
        err.name = "404";
        return next(err);
      }
      res.json(repair);
    } catch (e) {
      next(e);
    } finally {
      prisma.$disconnect();
    }
  };

  /**
   * Populate req.repairs with repairs from db
   */
  public static repairRequestHandler: RequestParamHandler = async (
    req: RepairRequest,
    res,
    next,
    id
  ) => {
    let repair: ReparacionNomenclada | null;
    let validated = parseInt(id);
    if (isNaN(validated)) {
      let err = new CustomError("id debe ser int");
      err.name = "400";
      return next(err);
    }
    try {
      repair = await prisma.reparacionNomenclada.findUnique({
        where: {
          id: validated,
        },
      });
    } catch (e) {
      return next(e);
    }
    if (!repair) {
      let err = new CustomError("Reparación no encontrada");
      err.name = "404";
      return next(err);
    }
    req.repairs = [repair];

    next();
  };
}
