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
exports.deleteInteraccion = exports.updateInteraccion = exports.getInteractionsByOpportunityId = exports.getaInteraction = exports.getInteraction = exports.createInteraction = void 0;
const interactions_model_1 = __importDefault(require("../models/interactions.model"));
const oportunity_model_1 = __importDefault(require("../models/oportunity.model"));
const user_model_1 = __importDefault(require("../models/user.model"));
const state_enum_1 = require("../core/enum/state.enum");
const roles_enum_1 = require("../core/enum/roles.enum");
// aca va la logica de la data - crear, actualizar, etc.
const createInteraction = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { body } = req;
    const userId = req._id;
    try {
        const { refOportunity } = req.body;
        // verificar el Usuario
        const usuario = yield user_model_1.default.findById(userId);
        if (!usuario) {
            return res.status(401).json({
                ok: false,
                msg: "El usuario no existe",
            });
        }
        if (usuario.rol === roles_enum_1.ROLES.CLIENTE) {
            return res.status(401).json({
                ok: false,
                msg: "El usuario no tiene permiso para crear una interaccion",
            });
        }
        // verificar el ref oportunidad y si esta tiene gestor asignado
        const oportunidad = yield oportunity_model_1.default.findById(refOportunity);
        if (!oportunidad) {
            return res.status(401).json({
                ok: false,
                msg: "La referencia de la oportunidad no es valida",
            });
        }
        if (oportunidad.stateOportunity === state_enum_1.STATE.NOGESTOR) {
            return res.status(401).json({
                ok: false,
                msg: "La referencia de la oportunidad no no tiene un gestor asignado",
            });
        }
        // verificar el si el estado de la oportunidad es finalizado
        if (oportunidad.stateOportunity === "Finalizada") {
            return res.status(401).json({
                ok: false,
                msg: "No puedes crear una interacción a una oportunidad finalizada",
            });
        }
        const interaccionNuevo = new interactions_model_1.default(Object.assign({ userCreate: userId }, body));
        const interaccionCreado = yield interaccionNuevo.save();
        res.status(200).json({
            ok: true,
            msg: "Interaccion registrada",
            interacción: interaccionCreado,
        });
    }
    catch (error) {
        console.log(error);
        res.status(400).json({
            ok: false,
            msg: "Error al crear la interaccion",
        });
    }
});
exports.createInteraction = createInteraction;
const getInteraction = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // devuelve todo el listado de productos con la información que el usuario creó
        const interaccion = yield interactions_model_1.default.find().populate({
            path: "refOportunity",
            select: "nameOportunity descriptionOportunity userGestor",
            populate: {
                path: "userGestor",
                select: "nombre",
            },
        });
        res.json({
            ok: true,
            interaccion,
        });
    }
    catch (error) {
        res.json({
            ok: false,
            error,
        });
    }
});
exports.getInteraction = getInteraction;
const getaInteraction = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        console.log(id);
        // El busca un usuario por id
        const comentario = yield interactions_model_1.default.findById({ _id: id }).populate({
            path: "refOportunity",
            select: "nameOportunity descriptionOportunity userGestor",
            populate: {
                path: "userGestor",
                select: "nombre",
            },
        });
        res.json({
            ok: true,
            comentario,
        });
    }
    catch (err) {
        res.status(500).json({
            ok: false,
            msg: "Error consultar los comentarios",
        });
    }
});
exports.getaInteraction = getaInteraction;
const getInteractionsByOpportunityId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const opportunityId = req.params.id;
        const interactions = yield interactions_model_1.default.find({ refOportunity: opportunityId })
            .populate({
            path: 'refOportunity',
            select: 'nameOportunity userGestor',
            populate: {
                path: 'userGestor',
                select: 'nombre',
            }
        });
        res.json({
            ok: true,
            interactions,
        });
    }
    catch (error) {
        res.status(500).json({
            ok: false,
            error,
        });
    }
});
exports.getInteractionsByOpportunityId = getInteractionsByOpportunityId;
const updateInteraccion = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //
    try {
        // id del usuario
        const id = req.params.id;
        const { body } = req;
        // El update del usuario - Actualizar el usuario
        const interaccionActualizado = yield interactions_model_1.default.findByIdAndUpdate(id, Object.assign(Object.assign({}, body), { updateAt: new Date() }), {
            new: true,
        });
        res.json({
            ok: true,
            interaccion: interaccionActualizado,
        });
    }
    catch (err) {
        res.status(400).json({
            ok: false,
            msg: "Error al actualizar la interaccion",
        });
    }
});
exports.updateInteraccion = updateInteraccion;
const deleteInteraccion = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // id del usuario
        const id = req.params.id;
        const { body } = req;
        // la eliminacion del usuario
        const interaccionEliminada = yield interactions_model_1.default.findByIdAndDelete(id);
        res.json({
            ok: true,
            interaccion: interaccionEliminada,
        });
    }
    catch (err) {
        res.status(400).json({
            ok: false,
            msg: "Error al eliminar la interaccion",
        });
    }
});
exports.deleteInteraccion = deleteInteraccion;
//# sourceMappingURL=interactions.controller.js.map