const { request, response } = require("express");
const { pool } = require("../MySQL/basedatos");

const getAllMethod = (req = request, res = response) => {
  pool.query("CALL pa_SelectAllMunicipalidad", (error, results) => {
    if (error) {
      console.error("Error en getAllMethod:", error);
      return res.status(500).json({
        success: false,
        error: "Error al obtener municipalidad",
      });
    }

    res.json({
      success: true,
      data: results[0],
    });
  });
};

const getMethod = (req = request, res = response) => {
  const { id } = req.params;
  pool.query("CALL pa_SelectMunicipalidad(?)", [id], (error, results) => {
    if (error) {
      console.error("Error en getMethod:", error);
      return res.status(500).json({
        success: false,
        error: "Error al obtener municipalidad",
      });
    }

    if (results[0].length === 0) {
      return res.status(404).json({
        success: false,
        message: "Municipalidad no encontrada",
      });
    }

    res.json({
      success: true,
      data: results[0][0],
    });
  });
};

const postMethod = (req = request, res = response) => {
  let{
    nombre,
    idUbicacion,
    telefono,
    correo,
    idAlbergue,
    idUsuario,
    idUsuarioCreacion,
    idUsuarioModificacion,
  } = req.body;

  if (!nombre || !idUbicacion) {
    return res.status(400).json({
      success: false,
      message: "Faltan datos: nombre, idUbicacion",
    });
  }
  telefono = telefono ?? null;
  correo = correo ?? null;
  idAlbergue = idAlbergue ?? null;
  idUsuario = idUsuario ?? null;
  idUsuarioCreacion = idUsuarioCreacion ?? null;
  idUsuarioModificacion = idUsuarioModificacion ?? null;

  pool.query(
    "CALL pa_InsertMunicipalidad(?, ?, ?, ?, ?, ?, ?, ?)",
    [
      nombre,
      idUbicacion,
      telefono,
      correo,
      idAlbergue,
      idUsuario,
      idUsuarioCreacion,
      idUsuarioModificacion,
    ],
    (error, results) => {
      if (error) {
        console.error("Error al insertar municipalidad:", error);
        return res.status(500).json({
          success: false,
          error: "Error al insertar municipalidad",
        });
      }

      res.status(201).json({
        success: true,
        message: "Municipalidad insertada correctamente",
        data: {
        id: results[0][0].id,
          nombre,
          idUbicacion,
          telefono,
          correo,
          idAlbergue,
          idUsuario,
          idUsuarioCreacion,
          idUsuarioModificacion,
        },
      });
    }
  );
};

const putMethod = (req = request, res = response) => {
  const { id } = req.body;
  const {
    nombre,
    idUbicacion,
    telefono,
    correo,
    idAlbergue,
    idUsuario,
    idUsuarioCreacion,
    idUsuarioModificacion,
  } = req.body;

  if (
    !id ||
    !nombre ||
    idUbicacion == null ||
    telefono == null ||
    correo == null ||
    idAlbergue == null ||
    idUsuario == null ||
    idUsuarioCreacion == null ||
    idUsuarioModificacion == null
  ) {
    return res.status(400).json({
      success: false,
      message:
        "Faltan datos: nombre, idUbicacion, telefono, correo, idAlbergue, idUsuario, idUsuarioCreacion, idUsuarioModificacion",
    });
  }

  pool.query(
    "CALL pa_UpdateMunicipalidad(?, ?, ?, ?, ?, ?, ?, ?, ?,)",
    [
      id,
      nombre,
      idUbicacion,
      telefono,
      correo,
      idAlbergue,
      idUsuario,
      idUsuarioCreacion,
      idUsuarioModificacion,
    ],
    (error, results) => {
      if (error) {
        console.error("Error al actualizar municipalidad:", error);
        return res.status(500).json({
          success: false,
          error: "Error al actualizar municipalidad",
        });
      }

      res.status(200).json({
        success: true,
        message: "Municipalidad actualizada correctamente",
        data: {
          nombre,
          idUbicacion,
          telefono,
          correo,
          idAlbergue,
          idUsuario,
          idUsuarioCreacion,
          idUsuarioModificacion,
        },
      });
    }
  );
};

const deleteMethod = (req = request, res = response) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({
      success: false,
      message: "ID de municipalidad no proporcionado en el body",
    });
  }

  pool.query("CALL pa_DeleteMunicipalidad(?)", [id], (error, results) => {
    if (error) {
      console.error("Error al eliminar municipalidad:", error);
      return res.status(500).json({
        success: false,
        error: "Error al eliminar municipalidad",
      });
    }

    res.json({
      success: true,
      message: `Municipalidad con ID ${id} eliminada correctamente`,
    });
  });
};

module.exports = {
  getAllMethod,
  getMethod,
  postMethod,
  putMethod,
  deleteMethod,
};
