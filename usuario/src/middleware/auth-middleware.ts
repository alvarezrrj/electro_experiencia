import { Handler } from "express";
import { prisma } from "..";
import { Auth } from "../controllers/auth";
import passport from "passport";
import { Usuario } from "@prisma/client";
const LocalStrategy = require("passport-local");

export const requiresAuth: Handler = (req, res, next) => {
  if (!req.session.user) {
    res.status(401).json({
      message: "No autorizado",
    });
  }
};

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

        //@ts-ignore
        if (!user) return done(null, false, {message: 'Hola'});

        if (user.password !== Auth.hashPassword(password)) return done(null, false);

        return done(null, user);
    } catch (e) {
        done(e);
    }
    //   req.session.user = user;
  }
);

export const serializer= (user: Usuario, done: passport.DoneCallback) => {
    return done(null, user.id);
}

export const deserializer = async (id: number, done: passport.DoneCallback) => {
    process.nextTick(async () => {
        try {
            let user = await prisma.usuario.findUnique({
                where: { id },
            });

            return done(null, user);
        } catch (e) {
            done(e);
        }
    })
}
