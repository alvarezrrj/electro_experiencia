import { Handler, RequestParamHandler } from "express";
import { prisma } from "..";
import { AppointmentRequest, CustomError } from "../interfaces/interfaces";
import { Turno } from "@prisma/client";

export class Appointment {
  static index: Handler = async (req, res, next) => {
    try {
      let appointments = await prisma.turno.findMany();
      res.json(appointments);
    } catch (e) {
      next(e);
    } finally {
      prisma.$disconnect();
    }
  };

  static show: Handler = async (req: AppointmentRequest, res, next) => {
    prisma.$disconnect();
    if (!req.appointments) return next(new Error());
    res.json(req.appointments);
  };

  static create: Handler = async (req, res, next) => {
    let data: Omit<Turno, "id" | "createdAt" | "updatedAt"> = req.body;

    try {
      let appointment = await prisma.turno.create({
        data,
      });
      res.json(appointment);
    } catch (e) {
      next(e);
    } finally {
      prisma.$disconnect();
    }
  }

  static update: Handler = async (req: AppointmentRequest, res, next) => {
    if (! req.appointments) return;

    let old = req.appointments[0];
    let data: Omit<Turno, "id" | "createdAt" | "updatedAt"> = req.body;

    try {
      let appointment = await prisma.turno.update({
        where: {
          id: old.id,
        },
        data,
      });
      res.json(appointment);
    } catch (e) {
        next(e);
    } finally {
        prisma.$disconnect();
    }
  }

  static delete: Handler = async (req: AppointmentRequest, res, next) => {
    if (! req.appointments) return;

    let old = req.appointments[0];

    try {
      await prisma.turno.delete({
        where: {
          id: old.id,
        },
      });
      res.send();
    } catch (e) {
      next(e);
    } finally {
      prisma.$disconnect();
    }
  }
  
  static appointmentRequestHandler: RequestParamHandler = async (
    req: AppointmentRequest,
    res,
    next,
    appointmentId
  ) => {
    let appointment: Turno | null;
    let validated = parseInt(appointmentId);
    if (isNaN(validated)) {
        let err = new CustomError("turnoId debe ser int");
        err.name = "400";
        return next(err);
    }
    try {
        appointment = await prisma.turno.findUnique({
            where: {
                id: validated,
            },
        });
    } catch (e) {
        return next(e);
    }
    if (!appointment) {
        let err = new CustomError("Turno no encontrado");
        err.name = "404";
        return next(err);
    }
    req.appointments = [appointment];
    next();
  }
}

