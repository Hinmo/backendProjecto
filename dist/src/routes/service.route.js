"use strict";
// esta ruta toma el path de cliente (Path: /api/v1/cliente)
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const validate_jwt_1 = __importDefault(require("../middlewares/validate-jwt"));
const service_controller_1 = require("../controllers/service.controller");
const router = (0, express_1.Router)();
// post permite crear, put permite actualizar, get permite traer el dato, delete permite borrar
router.post("/", validate_jwt_1.default, 
/* [check("idNew", "El rol es obligatorio").not().isEmpty(), validateFields], */
service_controller_1.createService);
router.get("/", validate_jwt_1.default, service_controller_1.getService);
exports.default = router;
//# sourceMappingURL=service.route.js.map