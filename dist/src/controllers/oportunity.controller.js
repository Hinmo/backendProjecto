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
exports.getAnOportuniy = exports.getOportunity = exports.getSinGestorOportuniy = exports.deleteOportunity = exports.updateOportunity = exports.addGestorOportunity = exports.createOportunity = void 0;
const oportunity_model_1 = __importDefault(require("../models/oportunity.model"));
const user_model_1 = __importDefault(require("../models/user.model"));
const config_1 = require("../config/config");
const state_enum_1 = require("../core/enum/state.enum");
const roles_enum_1 = require("../core/enum/roles.enum");
const interactions_model_1 = __importDefault(require("../models/interactions.model"));
const mail_1 = require("../helpers/mail");
const createOportunity = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { body } = req;
        const userId = req._id;
        const gestorId = body.userGestor;
        const usuario = yield user_model_1.default.findById(userId);
        if (!usuario) {
            return res.status(401).json({
                ok: false,
                msg: "El usuario no existe",
            });
        }
        let userEspecifico = ""; // ID del usuario específico
        let estadoOportunidad = gestorId ? state_enum_1.STATE.PROCESO : state_enum_1.STATE.NOGESTOR;
        // Eliminar el campo userCreate si llega como una cadena vacía
        if (body.userCreate === "") {
            delete body.userCreate;
        }
        if (usuario.rol === roles_enum_1.ROLES.CLIENTE || usuario.rol === roles_enum_1.ROLES.ASESOR) {
            userEspecifico = usuario.rol === roles_enum_1.ROLES.CLIENTE ? userId : body.userCliente;
            estadoOportunidad = state_enum_1.STATE.NOGESTOR;
            delete body.userGestor;
        }
        else {
            if (!body.userCliente) {
                return res.status(401).json({
                    ok: false,
                    msg: "Se debe especificar el usuario a quien se le asigna la oportunidad",
                });
            }
            if (gestorId) {
                const gestor = yield user_model_1.default.findById(gestorId);
                if (!gestor || ![roles_enum_1.ROLES.GERENTE, roles_enum_1.ROLES.ASESOR, roles_enum_1.ROLES.SUPERVISOR].includes(gestor.rol)) {
                    return res.status(401).json({
                        ok: false,
                        msg: "El gestor no existe o no tiene el rol adecuado",
                    });
                }
            }
            if (!gestorId) {
                delete body.userGestor;
            }
            else {
                estadoOportunidad = state_enum_1.STATE.PROCESO;
            }
            userEspecifico = body.userCliente;
        }
        // Contar las oportunidades existentes asignadas al usuario (excepto las oportunidades con estado "Finalizado")
        const oportunidadesAsignadas = yield oportunity_model_1.default.countDocuments({
            userCliente: userEspecifico,
            stateOportunity: { $ne: state_enum_1.STATE.FINALIZADA },
        });
        const maximoOportunidades = usuario.rol === roles_enum_1.ROLES.CLIENTE ? config_1.maximoOportunidadesUser : config_1.maximoOportunidadesAdmin;
        if (oportunidadesAsignadas >= maximoOportunidades) {
            return res.status(400).json({
                ok: false,
                msg: "Se ha alcanzado el límite de oportunidades asignadas para este usuario",
            });
        }
        const oportunidadNueva = new oportunity_model_1.default(Object.assign({ userCreate: userId, stateOportunity: estadoOportunidad }, body));
        const oportunidadCreada = yield oportunidadNueva.save();
        // Actualizar el estado de la oportunidad si es necesario
        if (gestorId && oportunidadCreada.stateOportunity !== state_enum_1.STATE.PROCESO) {
            oportunidadCreada.stateOportunity = state_enum_1.STATE.PROCESO;
            yield oportunidadCreada.save();
        }
        yield (0, mail_1.sendMail)(oportunidadCreada.nameOportunity);
        res.status(200).json({
            ok: true,
            msg: "Oportunidad registrada",
            oportunidad: oportunidadCreada,
        });
    }
    catch (error) {
        console.log(error);
        res.status(400).json({
            ok: false,
            error,
            msg: "Error al crear la oportunidad",
        });
    }
});
exports.createOportunity = createOportunity;
const addGestorOportunity = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // id del usuario
        const id = req.params.id;
        const { body } = req;
        const gestor = yield user_model_1.default.findById(body.userGestor);
        if (!gestor) {
            return res.status(401).json({
                ok: false,
                msg: "El gestor no existe o no ha sido asignado",
            });
        }
        // se valida que el rol de id indicado sea el correspondiente a Gerente, Asesor o Supervisor
        if (gestor.rol === (roles_enum_1.ROLES.CLIENTE || roles_enum_1.ROLES.SUPERVISOR)) {
            return res.status(401).json({
                ok: false,
                msg: "El id inidicado no tiene el rol adecuado",
            });
        }
        // El update del usuario - Actualizar el usuario
        const oportunidadActualizada = yield oportunity_model_1.default.findByIdAndUpdate(id, {
            userGestor: body.userGestor,
            stateOportunity: state_enum_1.STATE.PROCESO,
            updateAt: new Date(),
        }, {
            new: true,
        });
        res.json({
            ok: true,
            oportunidad: oportunidadActualizada,
        });
    }
    catch (err) {
        res.status(400).json({
            ok: false,
            msg: "Error al actualizar las oportunidades",
        });
    }
});
exports.addGestorOportunity = addGestorOportunity;
const updateOportunity = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // id del usuario
        const id = req.params.id;
        const { body } = req;
        // El update del usuario - Actualizar el usuario
        const oportunidadActualizada = yield oportunity_model_1.default.findByIdAndUpdate(id, Object.assign(Object.assign({}, body), { updateAt: new Date() }), {
            new: true,
        });
        res.json({
            ok: true,
            oportunidad: oportunidadActualizada,
        });
    }
    catch (err) {
        res.status(400).json({
            ok: false,
            msg: "Error al actualizar las oportunidades",
        });
    }
});
exports.updateOportunity = updateOportunity;
const deleteOportunity = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // id del usuario
        const id = req.params.id;
        const { body } = req;
        // la eliminacion del usuario
        const oportunidadEliminada = yield oportunity_model_1.default.findByIdAndDelete(id);
        //eliminar las interacciones relacionadas a la oportunidad q se elimina
        const interaccionesEliminadas = yield interactions_model_1.default.find({
            refOportunity: id,
        });
        // Eliminar las interacciones encontradas
        yield interactions_model_1.default.deleteMany({
            refOportunity: id,
        });
        // Verificar si se eliminaron todas las interacciones relacionadas
        if (interaccionesEliminadas.length === 0) {
            console.log("No se encontraron interacciones relacionadas para eliminar");
        }
        else {
            console.log(`Se eliminaron ${interaccionesEliminadas.length} interacciones relacionadas`);
        }
        res.json({
            ok: true,
            oportunidad: oportunidadEliminada,
            interacciones: interaccionesEliminadas,
        });
    }
    catch (err) {
        res.status(400).json({
            ok: false,
            msg: "Error al eliminar las oportunidades y sus interacciones",
        });
    }
});
exports.deleteOportunity = deleteOportunity;
const getSinGestorOportuniy = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // El busca un usuario por id
        const oportunidad = yield oportunity_model_1.default.find({
            stateOportunity: state_enum_1.STATE.NOGESTOR,
        })
            .populate("userCreate", "nombre")
            .populate("userGestor", "nombre")
            .populate("userCliente", "nombre");
        res.json({
            ok: true,
            oportunidad,
        });
    }
    catch (err) {
        res.status(500).json({
            ok: false,
            msg: "Error consultar las oportunidades",
        });
    }
});
exports.getSinGestorOportuniy = getSinGestorOportuniy;
const getOportunity = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // devuelve todo el listado de productos con la información que el usuario creó
        const oportunidad = yield oportunity_model_1.default.find()
            .populate("userCreate", "nombre")
            .populate("userGestor", "nombre")
            .populate("userCliente", "nombre");
        /* for (const opor of oportunidad) {
          const interacciones = await OportunityModel.find({
            refOportunity: opor._id,
          })
          oportunidad(interacciones.length)
        } */
        //TODO: pendiente enviar la cantidad de interacciones que esta tenga
        res.json({
            ok: true,
            oportunidad,
        });
    }
    catch (error) {
        res.json({
            ok: false,
            error,
        });
    }
});
exports.getOportunity = getOportunity;
const getAnOportuniy = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        // El busca un usuario por id
        const oportunidad = yield oportunity_model_1.default.findById({ _id: id })
            .populate("userCreate", "nombre")
            .populate("userGestor", "nombre")
            .populate("userCliente", "nombre");
        res.json({
            ok: true,
            oportunidad,
        });
    }
    catch (err) {
        res.status(500).json({
            ok: false,
            msg: "Error consultar las oportunidades",
        });
    }
});
exports.getAnOportuniy = getAnOportuniy;
//# sourceMappingURL=oportunity.controller.js.map