"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
const client_1 = require("@prisma/client");
const error_handler_1 = require("./middleware/error-handler");
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const userRouter = require('./routes/user-routes');
const repairRouter = require('./routes/repair-routes');
const receptionRouter = require('./routes/reception-routes');
require('dotenv').config();
const port = process.env.port || 4200;
const app = express();
app.use(bodyParser.json());
app.set('query parser', 'extended');
exports.prisma = new client_1.PrismaClient();
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: 'shhhh, very secret'
}));
app.use('/', userRouter);
app.use('/', repairRouter);
app.use('/', receptionRouter);
app.use(error_handler_1.errorHandler);
app.listen(port, () => console.log('Server listening on port ' + port));
//# sourceMappingURL=index.js.map