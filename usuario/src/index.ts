import { Application } from "express";
import { PrismaClient } from "@prisma/client";
import { errorHandler } from "./middleware/error-handler";
import {
  deserializer,
  localStrategy,
  serializer,
} from "./middleware/auth-middleware";

const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const MemoryStore = require("memorystore")(session);
const passport = require("passport");
const userRouter = require("./routes/user-routes");
const repairRouter = require("./routes/repair-routes");
const receptionRouter = require("./routes/reception-routes");
const authRouter = require("./routes/auth-routes");
const materialsRouter = require("./routes/material-routes");
const presupuestosRouter = require("./routes/presupuesto-routes");
const proveedorRouter = require("./routes/proveedor-routes");

// Load environment variables
require("dotenv").config();

const port = process.env.port || 4200;
const app: Application = express();
app.use(bodyParser.json());
app.set("query parser", "extended");

export const prisma = new PrismaClient();

// Initialize session
app.use(
  session({
    resave: false,                  // don't save session if unmodified
    saveUninitialized: false,       // don't create session until something stored
    secret: process.env.APP_SECRET,
    store: new MemoryStore({
      checkPeriod: 86400000,        // prune expired entries every 24h
    }),
  })
);

// Configure Passport
passport.use(localStrategy);
passport.serializeUser(serializer);
passport.deserializeUser(deserializer);

// Deserialize user and populate req.user
app.use(passport.session());

// Assign routes
app.use("/", userRouter);
app.use("/", repairRouter);
app.use("/", receptionRouter);
app.use("/", authRouter);
app.use("/", materialsRouter);
app.use("/", presupuestosRouter);
app.use("/", proveedorRouter);

/**
 * Error handling
 */
app.use(errorHandler);

app.listen(port, () => console.log("Server listening on port " + port));
