import { Request, Response } from "express";
import ContactoFormModel from "../models/contacto.model";
import { enviarCorreoContacto } from "../helpers/mail";

// Límite de envíos por IP en un período de tiempo
const limiteEnviosPorIP = 2;

export const enviarFormularioContacto = async (req: Request, res: Response) => {
    const { nombre, email, mensaje } = req.body;
    const ipAddress = req.ip; // Obtener la dirección IP del cliente

    try {
      // Verificar si la dirección IP ha alcanzado el límite de envíos permitidos
      const enviosIPHoy = await ContactoFormModel.countDocuments({ ipAddress: ipAddress, createdAt: { $gte: new Date(new Date().setHours(0, 0, 0)), $lte: new Date(new Date().setHours(23, 59, 59)) } });
      if (enviosIPHoy >= limiteEnviosPorIP) {
        return res.status(429).json({
          ok: false,
          msg: "Se ha alcanzado el límite de envíos de formularios desde esta dirección IP."
        });
      }

      // Validar si ya se ha enviado un formulario desde la misma dirección de correo electrónico
      const formularioExistente = await ContactoFormModel.findOne({ email: email });
      if (formularioExistente) {
        return res.status(409).json({
          ok: false,
          msg: "Ya se ha enviado un formulario de contacto con esta dirección de correo electrónico."
        });
      }

      // Crear un nuevo documento del formulario de contacto
      const nuevoFormulario = new ContactoFormModel({
        nombre,
        email,
        mensaje,
        ipAddress,
        createdAt: new Date()
      });
  
      // Guardar el formulario en la base de datos
      const formularioGuardado = await nuevoFormulario.save();

      await enviarCorreoContacto(formularioGuardado);
  
      // Enviar respuesta exitosa al cliente
      res.status(200).json({
        ok: true,
        msg: "Formulario de contacto enviado exitosamente",
        formulario: formularioGuardado
      });
    } catch (error) {
      console.error(error);
      // Manejar errores de forma adecuada
      res.status(500).json({
        ok: false,
        msg: "Ocurrió un error al procesar el formulario de contacto. Por favor, inténtalo de nuevo más tarde."
      });
    }
};
