"use strict";
// esta ruta toma el path de cliente (Path: /api/v1/cliente)
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const validate_fields_1 = require("../middlewares/validate-fields");
const validate_jwt_1 = __importDefault(require("../middlewares/validate-jwt"));
const community_controller_1 = require("../controllers/community.controller");
const router = (0, express_1.Router)();
// post permite crear, put permite actualizar, get permite traer el dato, delete permite borrar
router.post("/", validate_jwt_1.default, [(0, express_validator_1.check)("idNew", "El rol es obligatorio").not().isEmpty(), validate_fields_1.validateFields], community_controller_1.createService);
exports.default = router;
//# sourceMappingURL=community.route.js.map