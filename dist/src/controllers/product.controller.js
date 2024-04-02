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
exports.getProductos = exports.createProduct = void 0;
const product_model_1 = __importDefault(require("../models/product.model"));
// aca va la logica de la data - crear, actualizar, etc.
const createProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { body } = req;
    const id = req._id;
    console.log("El id del usuario autenticado: ", id);
    try {
        const productNuevo = new product_model_1.default(Object.assign({ usuario: id }, body));
        const productCreado = yield productNuevo.save();
        res.status(200).json({
            ok: true,
            msg: "Usuario registrado",
            producto: productCreado,
        });
    }
    catch (error) {
        console.log(error);
        res.status(400).json({
            ok: false,
            msg: "Error al crear el producto",
        });
    }
});
exports.createProduct = createProduct;
const getProductos = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // devuelve todo el listado de productos con la información que el usuario creó
        const productos = yield product_model_1.default.find().populate({
            path: "usuario",
            select: "nombre, numeroDocumento, email",
        });
        res.json({
            ok: true,
            productos,
        });
    }
    catch (error) {
        res.json({
            ok: false,
            error,
        });
    }
});
exports.getProductos = getProductos;
//# sourceMappingURL=product.controller.js.map