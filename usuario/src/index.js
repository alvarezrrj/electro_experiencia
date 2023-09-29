"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
const client_1 = require("@prisma/client");
const error_handler_1 = require("./middleware/error-handler");
const auth_middleware_1 = require("./middleware/auth-middleware");
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const MemoryStore = require('memorystore')(session);
const passport = require('passport');
const userRouter = require('./routes/user-routes');
const repairRouter = require('./routes/repair-routes');
const receptionRouter = require('./routes/reception-routes');
const authRouter = require('./routes/auth-routes');
require('dotenv').config();
const port = process.env.port || 4200;
const app = express();
app.use(bodyParser.json());
app.set('query parser', 'extended');
exports.prisma = new client_1.PrismaClient();
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.APP_SECRET,
    store: new MemoryStore({
        checkPeriod: 86400000
    }),
}));
passport.use(auth_middleware_1.localStrategy);
passport.serializeUser(auth_middleware_1.serializer);
passport.deserializeUser(auth_middleware_1.deserializer);
app.use(passport.session());
app.use((req, res, next) => { console.log('USER: ', req.user); next(); });
app.use('/', userRouter);
app.use('/', repairRouter);
app.use('/', receptionRouter);
app.use('/', authRouter);
app.use(error_handler_1.errorHandler);
app.listen(port, () => console.log('Server listening on port ' + port));
//# sourceMappingURL=index.js.map