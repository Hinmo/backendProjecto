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
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMail = void 0;
const nodemailer = require("nodemailer");
// crea un transportador que conecta y hace el envio del mail
const transporter = nodemailer.createTransport({
    host: "smtp-mail.outlook.com",
    port: 587,
    secure: false, // Use `true` for port 465, `false` for all other ports
    auth: {
        user: "jorjuroba@hotmail.com",
        pass: "figciapbmdujrwwe",
    },
});
// Definir y exportar la función main
const sendMail = (nomOportunidad) => __awaiter(void 0, void 0, void 0, function* () {
    // Configuración del transporte de nodemailer...
    // send mail with defined transport object
    const info = yield transporter.sendMail({
        from: '"Mario Jurado" <jorjuroba@hotmail.com>',
        to: "jorjuroba@gmail.com",
        subject: `Nueva Oportunidad Recibida: ${nomOportunidad}`, // Personalizar el asunto con el nombre de la oportunidad
        text: `¡Hola! Se ha creado una nueva oportunidad llamada ${nomOportunidad}.`, // Personalizar el texto del correo con el nombre de la oportunidad
        html: `<b>¡Hola!</b><p>Se ha creado una nueva oportunidad llamada ${nomOportunidad}.</p>`, // Personalizar el HTML del correo con el nombre de la oportunidad
    });
    console.log("Message sent: %s", info.messageId);
});
exports.sendMail = sendMail;
//# sourceMappingURL=mail.js.map