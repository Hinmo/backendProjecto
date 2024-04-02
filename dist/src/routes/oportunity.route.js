"use strict";
// esta ruta toma el path de cliente (Path: /api/v1/oporunity)
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const validate_fields_1 = require("../middlewares/validate-fields");
const validate_jwt_1 = __importDefault(require("../middlewares/validate-jwt"));
const oportunity_controller_1 = require("../controllers/oportunity.controller");
const router = (0, express_1.Router)();
// post permite crear, put permite actualizar, get permite traer el dato, delete permite borrar
router.post("/", validate_jwt_1.default, [
    (0, express_validator_1.check)("nameOportunity", "El nombre es obligatorio").not().isEmpty(),
    (0, express_validator_1.check)("descriptionOportunity", "La descripción es obligatoria")
        .not()
        .isEmpty(),
    validate_fields_1.validateFields,
], oportunity_controller_1.createOportunity);
router.get("/", validate_jwt_1.default, oportunity_controller_1.getOportunity);
router.get("/sin-gestor", validate_jwt_1.default, oportunity_controller_1.getSinGestorOportuniy);
router.get("/:id", validate_jwt_1.default, oportunity_controller_1.getAnOportuniy);
router.put("/asignar/:id", validate_jwt_1.default, oportunity_controller_1.addGestorOportunity);
router.put("/:id", validate_jwt_1.default, oportunity_controller_1.updateOportunity);
router.delete("/:id", validate_jwt_1.default, oportunity_controller_1.deleteOportunity);
exports.default = router;
//# sourceMappingURL=oportunity.route.js.map