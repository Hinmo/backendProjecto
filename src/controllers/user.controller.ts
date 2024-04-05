import { Request, Response } from "express";
import UserModel from "../models/user.model";
import bcrypt from "bcryptjs";
import { CustomRequest } from "../middlewares/validate-jwt";
import { ROLES } from "../core/enum/roles.enum";

export const createUser = async (req: Request, res: Response) => {
  const { body } = req;
  const { login, password, numeroDocumento } = body;

  try {
    // Valida si el nombre de usuario a crear ya existe
    const existLogin = await UserModel.findOne({
      login: login,
    });
    if (existLogin) {
      return res.status(409).json({
        ok: false,
        msg: `Ya existe un login ${login} creado`,
      });
    }
    // Valida si el documento de usuario ya existe
    const existDocument = await UserModel.findOne({
      numeroDocumento: numeroDocumento,
    });
    if (existDocument) {
      return res.status(409).json({
        ok: false,
        msg: `Ya existe un usuario con el documento ${numeroDocumento} creado`,
      });
    }

    const newUser = new UserModel({
      ...body,
    });

    // Se encripta la contraseña
    const salt = bcrypt.genSaltSync(10);
    newUser.password = bcrypt.hashSync(password, salt);

    // Crea el usuario
    const userCreate = await newUser.save();

    res.status(200).json({
      ok: true,
      msg: "Usuario creado satisfactoriamente",
      userCreate,
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({
      ok: false,
      msg: "Error al crear el usuario, comuniquese con el administrador",
    });
  }
};

export const getAllUsers = async (req: CustomRequest, res: Response) => {
  try {
    // El busca todos los usuarios
    const usuarios = await UserModel.find();
    res.json({
      ok: true,
      usuarios,
    });
  } catch (err) {
    res.status(500).json({
      ok: false,
      msg: "Error consultar los usuarios",
    });
  }
};

export const getaUserId = async (req: CustomRequest, res: Response) => {
  try {
    const id = req.params.id;
    // El busca un usuario por id
    const usuario = await UserModel.findById({ _id: id });
    res.json({
      ok: true,
      usuario,
    });
  } catch (err) {
    res.status(500).json({
      ok: false,
      msg: "Error consultar los usuarios",
    });
  }
};
//Forma general
/* export const getaUserRol = async (req: CustomRequest, res: Response) => {
  try {
    const rol = req.params.rol;
    // El busca un usuario por rol
    const usuario = await UserModel.find({ rol: rol });
    res.json({
      ok: true,
      usuario,
    });
  } catch (err) {
    res.status(500).json({
      ok: false,
      msg: "Error consultar los usuarios",
    });
  }
}; */
//Forma especifica- grupo de usuarios
export const getaUserRol = async (req: CustomRequest, res: Response) => {
  try {
    const rol = req.params.rol;

    // Si el rol solicitado es "staff" o "equipo", buscar todos los roles excepto "Cliente"
    // Siempre trae a los usuarios con el estado activo (estado: true)
    let update;
    if (rol === "staff" || rol === "equipo") {
      update = { rol: { $ne: "Cliente" } };
    } else {
      // El busca un usuario por el rol indicado
      update = { rol: rol };
    }
    // El busca un usuario por rol
    const usuario = await UserModel.find(update);
    res.json({
      ok: true,
      usuario,
    });
  } catch (err) {
    res.status(500).json({
      ok: false,
      msg: "Error consultar los usuarios",
    });
  }
};

export const updateUser = async (req: CustomRequest, res: Response) => {
  try {
    // Obtener el id del usuario del token
    const userId = req._id; 

    // Obtener el id del usuario a actualizar
    const id = req.params.id;
    const { body } = req;

    const userSolicitante = await UserModel.findById(userId);
    if (!userSolicitante) {
      return res.status(404).json({
        ok: false,
        msg: "Usuario no encontrado",
      });
    }

    const userObjetivo = await UserModel.findById(id);
    if (!userObjetivo) {
      return res.status(404).json({
        ok: false,
        msg: "Usuario a actualizar no encontrado",
      });
    }

    if (userSolicitante.rol === ROLES.GERENTE) {
      if (userObjetivo.rol === ROLES.GERENTE) {
        const otrosGerentes = await UserModel.countDocuments({ rol: ROLES.GERENTE, _id: { $ne: id } });
        if (otrosGerentes === 0) {
          return res.status(403).json({
            ok: false,
            msg: "No se puede modificar el perfil del único gerente existente",
          });
        }
      }
    } else if (userSolicitante.rol === ROLES.SUPERVISOR) {
      if ([ROLES.SUPERVISOR, ROLES.CLIENTE, ROLES.ASESOR].includes(userObjetivo.rol)) {
        if (body.rol && body.rol === ROLES.GERENTE) {
          return res.status(403).json({
            ok: false,
            msg: "No tiene permiso para promover a este usuario a gerente",
          });
        }
      }
      // Permitir que el supervisor modifique supervisor, asesor y cliente
      if (![ROLES.SUPERVISOR, ROLES.ASESOR, ROLES.CLIENTE].includes(userObjetivo.rol)) {
        return res.status(403).json({
          ok: false,
          msg: "No tiene permiso para modificar a este usuario",
        });
      }
    } else if (userId === id) {
      if (body.rol && body.rol !== userObjetivo.rol) {
        return res.status(403).json({
          ok: false,
          msg: "No tiene permiso para modificar su propio rol",
        });
      }
    }

    // Actualizar el usuario
    const update = { ...body, updateAt: new Date() };
    const userActualizo = await UserModel.findByIdAndUpdate(id, update, {
      new: true,
    });

    return res.json({
      ok: true,
      usuario: userActualizo,
    });
  } catch (err) {
    return res.status(400).json({
      ok: false,
      msg: "Error al actualizar el usuario",
    });
  }
};


export const updateStateUser = async (req: CustomRequest, res: Response) => {
  try {
    // id del User
    const id = req.params.id;
    const estado = await UserModel.findById(id);
    // El update del User - Actualizar el User
    const usuerActualizado = await UserModel.findByIdAndUpdate(
      id,
      { estado: !estado?.estado, updateAt: new Date() },
      {
        new: true,
      }
    );
    res.json({
      ok: true,
      cliente: usuerActualizado,
    });
  } catch (err) {
    res.status(400).json({
      ok: false,
      msg: "Error consultar los clientes",
    });
  }
};

export const deleteUser = async (req: CustomRequest, res: Response) => {
  try {
    // id del usuario
    const id = req.params.id;
    // se valida que no se este eliminando el usuario logueado
    if (req._id === id) {
      return res.status(409).json({
        ok: false,
        msg: `No puedes eliminar tu propio usuario`,
      });
    }
    // TODO: validar exista al menos un gerente

    // la eliminacion del usuario
    const usuarioEliminado = await UserModel.findByIdAndDelete(id);
    res.json({
      ok: true,
      usuario: usuarioEliminado,
    });
  } catch (err) {
    res.status(400).json({
      ok: false,
      msg: "Error consultar los clientes",
    });
  }
};
