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
exports.getComment = exports.createComment = void 0;
const comments_model_1 = __importDefault(require("../models/comments.model"));
// aca va la logica de la data - crear, actualizar, etc.
const createComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { body } = req;
    const id = req._id;
    console.log("El id del usuario autenticado: ", id);
    try {
        const comentarioNuevo = new comments_model_1.default(Object.assign({ usuario: id }, body));
        const comentarioCreado = yield comentarioNuevo.save();
        res.status(200).json({
            ok: true,
            msg: "Comentario registrado",
            comentario: comentarioCreado,
        });
    }
    catch (error) {
        console.log(error);
        res.status(400).json({
            ok: false,
            msg: "Error al crear el comentario",
        });
    }
});
exports.createComment = createComment;
const getComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // devuelve todo el listado de productos con la información que el usuario creó
        const comentario = yield comments_model_1.default.find().populate({
            path: "comentario",
            select: "nombre, numeroDocumento, email",
        });
        res.json({
            ok: true,
            comentario,
        });
    }
    catch (error) {
        res.json({
            ok: false,
            error,
        });
    }
});
exports.getComment = getComment;
//# sourceMappingURL=comments.controller%20copy.js.map