"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const connection_1 = require("./database/connection");
const user_route_1 = __importDefault(require("./routes/user.route"));
const auth_route_1 = __importDefault(require("./routes/auth.route"));
const interaction_route_1 = __importDefault(require("./routes/interaction.route"));
const oportunity_route_1 = __importDefault(require("./routes/oportunity.route"));
const service_route_1 = __importDefault(require("./routes/service.route"));
const cors_1 = __importDefault(require("cors"));
class Server {
    constructor() {
        this.apiPaths = {
            user: "/api/v1/usuarioM",
            auth: "/api/v1/auth",
            interaction: "/api/v1/interaccion",
            oportunity: "/api/v1/oportunidad",
            service: "/api/v1/service",
        };
        this.app = (0, express_1.default)();
        this.port = process.env.PORT || "3000";
        // Base de datos
        (0, connection_1.dbConnection)();
        // Métodos Iniciales
        this.middlewares();
        // Rutas
        this.routes();
    }
    miPrimeraApi() {
        this.app.get("/", (req, res) => res.status(200).json({ msg: "Information" }));
    }
    middlewares() {
        this.app.use((0, cors_1.default)()); // para el intercambio de recursos, permisos para poder consumir mi API
        // Lectura del Body - conviente lo que se vaya a enviar a formato json
        this.app.use(express_1.default.json());
        this.miPrimeraApi();
    }
    routes() {
        this.app.use(this.apiPaths.user, user_route_1.default);
        this.app.use(this.apiPaths.auth, auth_route_1.default);
        this.app.use(this.apiPaths.interaction, interaction_route_1.default);
        this.app.use(this.apiPaths.oportunity, oportunity_route_1.default);
        this.app.use(this.apiPaths.service, service_route_1.default);
    }
    listen() {
        this.app.listen(this.port, () => {
            console.log("Servidor corriendo en el puerto", this.port);
        });
    }
}
exports.default = Server;
//# sourceMappingURL=server.js.map