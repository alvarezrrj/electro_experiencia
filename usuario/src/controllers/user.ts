import { Handler, RequestParamHandler } from "express";
import { prisma } from "..";
import { CustomError, SD, UserRequest } from "../interfaces/interfaces";
import { Usuario } from "@prisma/client";
import { Auth } from "./auth";

export class User {
  static index: Handler = async (req: UserRequest, res, next) => {
    try {
      let users = await prisma.usuario.findMany({
          include: {
            Rol: true,
          },
      });
      let response = JSON.stringify(
        this.exclude(users, ["password"]),
        (key, value) => typeof value === 'bigint'
          ? value.toString()
          : value
      );
      res.send(response);
    } catch (e) {
      next(e);
    } finally {
      prisma.$disconnect();
    }
  };

  static show: Handler = async (req: UserRequest, res, next) => {
    prisma.$disconnect();
    if (!req.users) return next(new Error());
    let response = JSON.stringify(
      this.exclude(req.users, ["password"])[0],
      (key, value) => typeof value === 'bigint'
        ? value.toString()
        : value
    );

    res.send(response);
  };

  static listByRole: Handler = async (req, res, next) => {
    try {
      let users = await prisma.usuario.findMany({
        where: {
          rol: req.body.rol
        },
        include: {
          Rol: true,
        },
      });
      let response = JSON.stringify(
        this.exclude(users, ["password"]),
        (key, value) => typeof value === 'bigint'
          ? value.toString()
          : value
      );
      // res.json(this.exclude(users, ["password"]));
      res.send(response);
    } catch (e) {
      next(e);
    } finally {
      prisma.$disconnect();
    }
  }

  static create: Handler = async (req, res, next) => {
    let data: Omit<Usuario, 'createdAt' | 'updatedAt'>  = req.body;

    data.password = Auth.hashPassword(data.password);

    try {
      let user = await prisma.usuario.create({ data });
      let response = JSON.stringify(
        this.exclude([user], ["password"])[0],
        (key, value) => typeof value === 'bigint'
          ? value.toString()
          : value
      );
      res.send(response);
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
      // res.json(this.exclude([user], ["password"])[0]);
      let response = JSON.stringify(
        this.exclude([user], ["password"])[0],
        (key, value) => typeof value === 'bigint'
          ? value.toString()
          : value
      );
      res.send(response)
    } catch (e) {
      next(e);
    } finally {
      prisma.$disconnect();
    }
  };

  public static delete: Handler = async (req: UserRequest, res, next) => {
    if (!req.users) {
      let err = new CustomError('Not found');
      err.name = "404";
      return next(err);
    }
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

  public static exclude(users: Usuario[], keys: string[]) {
    return users.map((user) =>
      Object.fromEntries(
        Object.entries(user).filter(([key]) => !keys.includes(key))
      )
    );
  }
}

