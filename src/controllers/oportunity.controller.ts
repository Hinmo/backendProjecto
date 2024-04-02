import { Response } from "express";
import { CustomRequest } from "../middlewares/validate-jwt";
import OportunityModel from "../models/oportunity.model";
import UserModel from "../models/user.model";
import {
  maximoOportunidadesAdmin,
  maximoOportunidadesUser,
} from "../config/config";
import { STATE } from "../core/enum/state.enum";
import { ROLES } from "../core/enum/roles.enum";
import InteractionModel from "../models/interactions.model";
import { sendMail } from "../helpers/mail";

export const createOportunity = async (req: CustomRequest, res: Response) => {
  try {
    const { body } = req;
    const userId = req._id;
    const gestorId = body.userGestor;
    const usuario = await UserModel.findById(userId);

    if (!usuario) {
      return res.status(401).json({
        ok: false,
        msg: "El usuario no existe",
      });
    }

    let userEspecifico = ""; // ID del usuario específico
    let estadoOportunidad = gestorId ? STATE.PROCESO : STATE.NOGESTOR;

    // Eliminar el campo userCreate si llega como una cadena vacía
    if (body.userCreate === "") {
      delete body.userCreate;
    }

    if (usuario.rol === ROLES.CLIENTE || usuario.rol === ROLES.ASESOR) {
      userEspecifico = usuario.rol === ROLES.CLIENTE ? userId : body.userCliente;
      estadoOportunidad = STATE.NOGESTOR;
      delete body.userGestor;
    } else {
      if (!body.userCliente) {
        return res.status(401).json({
          ok: false,
          msg: "Se debe especificar el usuario a quien se le asigna la oportunidad",
        });
      }

      if (gestorId) {
        const gestor = await UserModel.findById(gestorId);
        if (!gestor || ![ROLES.GERENTE, ROLES.ASESOR, ROLES.SUPERVISOR].includes(gestor.rol)) {
          return res.status(401).json({
            ok: false,
            msg: "El gestor no existe o no tiene el rol adecuado",
          });
        }
      }

      if (!gestorId) {
        delete body.userGestor;
      } else {
        estadoOportunidad = STATE.PROCESO;
      }

      userEspecifico = body.userCliente;
    }

    // Contar las oportunidades existentes asignadas al usuario (excepto las oportunidades con estado "Finalizado")
    const oportunidadesAsignadas = await OportunityModel.countDocuments({
      userCliente: userEspecifico,
      stateOportunity: { $ne: STATE.FINALIZADA },
    });

    const maximoOportunidades = usuario.rol === ROLES.CLIENTE ? maximoOportunidadesUser : maximoOportunidadesAdmin;

    if (oportunidadesAsignadas >= maximoOportunidades) {
      return res.status(400).json({
        ok: false,
        msg: "Se ha alcanzado el límite de oportunidades asignadas para este usuario",
      });
    }

    const oportunidadNueva = new OportunityModel({
      userCreate: userId,
      stateOportunity: estadoOportunidad,
      ...body,
    });

    const oportunidadCreada = await oportunidadNueva.save();

    // Actualizar el estado de la oportunidad si es necesario
    if (gestorId && oportunidadCreada.stateOportunity !== STATE.PROCESO) {
      oportunidadCreada.stateOportunity = STATE.PROCESO;
      await oportunidadCreada.save();
    }

    await sendMail(oportunidadCreada.nameOportunity);
    res.status(200).json({
      ok: true,
      msg: "Oportunidad registrada",
      oportunidad: oportunidadCreada,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      ok: false,
      error,
      msg: "Error al crear la oportunidad",
    });
  }
};

export const addGestorOportunity = async (
  req: CustomRequest,
  res: Response
) => {
  try {
    // id del usuario
    const id = req.params.id;
    const { body } = req;

    const gestor = await UserModel.findById(body.userGestor);
    if (!gestor) {
      return res.status(401).json({
        ok: false,
        msg: "El gestor no existe o no ha sido asignado",
      });
    }
    // se valida que el rol de id indicado sea el correspondiente a Gerente, Asesor o Supervisor
    if (gestor.rol === (ROLES.CLIENTE || ROLES.SUPERVISOR)) {
      return res.status(401).json({
        ok: false,
        msg: "El id inidicado no tiene el rol adecuado",
      });
    }

    // El update del usuario - Actualizar el usuario
    const oportunidadActualizada = await OportunityModel.findByIdAndUpdate(
      id,
      {
        userGestor: body.userGestor,
        stateOportunity: STATE.PROCESO,
        updateAt: new Date(),
      },
      {
        new: true,
      }
    );

    res.json({
      ok: true,
      oportunidad: oportunidadActualizada,
    });
  } catch (err) {
    res.status(400).json({
      ok: false,
      msg: "Error al actualizar las oportunidades",
    });
  }
};

export const updateOportunity = async (req: CustomRequest, res: Response) => {
  try {
    // id del usuario
    const id = req.params.id;
    const { body } = req;

    // El update del usuario - Actualizar el usuario
    const oportunidadActualizada = await OportunityModel.findByIdAndUpdate(
      id,
      {
        ...body,
        updateAt: new Date(),
      },
      {
        new: true,
      }
    );

    res.json({
      ok: true,
      oportunidad: oportunidadActualizada,
    });
  } catch (err) {
    res.status(400).json({
      ok: false,
      msg: "Error al actualizar las oportunidades",
    });
  }
};

export const deleteOportunity = async (req: CustomRequest, res: Response) => {
  try {
    // id del usuario
    const id = req.params.id;
    const { body } = req;

    // la eliminacion del usuario
    const oportunidadEliminada = await OportunityModel.findByIdAndDelete(id);
    //eliminar las interacciones relacionadas a la oportunidad q se elimina
    const interaccionesEliminadas = await InteractionModel.find({
      refOportunity: id,
    });

    // Eliminar las interacciones encontradas
    await InteractionModel.deleteMany({
      refOportunity: id,
    });

    // Verificar si se eliminaron todas las interacciones relacionadas
    if (interaccionesEliminadas.length === 0) {
      console.log("No se encontraron interacciones relacionadas para eliminar");
    } else {
      console.log(
        `Se eliminaron ${interaccionesEliminadas.length} interacciones relacionadas`
      );
    }

    res.json({
      ok: true,
      oportunidad: oportunidadEliminada,
      interacciones: interaccionesEliminadas,
    });
  } catch (err) {
    res.status(400).json({
      ok: false,
      msg: "Error al eliminar las oportunidades y sus interacciones",
    });
  }
};

export const getSinGestorOportuniy = async (
  req: CustomRequest,
  res: Response
) => {
  try {
    // El busca un usuario por id
    const oportunidad = await OportunityModel.find({
      stateOportunity: STATE.NOGESTOR,
    })
      .populate("userCreate", "nombre")
      .populate("userGestor", "nombre")
      .populate("userCliente", "nombre");

    res.json({
      ok: true,
      oportunidad,
    });
  } catch (err) {
    res.status(500).json({
      ok: false,
      msg: "Error consultar las oportunidades",
    });
  }
};

export const getOportunity = async (req: CustomRequest, res: Response) => {
  try {
    // devuelve todo el listado de productos con la información que el usuario creó

    const oportunidad = await OportunityModel.find()
      .populate("userCreate", "nombre")
      .populate("userGestor", "nombre")
      .populate("userCliente", "nombre");
    /* for (const opor of oportunidad) {
      const interacciones = await OportunityModel.find({
        refOportunity: opor._id,
      })
      oportunidad(interacciones.length)
    } */
    //TODO: pendiente enviar la cantidad de interacciones que esta tenga
    res.json({
      ok: true,
      oportunidad,
    });
  } catch (error) {
    res.json({
      ok: false,
      error,
    });
  }
};

export const getAnOportuniy = async (req: CustomRequest, res: Response) => {
  try {
    const id = req.params.id;

    // El busca un usuario por id
    const oportunidad = await OportunityModel.findById({ _id: id })
      .populate("userCreate", "nombre")
      .populate("userGestor", "nombre")
      .populate("userCliente", "nombre");
    res.json({
      ok: true,
      oportunidad,
    });
  } catch (err) {
    res.status(500).json({
      ok: false,
      msg: "Error consultar las oportunidades",
    });
  }
};
