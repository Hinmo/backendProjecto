"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const CommentsSchema = new mongoose_1.Schema({
    //aqui se coloca la definicion de mis datos:
    refComment: { type: String, required: true },
    descriptionComment: { type: String, required: true },
    actionComment: { type: String, required: true },
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
        ref: "usuario",
        required: true,
    },
});
const CommentModel = (0, mongoose_1.model)("comentarios", CommentsSchema);
exports.default = CommentModel;
//# sourceMappingURL=comments.model.js.map