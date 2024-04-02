"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const roles_enum_1 = require("../core/enum/roles.enum");
const UserSchema = new mongoose_1.Schema({
    //definicion de la data de usuarios:
    nombre: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    celular: {
        type: Number,
        required: true,
    },
    direccion: {
        type: String,
        required: true,
    },
    tipoDocumento: {
        type: String,
        required: true,
    },
    numeroDocumento: {
        type: String,
        required: true,
        unique: true,
    },
    login: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    rol: {
        type: String,
        enum: Object.values(roles_enum_1.ROLES),
        required: true,
        default: roles_enum_1.ROLES.CLIENTE,
    },
    estado: {
        type: Boolean,
        required: true,
        default: true,
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
// se quita del esquema el password para que no se muestre al imprimir la data
UserSchema.method("toJSON", function () {
    const _a = this.toObject(), { password } = _a, object = __rest(_a, ["password"]);
    return object;
});
const UserModel = (0, mongoose_1.model)("usuario", UserSchema);
exports.default = UserModel;
//# sourceMappingURL=user.model.js.map