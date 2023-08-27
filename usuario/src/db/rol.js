"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findRol = exports.createRol = void 0;
const __1 = require("..");
async function createRol(descripcion) {
    return await __1.prisma.rol.create({
        data: {
            descripcion: descripcion.trim().toLowerCase()
        }
    });
}
exports.createRol = createRol;
async function findRol(descripcion) {
    return await __1.prisma.rol.findFirst({
        where: {
            descripcion
        }
    });
}
exports.findRol = findRol;
//# sourceMappingURL=rol.js.map