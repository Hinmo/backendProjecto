"use strict";
// esta ruta toma el path de user (Path: /api/v1/user)
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const validate_fields_1 = require("../middlewares/validate-fields");
const user_controller_1 = require("../controllers/user.controller");
const validate_jwt_1 = __importDefault(require("../middlewares/validate-jwt"));
const router = (0, express_1.Router)();
// post permite crear, put permite actualizar, get permite traer el dato, delete permite borrar
router.post("/", [
    (0, express_validator_1.check)("nombre", "El nombre es obligatorio").not().isEmpty(),
    (0, express_validator_1.check)("email", "El email es obligatorio").not().isEmpty().isEmail(),
    (0, express_validator_1.check)("celular", "El nombre es obligatorio").not().isEmpty(),
    (0, express_validator_1.check)("direccion", "La direccion es obligatoria").not().isEmpty(),
    (0, express_validator_1.check)("tipoDocumento", "El tipo de documento es obligatorio")
        .not()
        .isEmpty(),
    (0, express_validator_1.check)("numeroDocumento", "El numero de documento es obligatorio")
        .not()
        .isEmpty(),
    (0, express_validator_1.check)("login", "El login es obligatorio").not().isEmpty(),
    (0, express_validator_1.check)("password", "El password es obligatorio").not().isEmpty(),
    validate_fields_1.validateFields,
], user_controller_1.createUser);
router.get("/", validate_jwt_1.default, user_controller_1.getAllUsers); // se comenta la validacion por la conexion con el frontend
router.get("/usuario/:id", validate_jwt_1.default, user_controller_1.getaUserId);
/* router.get("/:rol", validateJWT, getaUserRol); */
router.get("/:rol", validate_jwt_1.default, user_controller_1.getaUserRol);
router.put("/:id", validate_jwt_1.default, user_controller_1.updateUser);
router.put("/cambiarEstado/:id", validate_jwt_1.default, user_controller_1.updateStateUser);
router.delete("/:id", validate_jwt_1.default, user_controller_1.deleteUser);
exports.default = router;
//# sourceMappingURL=user.route.js.map