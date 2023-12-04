import { Handler } from "express";
import { prisma } from "..";
import { Auth } from "../controllers/auth";
import passport from "passport";
import { Usuario } from "@prisma/client";
import { SD } from "../interfaces/interfaces";
const LocalStrategy = require("passport-local");

export class AuthGuard {
  /**
   * Requires user to be authenticated
   */
  public static authed: Handler = (req, res, next) => {
    if (!req.session.user) {
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
    if (req.session.user?.Rol.descripcion !== SD.ROLES.ADMIN) {
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
    if (req.session.user?.Rol.descripcion !== SD.ROLES.EMPLOYEE &&
        req.session.user?.Rol.descripcion !== SD.ROLES.ADMIN) {
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
    if (req.session.user?.Rol.descripcion !== SD.ROLES.CLIENT &&
      req.session.user?.Rol.descripcion !== SD.ROLES.ADMIN) {
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
