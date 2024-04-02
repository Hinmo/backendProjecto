"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const CommunitySchema = new mongoose_1.Schema({
    //aqui se coloca la definicion de mis datos:
    usuario: {
        type: Object,
        required: true,
    },
    oportunidad: {
        type: Object,
        required: true,
    },
    comentario: {
        type: Object,
        required: true,
    },
    idNew: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "usuario",
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
});
/* // se quita del esquema el password para que no se muestre en la data
CommunitySchema.method("toJSON", function () {
  const { usuario.password, ...object } = this.toObject();
  return object;
});
 */
const CommunityModel = (0, mongoose_1.model)("comunidades", CommunitySchema);

exports.default = CommunityModel;
//# sourceMappingURL=community.model.js.map