"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateNewPassword = exports.existLogin = exports.renewToken = exports.login = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jwt_1 = __importDefault(require("../helpers/jwt"));
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { login: loginUser, password } = req.body;
    try {
        // verificar el login
        const usuario = yield user_model_1.default.findOne({ login: loginUser });
        if (!usuario) {
            return res.status(401).json({
                ok: false,
                msg: "Las credenciales no son validas",
            });
        }
        // verificar el password
        const validPassword = bcryptjs_1.default.compareSync(password, usuario.password);
        if (!validPassword) {
            return res.status(401).json({
                ok: false,
                msg: "Las credenciales no son validas",
            });
        }
        // generar token
        const token = yield (0, jwt_1.default)(usuario._id.toString(), usuario.login);
        res.status(200).json({
            ok: true,
            usuario: usuario,
            token,
        });
    }
    catch (error) {
        res.status(400).json({
            ok: false,
            error,
            msg: "Hable con el administrador",
        });
    }
});
exports.login = login;
const renewToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req._id;
    try {
        if (typeof id === "undefined") {
            throw new Error("No existe un id");
        }
        const usuario = yield user_model_1.default.findById(id);
        // Generar el Token
        const token = yield (0, jwt_1.default)(id.toString());
        res.json({
            ok: true,
            token,
            usuario,
        });
    }
    catch (error) {
        console.log(error);
        res.status(401).json({
            ok: false,
            error,
            msg: "Hable con el administrador",
        });
    }
});
exports.renewToken = renewToken;
const existLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, numeroDocumento } = req.body;
    try {
        // verificar el login
        const existEmailAndNoDocument = yield user_model_1.default.findOne({
            email,
            numeroDocumento,
        });
        if (!existEmailAndNoDocument) {
            return res.status(401).json({
                ok: false,
                msg: "Las credenciales no son validas",
            });
        }
        // generar token
        const token = yield (0, jwt_1.default)(existEmailAndNoDocument._id.toString(), existEmailAndNoDocument.login, "10m", process.env.JWT_SECRET_PASS);
        const tiempoExpiracion = 600;
        res.status(200).json({
            ok: true,
            usuario: existEmailAndNoDocument,
            token,
            tiempoExpiracion,
        });
    }
    catch (error) {
        res.status(400).json({
            ok: false,
            error,
            msg: "Hable con el administrador",
        });
    }
});
exports.existLogin = existLogin;
const updateNewPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { password } = req.body;
        const salt = bcryptjs_1.default.genSaltSync(10);
        const passwordCript = bcryptjs_1.default.hashSync(password, salt);
        if (!password) {
            return res.status(401).json({
                ok: false,
                msg: "No has ingresado una contraseña valida",
            });
        }
        const id = req._id;
        // El update del cliente - Actualizar el cliente
        const userNewPass = yield user_model_1.default.findByIdAndUpdate(id, { password: passwordCript }, {
            new: true,
        });
        res.json({
            ok: true,
            user: userNewPass,
        });
    }
    catch (err) {
        res.status(400).json({
            ok: false,
            msg: "Error consultar el user",
        });
    }
});
exports.updateNewPassword = updateNewPassword;
//# sourceMappingURL=auth.controller.js.map