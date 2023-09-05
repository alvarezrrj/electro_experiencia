"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
const express = require('express');
const bodyParser = require('body-parser');
const client_1 = require("@prisma/client");
const rol_middleware_1 = require("./middleware/rol-middleware");
const user_middleware_1 = require("./middleware/user-middleware");
const user_1 = require("./controllers/user");
const rol_1 = require("./controllers/rol");
const error_handler_1 = require("./middleware/error-handler");
require('dotenv').config();
const port = process.env.port || 4200;
const app = express();
app.use(bodyParser.json());
exports.prisma = new client_1.PrismaClient();
app.post('/rol', rol_middleware_1.requiresDescription, rol_1.Rol.create);
app.param('rolId', rol_1.Rol.rolRequestHandler);
app.get("/rol", rol_1.Rol.index);
app.get('/rol/:rolId', rol_1.Rol.show);
app.post('/rol/:rolId', rol_middleware_1.requiresDescription, rol_1.Rol.update);
app.delete('/rol/:rolId', rol_1.Rol.delete);
app.post('/usuario', user_middleware_1.requiresUserFields, user_middleware_1.validateUserFields, user_1.User.create);
app.param('dni', user_1.User.userRequestHandler);
app.post('/usuario/:dni', user_middleware_1.requiresUserFields, user_1.User.update);
app.get("/usuario", user_1.User.index);
app.get('/usuario/:dni', user_1.User.show);
app.get('/rol/:rolId/usuarios', rol_1.Rol.showUsers);
app.delete('/usuario/:dni', user_1.User.delete);
app.use(error_handler_1.errorHandler);
app.listen(port, () => console.log('Server listening on port ' + port));
//# sourceMappingURL=index.js.map