"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const ProductSchema = new mongoose_1.Schema({
    //aqui se coloca la definicion de mis datos:
    nombre: {
        type: String,
        required: true,
    },
    descripcion: {
        type: String,
        required: false,
    },
    precio: {
        type: Number,
        required: true,
    },
    categoria: {
        type: String,
        required: true,
    },
    stock: {
        type: Number,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
    peso: {
        type: String,
        required: true,
    },
    ip: {
        type: String,
        required: false,
    },
    estado: {
        type: Boolean,
        required: true,
        default: true,
    },
    caracteristicas: {
        type: Object,
        required: true,
    },
    programasInstalados: {
        type: Object,
        required: true,
    },
    distribuidor: {
        type: Object,
        required: true,
    },
    opiniones: {
        type: Object,
        required: true,
    },
    usuario: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "usuario",
        required: true,
    },
});
const ProductoModel = (0, mongoose_1.model)("producto", ProductSchema);
exports.default = ProductoModel;
//# sourceMappingURL=product.model.js.map