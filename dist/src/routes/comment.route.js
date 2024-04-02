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
const comments_controller_1 = require("../controllers/comments.controller");
const router = (0, express_1.Router)();
// post permite crear, put permite actualizar, get permite traer el dato, delete permite borrar
router.post("/", validate_jwt_1.default, [
    (0, express_validator_1.check)("refComment", "La referencia es obligatoria").not().isEmpty(),
    (0, express_validator_1.check)("descriptionComment", "La descripción es obligatoria")
        .not()
        .isEmpty(),
    (0, express_validator_1.check)("actionComment", "La acción es obligatoria").not().isEmpty(),
    validate_fields_1.validateFields,
], comments_controller_1.createComment);
router.get("/", validate_jwt_1.default, comments_controller_1.getComment);
router.get("/:id", validate_jwt_1.default, comments_controller_1.getaComment);
router.put("/:id", validate_jwt_1.default, comments_controller_1.updateComment);
router.delete("/:id", validate_jwt_1.default, comments_controller_1.deleteComment);
exports.default = router;
//# sourceMappingURL=comment.route.js.map