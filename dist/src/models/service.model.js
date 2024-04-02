"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const state_enum_1 = require("../core/enum/state.enum");
const ServiceSchema = new mongoose_1.Schema({
    //aqui se coloca la definicion de mis datos:
    /*oportunidad: {
      type: Object,
      required: true,
    },
    interaccion: {
      type: Object,
      required: true,
    },
    idNew: {
      type: Schema.Types.ObjectId,
      ref: "usuario",
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },*/
    refOportunity: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "oportunidades",
        required: true,
    },
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
    },
    userGestor: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "usuario",
    },
    createdAtOporunity: {
        type: Date,
    },
    updateAtOporunity: {
        type: Date,
    },
    id_interaccion: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "oportunidades",
    },
    descriptionInteraction: { type: String },
    actionInteraction: { type: String },
    userCreateInteraccion: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "usuario",
    },
});
/* // se quita del esquema el password para que no se muestre en la data
CommunitySchema.method("toJSON", function () {
  const { usuario.password, ...object } = this.toObject();
  return object;
});
 */
const ServiceModel = (0, mongoose_1.model)("services", ServiceSchema);
exports.default = ServiceModel;
//# sourceMappingURL=service.model.js.map