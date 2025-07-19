const { request, response } = require("express");
const { pool } = require("../MySQL/basedatos");

const getAllMethod = (req = request, res = response) => {
  pool.query("CALL pa_SelectAllUbicacion", (error, results) => {
    if (error) {
      console.error("Error en getAllMethod:", error);
      return res.status(500).json({
        success: false,
        error: "Error al obtener ubicaciones",
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
  pool.query("CALL pa_SelectUbicacion(?)", [id], (error, results) => {
    if (error) {
      console.error("Error en getMethod:", error);
      return res.status(500).json({
        success: false,
        error: "Error al obtener ubicacion",
      });
    }

    if (results[0].length === 0) {
      return res.status(404).json({
        success: false,
        message: "Ubicacion no encontrada",
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
    provincia,
    canton,
    distrito,
    direccion,
    idFamilia,
    idAlbergue,
    idMunicipalidad,
  } = req.body;

  if (!provincia || !canton || !distrito || !direccion ) {
    return res.status(400).json({
      success: false,
      message:
        "Faltan datos: provincia, canton, distrito, direccion",
    });
  }
  idFamilia = idFamilia ?? null; // Allow null for optional fields
  idAlbergue = idAlbergue ?? null; // Allow null for optional fields
    idMunicipalidad = idMunicipalidad ?? null; // Allow null for optional fields

  pool.query(
    "CALL pa_InsertUbicacion(?, ?, ?, ?, ?, ?, ?)",
    [
      provincia,
      canton,
      distrito,
      direccion,
      idFamilia,
      idAlbergue,
      idMunicipalidad,
    ],
    (error, results) => {
      if (error) {
        console.error("Error al insertar ubicacion:", error);
        return res.status(500).json({
          success: false,
          error: "Error al insertar ubicacion",
        });
      }

      res.status(201).json({
        success: true,
        message: "Ubicacion insertada correctamente",
        data: {
            id: results[0][0].p_id, // Assuming the stored procedure returns the inserted ID
          provincia,
          canton,
          distrito,
          direccion,
          idFamilia,
          idAlbergue,
          idMunicipalidad,
        },
      });
    }
  );
};

const putMethod = (req = request, res = response) => {
  const { id } = req.body;
  const {
    provincia,
    canton,
    distrito,
    direccion,
    idFamilia,
    idAlbergue,
    idMunicipalidad,
  } = req.body;

  if (
    !id ||
    !provincia ||
    canton == null ||
    distrito == null ||
    direccion == null ||
    idFamilia == null ||
    idAlbergue == null ||
    idMunicipalidad == null
  ) {
    return res.status(400).json({
      success: false,
      message:
        "Faltan datos: provincia, canton, distrito, direccion, idFamilia, idAlbergue, idMunicipalidad",
    });
  }

  pool.query(
    "CALL pa_UpdateUbicacion(?, ?, ?, ?, ?, ?, ?, ?)",
    [
      id,
      provincia,
      canton,
      distrito,
      direccion,
      idFamilia,
      idAlbergue,
      idMunicipalidad,
    ],
    (error, results) => {
      if (error) {
        console.error("Error al actualizar ubicacion:", error);
        return res.status(500).json({
          success: false,
          error: "Error al actualizar ubicacion",
        });
      }

      res.status(200).json({
        success: true,
        message: "Ubicacion actualizada correctamente",
        data: {
          provincia,
          canton,
          distrito,
          direccion,
          idFamilia,
          idAlbergue,
          idMunicipalidad,
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
      message: "ID de ubicacion no proporcionado en el body",
    });
  }

  pool.query("CALL pa_DeleteUbicacion(?)", [id], (error, results) => {
    if (error) {
      console.error("Error al eliminar ubicacion:", error);
      return res.status(500).json({
        success: false,
        error: "Error al eliminar ubicacion",
      });
    }

    res.json({
      success: true,
      message: `Ubicacion con ID ${id} eliminada correctamente`,
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
