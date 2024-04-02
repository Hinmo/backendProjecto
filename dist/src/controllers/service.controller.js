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
exports.getService = exports.createService = void 0;
const interactions_model_1 = __importDefault(require("../models/interactions.model"));
const service_model_1 = __importDefault(require("../models/service.model"));
const user_model_1 = __importDefault(require("../models/user.model"));
const oportunity_model_1 = __importDefault(require("../models/oportunity.model"));
// aca va la logica de la data - crear, actualizar, etc.
const createService = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { body } = req;
    const userId = req._id;
    try {
        // Validar si el usuario que va a crear la comunidad se encuentra en la data
        const usuario = yield user_model_1.default.findById(userId);
        if (!usuario) {
            return res.status(404).json({
                ok: false,
                msg: "Usuario no encontrado",
            });
        }
        let servicioCreado = {};
        const oportunidadesConInteracciones = [];
        // Obtener los datos completos del oportunidades
        const oportunidades = yield oportunity_model_1.default.find();
        if (!oportunidades) {
            return res.status(404).json({
                ok: false,
                msg: "Oportunidades no encontradas",
            });
        }
        //Por cada opotunidad se busca sus respectivas interacciones
        for (const oportunidad of oportunidades) {
            // Validar si ya existe en la data de servicio ya existe la oportunidad
            const validacion = yield service_model_1.default.findOne({
                refOportunity: oportunidad._id,
            });
            if (validacion) {
                // Validar si ya existe en la data de servicio ya existe la interaccion de la oportunidad
                const interaccionesRelacionadas = yield interactions_model_1.default.find({
                    refOportunity: oportunidad._id,
                });
                for (const interaccion of interaccionesRelacionadas) {
                    const validacionInteracciones = yield service_model_1.default.findOne({
                        id_interaccion: interaccion._id,
                    });
                    if (!validacionInteracciones) {
                        const comunidadNueva = new service_model_1.default({
                            refOportunity: oportunidad._id,
                            nameOportunity: oportunidad.nameOportunity,
                            descriptionOportunity: oportunidad.descriptionOportunity,
                            stateOportunity: oportunidad.stateOportunity,
                            userCliente: oportunidad.userCliente,
                            userCreate: oportunidad.userCreate,
                            userGestor: oportunidad.userGestor,
                            createdAtOporunity: oportunidad.createdAt,
                            updateAtOporunity: oportunidad.updateAt,
                            id_interaccion: interaccion._id,
                            descriptionInteraction: interaccion.descriptionInteraction,
                            actionInteraction: interaccion.actionInteraction,
                            userCreateInteraccion: interaccion.userCreate,
                        });
                        servicioCreado = yield comunidadNueva.save();
                        oportunidadesConInteracciones.push(comunidadNueva);
                    }
                }
                /* return res.status(401).json({
                  ok: false,
                  msg: "ya existe este usuario, actualiza la data",
                }); */
            }
            else {
                // Obtener las interacciones relacionadas con la oportunidad actual
                const interaccionesRelacionadas = yield interactions_model_1.default.find({
                    refOportunity: oportunidad._id,
                });
                if (interaccionesRelacionadas.length === 0) {
                    const comunidadNueva = new service_model_1.default({
                        refOportunity: oportunidad._id,
                        nameOportunity: oportunidad.nameOportunity,
                        descriptionOportunity: oportunidad.descriptionOportunity,
                        stateOportunity: oportunidad.stateOportunity,
                        userCliente: oportunidad.userCliente,
                        userCreate: oportunidad.userCreate,
                        userGestor: oportunidad.userGestor,
                        createdAtOporunity: oportunidad.createdAt,
                        updateAtOporunity: oportunidad.updateAt,
                        descriptionInteraction: "No tiene interacciones asignadas",
                        actionInteraction: "No tiene interacciones asignadas",
                    });
                    servicioCreado = yield comunidadNueva.save();
                    oportunidadesConInteracciones.push(comunidadNueva);
                }
                for (const interaccion of interaccionesRelacionadas) {
                    // Creamos el comentario con los datos del usuario incrustados
                    const comunidadNueva = new service_model_1.default({
                        refOportunity: oportunidad._id,
                        nameOportunity: oportunidad.nameOportunity,
                        descriptionOportunity: oportunidad.descriptionOportunity,
                        stateOportunity: oportunidad.stateOportunity,
                        userCliente: oportunidad.userCliente,
                        userCreate: oportunidad.userCreate,
                        userGestor: oportunidad.userGestor,
                        createdAtOporunity: oportunidad.createdAt,
                        updateAtOporunity: oportunidad.updateAt,
                        id_interaccion: interaccion._id,
                        descriptionInteraction: interaccion.descriptionInteraction,
                        actionInteraction: interaccion.actionInteraction,
                        userCreateInteraccion: interaccion.userCreate,
                    });
                    servicioCreado = yield comunidadNueva.save();
                    oportunidadesConInteracciones.push(comunidadNueva);
                }
            }
        }
        if (oportunidadesConInteracciones.length === 0) {
            return res.status(401).json({
                ok: false,
                msg: "no se registro un nuevo servicio",
            });
        }
        res.status(200).json({
            ok: true,
            msg: "servicio registrada",
            comunidad: oportunidadesConInteracciones,
        });
    }
    catch (error) {
        console.log(error);
        res.status(400).json({
            ok: false,
            msg: "Error al crear el servicio",
        });
    }
});
exports.createService = createService;
const getService = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // devuelve todo el listado de productos con la información que el usuario creó
        const servicio = yield service_model_1.default.find()
            .populate("userCreate", "nombre")
            .populate("userGestor", "nombre")
            .populate("userCliente", "nombre")
            .populate("userCreateInteraccion", "nombre");
        res.json({
            ok: true,
            servicio,
        });
    }
    catch (error) {
        res.json({
            ok: false,
            error,
        });
    }
});
exports.getService = getService;
//# sourceMappingURL=service.controller.js.map