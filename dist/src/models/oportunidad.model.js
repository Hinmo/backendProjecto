"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const OporunitySchema = new mongoose_1.Schema({
    //aqui se coloca la definicion de mis datos:
    nameOportunity: { type: String, required: true },
    descriptionOportunity: { type: String, required: true },
    stateOportunity: { type: Boolean, required: true },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
    updateAt: {
        type: Date,
        default: Date.now(),
    },
    usuario: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "cliente",
        required: true,
    },
});
const OportunityModel = (0, mongoose_1.model)("oportunidades", OporunitySchema);
exports.default = OportunityModel;
//# sourceMappingURL=oportunidad.model.js.map