const { request, response } = require("express");
const { pool } = require("../MySQL/basedatos");

const getAllMethod = (req = request, res = response) => {
  pool.query("CALL pa_SelectAllFamilia", (error, results) => {
    if (error) {
      console.error("Error en getAllMethod:", error);
      return res.status(500).json({
        success: false,
        error: "Error al obtener familias",
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
  pool.query("CALL pa_SelectFamilia(?)", [id], (error, results) => {
    if (error) {
      console.error("Error en getMethod:", error);
      return res.status(500).json({
        success: false,
        error: "Error al obtener familias",
      });
    }

    if (results[0].length === 0) {
      return res.status(404).json({
        success: false,
        message: "Familia no encontrada",
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
    codigoFamilia,
    cantidadPersonas,
    idAlbergue,
    idUbicacion,
    idAmenaza,
    idPersona,
    idUsuarioCreacion,
  } = req.body;

  if (
    !codigoFamilia ||
    !cantidadPersonas ||
    !idAlbergue ||
    !idUbicacion ||
    !idAmenaza
  ) {
    return res.status(400).json({
      success: false,
      message:
        "Faltan datos: codigoFamilia, cantidadPersonas, idAlbergue, idUbicacion, idAmenaza, idPersona",
    });
  }
  idUsuarioCreacion = idUsuarioCreacion ?? null;

  pool.query(
    "CALL pa_InsertFamilia(?, ?, ?, ?, ?, ?, ?)",
    [
      codigoFamilia,
      cantidadPersonas,
      idAlbergue,
      idUbicacion,
      idAmenaza,
      idPersona,
      idUsuarioCreacion,
    ],
    (error, results) => {
      if (error) {
        console.error("Error al insertar familia:", error);
        return res.status(500).json({
          success: false,
          error: "Error al insertar familia",
        });
      }

      res.status(201).json({
        success: true,
        message: "Familia insertada correctamente",
        data: {
          id: results[0][0].id,
          codigoFamilia,
          cantidadPersonas,
          idAlbergue,
          idUbicacion,
          idAmenaza,
          idPersona,
          idUsuarioCreacion,
        },
      });
    }
  );
};

const putMethod = (req = request, res = response) => {
  const { id } = req.body;
  const {
    codigoFamilia,
    cantidadPersonas,
    idAlbergue,
    idUbicacion,
    idAmenaza,
  } = req.body;

  if (
    !id ||
    !codigoFamilia ||
    cantidadPersonas == null ||
    idAlbergue == null ||
    idUbicacion == null ||
    idAmenaza == null
  ) {
    return res.status(400).json({
      success: false,
      message:
        "Faltan datos: codigoFamilia, cantidadPersonas, idAlbergue, idUbicacion, idAmenaza ",
    });
  }

  pool.query(
    "CALL pa_UpdateFamilia(?, ?, ?, ?, ?, ?)",
    [id, codigoFamilia, cantidadPersonas, idAlbergue, idUbicacion, idAmenaza],
    (error, results) => {
      if (error) {
        console.error("Error al actualizar familia:", error);
        return res.status(500).json({
          success: false,
          error: "Error al actualizar familia",
        });
      }

      res.status(200).json({
        success: true,
        message: "Familia actualizada correctamente",
        data: {
          codigoFamilia,
          cantidadPersonas,
          idAlbergue,
          idUbicacion,
          idAmenaza,
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
      message: "ID de familia no proporcionado en el body",
    });
  }

  pool.query("CALL pa_DeleteFamilia(?)", [id], (error, results) => {
    if (error) {
      console.error("Error al eliminar familia:", error);
      return res.status(500).json({
        success: false,
        error: "Error al eliminar familia",
      });
    }

    res.json({
      success: true,
      message: `Familia con ID ${id} eliminada correctamente`,
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
