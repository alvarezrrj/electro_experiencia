"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SD = exports.CustomError = void 0;
class CustomError extends Error {
}
exports.CustomError = CustomError;
class SD {
    static ROLES = {
        ADMIN: 'admin',
        CLIENT: 'client',
        EMPLOYEE: 'employee',
    };
}
exports.SD = SD;
//# sourceMappingURL=interfaces.js.map