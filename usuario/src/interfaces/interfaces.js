"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SD = exports.CustomError = void 0;
class CustomError extends Error {
}
exports.CustomError = CustomError;
class SD {
    static ROLES = {
        ADMIN: 'admin',
        CLIENT: 'cliente',
        EMPLOYEE: 'empleado',
    };
}
exports.SD = SD;
//# sourceMappingURL=interfaces.js.map