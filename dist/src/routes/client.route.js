"use strict";
// esta ruta toma el path de cliente (Path: /api/v1/cliente)
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const clients_controller_1 = require("../controllers/clients.controller");
const express_validator_1 = require("express-validator");
const validate_fields_1 = require("../middlewares/validate-fields");
const validate_jwt_1 = __importDefault(require("../middlewares/validate-jwt"));
const router = (0, express_1.Router)();
// post permite crear, put permite actualizar, get permite traer el dato, delete permite borrar
router.post("/", 
/* validateJWT, */
[
    (0, express_validator_1.check)("nombre", "El nombre es obligatorio").not().isEmpty(),
    (0, express_validator_1.check)("direccion", "La direccion es obligatorio").not().isEmpty(),
    (0, express_validator_1.check)("telefono", "El telefono es obligatorio").not().isEmpty(),
    (0, express_validator_1.check)("email", "El email es obligatorio").not().isEmpty().isEmail(),
    (0, express_validator_1.check)("tipoDocumento", "El tipo de documento es obligatorio")
        .not()
        .isEmpty(),
    (0, express_validator_1.check)("numeroDocumento", "El numero de documento es obligatorio")
        .not()
        .isEmpty(),
    validate_fields_1.validateFields,
], clients_controller_1.createClients);
router.get("/", /* validateJWT, */ clients_controller_1.getClientes);
router.get("/:id", validate_jwt_1.default, clients_controller_1.getaClient);
router.put("/:id", validate_jwt_1.default, clients_controller_1.updateClient);
router.delete("/:id", validate_jwt_1.default, clients_controller_1.deleteClient);
router.put("/estado/:id", validate_jwt_1.default, clients_controller_1.updateStateClient);
exports.default = router;
//# sourceMappingURL=client.route.js.map