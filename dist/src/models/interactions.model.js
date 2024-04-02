"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const InteractionsSchema = new mongoose_1.Schema({
    //aqui se coloca la definicion de mis datos:
    descriptionInteraction: { type: String, required: true },
    actionInteraction: { type: String, required: true },
    userCreate: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "usuario",
        required: true,
    },
    refOportunity: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "oportunidades",
        required: true,
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
const InteractionModel = (0, mongoose_1.model)("interacciones", InteractionsSchema);
exports.default = InteractionModel;
//# sourceMappingURL=interactions.model.js.map