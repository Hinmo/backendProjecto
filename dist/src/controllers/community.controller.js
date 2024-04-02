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
exports.createService = void 0;
const interactions_model_1 = __importDefault(require("../models/interactions.model"));
const service_model_1 = __importDefault(require("../models/service.model"));
const user_model_1 = __importDefault(require("../models/user.model"));
const oportunity_model_1 = __importDefault(require("../models/oportunity.model"));
// aca va la logica de la data - crear, actualizar, etc.
const createService = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { body } = req;
    const userId = req._id;
    try {
        const { idNew } = req.body;
        // Validar si el usuario que va a crear la comunidad se encuentra en la data
        const usuario = yield user_model_1.default.findById(userId);
        if (!usuario) {
            return res.status(404).json({
                ok: false,
                msg: "Usuario no encontrado",
            });
        }
        // Validar que si ya existe en la data de comunidad el usuario a agregar
        // verificar el Usuario
        const comunidad = yield service_model_1.default.findById(idNew);
        if (comunidad) {
            return res.status(401).json({
                ok: false,
                msg: "ya existe este usuario, actualiza la data",
            });
        }
        // Obtener los datos completos del oportunidades
        const oportunidad = yield oportunity_model_1.default.findOne({ userCreate: userId });
        if (!oportunidad) {
            return res.status(404).json({
                ok: false,
                msg: "Oportunidad no encontrado",
            });
        }
        // Obtener los datos completos del comentarios
        const comentario = yield interactions_model_1.default.findOne({ userCreate: userId });
        if (!comentario) {
            return res.status(404).json({
                ok: false,
                msg: "Comentario no encontrado",
            });
        }
        // Convertir la data a un objeto JS y eliminar los campos no deseados
        const usuarioObj = usuario.toObject();
        delete usuarioObj.password;
        const oportunidadObj = oportunidad.toObject();
        delete oportunidadObj.usuario;
        const comentarioObj = comentario.toObject();
        delete comentarioObj.usuario;
        // Creamos el comentario con los datos del usuario incrustados
        const comunidadNueva = new service_model_1.default(Object.assign({ usuario: usuarioObj, oportunidad: oportunidadObj, comentario: comentarioObj }, body));
        const comunidadCreada = yield comunidadNueva.save();
        res.status(200).json({
            ok: true,
            msg: "Comunidad registrada",
            comunidad: comunidadCreada,
        });
    }
    catch (error) {
        console.log(error);
        res.status(400).json({
            ok: false,
            msg: "Error al crear la comunidad",
        });
    }
});
exports.createService = createService;
//# sourceMappingURL=community.controller.js.map