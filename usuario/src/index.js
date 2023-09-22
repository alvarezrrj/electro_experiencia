"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
const express = require('express');
const bodyParser = require('body-parser');
const qs = require('qs');
const session = require('express-session');
const client_1 = require("@prisma/client");
const rol_middleware_1 = require("./middleware/rol-middleware");
const user_middleware_1 = require("./middleware/user-middleware");
const user_1 = require("./controllers/user");
const rol_1 = require("./controllers/rol");
const error_handler_1 = require("./middleware/error-handler");
const repair_1 = require("./controllers/repair");
const reception_1 = require("./controllers/reception");
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
app.post('/rol', rol_middleware_1.requiresDescription, rol_1.Rol.create);
app.param('rolId', rol_1.Rol.rolRequestHandler);
app.get("/rol", rol_1.Rol.index);
app.get('/rol/:rolId', rol_1.Rol.show);
app.post('/rol/:rolId', rol_middleware_1.requiresDescription, rol_1.Rol.update);
app.delete('/rol/:rolId', rol_1.Rol.delete);
app.post('/usuario', user_middleware_1.validateUserFields, user_1.User.create);
app.post('/usuario/clientes', user_middleware_1.validateUserFields, user_middleware_1.extractRoleFromUrl, user_1.User.create);
app.post('/usuario/empleados', user_middleware_1.validateUserFields, user_middleware_1.extractRoleFromUrl, user_1.User.create);
app.put('/usuario', user_1.User.update);
app.get("/usuario", user_1.User.index);
app.get('/usuario/clientes', user_middleware_1.extractRoleFromUrl, user_1.User.listByRole);
app.get('/usuario/empleados', user_middleware_1.extractRoleFromUrl, user_1.User.listByRole);
app.param('dni', user_1.User.userRequestHandler);
app.get('/usuario/:dni', user_1.User.show);
app.get('/rol/:rolId/usuarios', rol_1.Rol.showUsers);
app.delete('/usuario/:dni', user_1.User.delete);
app.post('/reparacion', repair_1.Repair.create);
app.get("/reparacion", repair_1.Repair.index);
app.get('/reparacion/search', repair_1.Repair.search);
app.param('repairId', repair_1.Repair.repairRequestHandler);
app.get('/reparacion/:repairId', repair_1.Repair.show);
app.put('/reparacion/:repairId', repair_1.Repair.update);
app.delete('/reparacion/:repairId', repair_1.Repair.delete);
app.post('/recepcion', reception_1.Reception.create);
app.get('/recepcion', reception_1.Reception.index);
app.param('receptionId', reception_1.Reception.receptionRequestHandler);
app.get('/recepcion/:receptionId', reception_1.Reception.show);
app.put('/recepcion/:receptionId', reception_1.Reception.update);
app.delete('/recepcion/:receptionId', reception_1.Reception.delete);
app.use(error_handler_1.errorHandler);
app.listen(port, () => console.log('Server listening on port ' + port));
//# sourceMappingURL=index.js.map