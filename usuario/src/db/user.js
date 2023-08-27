"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findUser = exports.createUser = void 0;
const __1 = require("..");
async function createUser(user) {
    return await __1.prisma.usuario.create({
        data: user
    });
}
exports.createUser = createUser;
async function findUser(dni) {
    return await __1.prisma.usuario.findFirst({
        where: {
            dni
        }
    });
}
exports.findUser = findUser;
//# sourceMappingURL=user.js.map