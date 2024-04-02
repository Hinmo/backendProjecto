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
exports.updateStateClient = exports.deleteClient = exports.updateClient = exports.getaClient = exports.getClientes = exports.createClients = void 0;
const client_model_1 = __importDefault(require("../models/client.model"));
// aca va la logica de la data - crear, actualizar, etc.
const createClients = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { body } = req;
    try {
        const clienteNuevo = new client_model_1.default(body);
        const clienteCreado = yield clienteNuevo.save();
        res.status(200).json({
            ok: true,
            msg: "Usuario registrado",
            cliente: clienteCreado,
        });
    }
    catch (error) {
        console.log(error);
        res.status(400).json({
            ok: false,
            msg: "Error al crear el cliente",
        });
    }
});
exports.createClients = createClients;
const getClientes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // El busca todos los clientes
        const clientes = yield client_model_1.default.find();
        res.json({
            ok: true,
            clientes,
        });
    }
    catch (err) {
        res.status(500).json({
            ok: false,
            msg: "Error consultar los clientes",
        });
    }
});
exports.getClientes = getClientes;
const getaClient = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        console.log(id);
        // El busca todos los clientes
        const clientes = yield client_model_1.default.findById({ _id: id });
        res.json({
            ok: true,
            clientes,
        });
    }
    catch (err) {
        res.status(500).json({
            ok: false,
            msg: "Error consultar los clientes",
        });
    }
});
exports.getaClient = getaClient;
const updateClient = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // id del cliente
        const id = req.params.id;
        const body = req.body; // const {body} = req;
        console.log(id);
        // El update del cliente - Actualizar el cliente
        const clienteActualizo = yield client_model_1.default.findByIdAndUpdate(id, body, {
            new: true,
        });
        res.json({
            ok: true,
            cliente: clienteActualizo,
        });
    }
    catch (err) {
        res.status(400).json({
            ok: false,
            msg: "Error consultar los clientes",
        });
    }
});
exports.updateClient = updateClient;
const deleteClient = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // id del cliente
        const id = req.params.id;
        const body = req.body; // const {body} = req;
        console.log(id);
        // la eliminacion del cliente - Actualizar el cliente
        const clienteElimino = yield client_model_1.default.findByIdAndDelete(id);
        res.json({
            ok: true,
            cliente: clienteElimino,
        });
    }
    catch (err) {
        res.status(400).json({
            ok: false,
            msg: "Error consultar los clientes",
        });
    }
});
exports.deleteClient = deleteClient;
const updateStateClient = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // id del cliente
        const id = req.params.id;
        const body = req.body; // const {body} = req;
        console.log(body);
        // El update del cliente - Actualizar el cliente
        const clienteActualizo = yield client_model_1.default.findByIdAndUpdate(id, { estado: false }, {
            new: true,
        });
        res.json({
            ok: true,
            cliente: clienteActualizo,
        });
    }
    catch (err) {
        res.status(400).json({
            ok: false,
            msg: "Error consultar los clientes",
        });
    }
});
exports.updateStateClient = updateStateClient;
//# sourceMappingURL=clients.controller.js.map