import { Application } from "express";
import { PrismaClient } from "@prisma/client";
import { errorHandler } from "./middleware/error-handler";

const express = require('express');
const bodyParser = require('body-parser');
// const qs = require('qs');
const session = require('express-session');
const userRouter = require('./routes/user-routes');
const repairRouter = require('./routes/repair-routes');
const receptionRouter = require('./routes/reception-routes');

// Load environment variables
require('dotenv').config();

const port = process.env.port || 4200;
const app: Application =  express();
app.use(bodyParser.json());
app.set('query parser', 'extended');

export const prisma = new PrismaClient();

// Initialize session
app.use(session({
    resave: false, // don't save session if unmodified
    saveUninitialized: false, // don't create session until something stored
    secret: 'shhhh, very secret'
  }));

// Assign routes
app.use('/', userRouter);
app.use('/', repairRouter);
app.use('/', receptionRouter);


/**
 * Error handling
 */
app.use(errorHandler);

app.listen(port, () => console.log('Server listening on port ' + port));
