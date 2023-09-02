"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const client_1 = require("@prisma/client");
const __1 = require("..");
const interfaces_1 = require("../interfaces/interfaces");
const processPrismaError = (err) => {
    switch (err.code) {
        case 'P2000':
            err.message = `Valor demasiado grande para la columna ${err.meta?.['column_name']}`;
            break;
        case 'P2003':
            err.message = 'No se puede eliminar, otras entidades dependen de esta.';
            break;
        case 'P2005':
            err.message = 'Una restrición falló en la BD: ' + err.meta?.['database_error'];
            break;
        case 'P2006':
            err.message = `El valor provisto ${err.meta?.['field_value']} para el campo ${err.meta?.['field_name']} del ${err.meta?.['model_name']} no es válido`;
            break;
        case 'P2011':
            err.message = `Null constraint violation on the ${err.meta?.constraint}`;
            break;
        case 'P2014':
            err.message = `El cambio que estás intentando hacer violaría la relación ${err.meta?.['relation_name']} entre los modelos ${err.meta?.['model_a_name']} y ${err.meta?.['model_b_name']}`;
            break;
        case 'P2019':
            err.message = `Input error: ${err.meta?.details}`;
            break;
        case 'P2020': err.message = `Valor fuera de rango. ${err.meta?.details}`;
    }
    return err.message;
};
const errorHandler = (err, req, res, next) => {
    __1.prisma.$disconnect();
    res.status(parseInt(err.name) || 500);
    if (process.env.ENVIRONMENT === 'production') {
        if (err instanceof client_1.Prisma.PrismaClientKnownRequestError && err.meta) {
            err.message = processPrismaError(err);
        }
        else if (err instanceof client_1.Prisma.PrismaClientValidationError) {
            let message = 'Error de validación de datos ';
            message += err.message.split('Argument')[1].split(' at')[0];
            err.message = message;
        }
        else if (!(err instanceof interfaces_1.CustomError)) {
            err.message = 'Database error';
        }
    }
    res.json({ error: err.message || 'Internal server error' });
};
exports.errorHandler = errorHandler;
//# sourceMappingURL=error-handler.js.map