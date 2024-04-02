"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const state_enum_1 = require("../core/enum/state.enum");
const OporunitySchema = new mongoose_1.Schema({
    //aqui se coloca la definicion de mis datos:
    nameOportunity: { type: String, required: true },
    descriptionOportunity: { type: String, required: true },
    stateOportunity: {
        type: String,
        enum: Object.values(state_enum_1.STATE),
        required: true,
    },
    userCliente: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "usuario",
    },
    userCreate: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "usuario",
        required: true,
    },
    userGestor: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "usuario",
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
    updateAt: {
        type: Date,
        default: Date.now(),
    },
});
const OportunityModel = (0, mongoose_1.model)("oportunidades", OporunitySchema);
exports.default = OportunityModel;
//# sourceMappingURL=oportunity.model.js.map