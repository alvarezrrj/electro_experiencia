import { Handler } from "express";
import { prisma } from "..";
import { Auth } from "../controllers/auth";
import passport from "passport";
import { Rol, Usuario } from "@prisma/client";
import { SD, UserRequest, presupuestosRequest } from "../interfaces/interfaces";
const LocalStrategy = require("passport-local");

interface RoledUser extends Usuario {
  Rol: Rol;
}

export class AuthGuard {
  /**
   * Requires user to be authenticated
   */
  public static authed: Handler = (req, res, next) => {
    if (!req.user) {
      res.status(401).json({
        message: "No autorizado",
      });
    } else {
      next();
    }
  }

  /**
   * Requires authenticated user to be admin
   */
  public static admin: Handler = (req, res, next) => {
    let user = req.user as RoledUser;
    if (user.Rol.descripcion !== SD.ROLES.ADMIN) {
      res.status(403).json({
        message: "No autorizado",
      });
    } else {
      next();
    }
  }

  /**
   * Requires authenticated user to be employee (or admin)
   */
  static employee: Handler = (req, res, next) => {
    let user = req.user as RoledUser;
    if (user.Rol.descripcion !== SD.ROLES.EMPLOYEE &&
        user.Rol.descripcion !== SD.ROLES.ADMIN) {
      res.status(403).json({
        message: "No autorizado",
      });
    } else {
      next();
    }
  }

  /**
   * Requires authenticated user to be client (or admin)
   */
  static client: Handler = (req, res, next) => {
    let user = req.user as RoledUser;
    if (user.Rol.descripcion !== SD.ROLES.CLIENT &&
        user.Rol.descripcion !== SD.ROLES.ADMIN) {
      res.status(403).json({
        message: "No autorizado",
      });
    } else {
      next();
    }
  }

  /**
   * Requires authenticated user to be owner of presupuesto, employee or admin
   */
  static presupuesto: Handler = (req: presupuestosRequest, res, next) => {
    let user = req.user as RoledUser;
    //@ts-ignore - We wouldn't be here if req.Presupuestos wasn't populated
    if (user.id !== req.Presupuestos[0].client_id &&
        user.Rol.descripcion !== SD.ROLES.EMPLOYEE &&
        user.Rol.descripcion !== SD.ROLES.ADMIN) {
      res.status(403).json({
        message: "No autorizado",
      });
    } else {
      next();
    }
  } 

  /**
   * Avoid anyone who is not admin changing their own role or updating anyone else
   */
  static userUpdate: Handler = (req, res, next) => {
    let data: Usuario = req.body;
    let user = req.user as RoledUser;
    if ((data.rol || data.id !== user.id) && user.Rol.descripcion !== SD.ROLES.ADMIN) {
      res.status(403).json({
        message: "No autorizado",
      });
    } else {
      next();
    }
  }

  /**
   * Only allow users to delete themselves unless they're admin
   */
  static userDelete: Handler = (req: UserRequest, res, next) => {
    let user = req.user as RoledUser;
    // @ts-ignore
    if (user.id !== req.users[0].id && user.Rol.descripcion !== SD.ROLES.ADMIN) {
      res.status(403).json({
        message: "No autorizado",
      });
    } else {
      next();
    }
  }
}

export const localStrategy: passport.Strategy = new LocalStrategy(
  {
    usernameField: "email",
    passwordField: "password",
  },
  async function (
    email: string,
    password: string,
    done: passport.DoneCallback
  ) {
    try {
        let user = await prisma.usuario.findFirst({
          where: {
            email,
          },
        });

        if (!user) return done(null, false);

        if (user.password !== Auth.hashPassword(password)) return done(null, false);

        return done(null, user);
    } catch (e) {
        done(e);
    }
  }
);

export const serializer = (user: Usuario, done: passport.DoneCallback) => {
    return done(null, user.id);
}

export const deserializer = async (id: number, done: passport.DoneCallback) => {
    process.nextTick(async () => {
        try {
            let user = await prisma.usuario.findUnique({
                where: { id },
                include: {
                    Rol: true,
                }
            });

            return done(null, user);
        } catch (e) {
            done(e);
        }
    })
}
