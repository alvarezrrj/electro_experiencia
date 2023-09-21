"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
const client_1 = require("@prisma/client");
const interfaces_1 = require("../interfaces/interfaces");
const node_crypto_1 = require("node:crypto");
exports.prisma = new client_1.PrismaClient();
async function seed() {
    let adminRol = await exports.prisma.rol.findUnique({
        where: {
            descripcion: interfaces_1.SD.ROLES.ADMIN
        }
    });
    if (!adminRol) {
        await exports.prisma.rol.deleteMany({});
        adminRol = await exports.prisma.rol.create({
            data: {
                descripcion: interfaces_1.SD.ROLES.ADMIN
            }
        });
        await exports.prisma.rol.createMany({
            data: [
                { descripcion: interfaces_1.SD.ROLES.CLIENT },
                { descripcion: interfaces_1.SD.ROLES.EMPLOYEE },
            ]
        });
    }
    let adminExists = await exports.prisma.usuario.findFirst({
        where: {
            Rol: {
                descripcion: interfaces_1.SD.ROLES.ADMIN
            }
        }
    });
    if (!adminExists) {
        let hash = (0, node_crypto_1.createHash)("sha256");
        hash.update('admin');
        let password = hash.digest("hex");
        await exports.prisma.usuario.create({
            data: {
                id: 1,
                first_name: 'admin',
                last_name: 'admin',
                username: 'admin',
                email: 'admin@admin.com',
                password,
                gender: 'admin',
                cuit: 'admin',
                condicion_iva: 'admin',
                rol: adminRol.id_rol
            }
        });
    }
}
seed().then(() => console.log('Allisgood 👍'));
//# sourceMappingURL=seed.js.map