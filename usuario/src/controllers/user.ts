import { Handler, RequestParamHandler } from "express";
import { prisma } from "..";
import { CustomError, UserRequest } from "../interfaces/interfaces";
import { Usuario } from "@prisma/client";
const { createHash } = require('node:crypto');

export class User {
  static index: Handler = async (req: UserRequest, res, next) => {
    try {
      let users = await prisma.usuario.findMany({
        include: {
          Rol: true,
        },
      });
      res.json(this.exclude(users, ["password"]));
    } catch (e) {
      next(e);
    } finally {
      prisma.$disconnect();
    }
  };

  static show: Handler = async (req: UserRequest, res, next) => {
    prisma.$disconnect();
    if (!req.users) return next(new Error());
    res.json(this.exclude(req.users, ["password"]));
  };

  static create: Handler = async (req, res, next) => {
    let data: Usuario = req.body;

    // Hash password
    let hash = createHash("sha256");
    hash.update(data.password);
    data.password = hash.digest("hex");

    try {
      let user = await prisma.usuario.create({ data });
      res.json(this.exclude([user], ["password"])[0]);
    } catch (e) {
      next(e);
    }
  };

  // TO DO Avoid users without the right permissions to update user role
  // or another user
  public static update: Handler = async (req, res, next) => {
    let data: Usuario = req.body;
    try {
      let user = await prisma.usuario.update({
        where: {
          id: data.id,
        },
        data,
      });
      res.json(this.exclude([user], ["password"])[0]);
    } catch (e) {
      next(e);
    } finally {
      prisma.$disconnect();
    }
  };

  public static delete: Handler = async (req: UserRequest, res, next) => {
    if (!req.users) return;
    try {
      await prisma.usuario.delete({
        where: {
          id: req.users[0].id,
        },
      });
      res.send();
    } catch (e) {
      next(e);
    } finally {
      prisma.$disconnect();
    }
  };

  /**
   * Populate req.users with users from db
   */
  public static userRequestHandler: RequestParamHandler = async (
    req: UserRequest,
    res,
    next,
    id
  ) => {
    let user: Usuario | null;
    let validated = parseInt(id);
    if (isNaN(validated)) {
      let err = new CustomError("id debe ser int");
      err.name = "400";
      return next(err);
    }
    try {
      user = await prisma.usuario.findUnique({
        where: {
          id: validated,
        },
        include: {
          Rol: req.method === "GET",
        },
      });
    } catch (e) {
      return next(e);
    }
    if (!user) {
      let err = new CustomError("Usuario no encontrado");
      err.name = "404";
      return next(err);
    }
    req.users = [user];

    next();
  };

  static exclude(users: Usuario[], keys: string[]) {
    return users.map((user) =>
      Object.fromEntries(
        Object.entries(user).filter(([key]) => !keys.includes(key))
      )
    );
  }
}

