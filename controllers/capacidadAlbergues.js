const { request, response } = require("express");
const { pool } = require("../MySQL/basedatos");

// Obtener todos los registros
const getAllMethod = (req = request, res = response) => {
  pool.query("CALL pa_SelectAllCapacidadAlbergue()", (error, results) => {
    if (error) {
      console.error("Error en getAllMethod:", error);
      return res
        .status(500)
        .json({ success: false, error: "Error al obtener capacidades" });
    }

    res.json({ success: true, data: results[0] });
  });
};

// Obtener un registro por ID
const getMethod = (req = request, res = response) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ success: false, message: "ID requerido" });
  }

  pool.query("CALL pa_SelectCapacidadAlbergue(?)", [id], (error, results) => {
    if (error) {
      console.error("Error en getMethod:", error);
      return res
        .status(500)
        .json({ success: false, error: "Error al obtener capacidad" });
    }

    if (!results || !results[0] || results[0].length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Registro no encontrado" });
    }

    res.json({ success: true, data: results[0][0] });
  });
};

// Crear nuevo registro
const postMethod = (req = request, res = response) => {
  let{
    idAlbergue,
    capacidadPersonas,
    capacidadColectiva,
    cantidadFamilias,
    ocupacion,
    egresos,
    sospechososSanos,
    otros,
  } = req.body;

  if (
    !capacidadPersonas ||
    !capacidadColectiva ||
    !cantidadFamilias ||
    !ocupacion ||
    !egresos
  ) {
    return res.status(400).json({
      success: false,
      message: "Faltan campos obligatorios",
    });
  }
  idAlbergue = idAlbergue ?? null;
  sospechososSanos = sospechososSanos ?? null;
  otros = otros ?? null;

  pool.query(
    "CALL pa_InsertCapacidadAlbergue(?, ?, ?, ?, ?, ?, ?, ?)",
    [
      idAlbergue,
      capacidadPersonas,
      capacidadColectiva,
      cantidadFamilias,
      ocupacion,
      egresos,
      sospechososSanos,
      otros,
    ],
    (error, results) => {
      if (error) {
        console.error("Error en postMethod:", error);
        return res
          .status(500)
          .json({ success: false, error: "Error al crear registro" });
      }

      res.status(201).json({
        success: true,
        message: "Registro creado correctamente",
        data: {
          id: results[0][0].id,
          idAlbergue,
          capacidadPersonas,
          capacidadColectiva,
          cantidadFamilias,
          ocupacion,
          egresos,
          sospechososSanos,
          otros,
        },
      });
    }
  );
};

// Actualizar un registro
const putMethod = (req = request, res = response) => {
  const {
    idAlbergue,
    capacidadPersonas,
    capacidadColectiva,
    cantidadFamilias,
    ocupacion,
    egresos,
    sospechososSanos,
    otros,
  } = req.body;

  if (
    id == null ||
    capacidad_personas == null ||
    capacidad_colectiva == null ||
    cantidad_familias == null ||
    ocupacion == null ||
    egresos == null ||
    sospechosos_sanos == null
  ) {
    return res.status(400).json({
      success: false,
      message: "Faltan campos obligatorios o el ID",
    });
  }

  pool.query(
    "CALL pa_UpdateCapacidadAlbergue(?, ?, ?, ?, ?, ?, ?, ?)",
    [
      id,
      capacidad_personas,
      capacidad_colectiva,
      cantidad_familias,
      ocupacion,
      egresos,
      sospechosos_sanos,
      otros,
    ],
    (error, results) => {
      if (error) {
        console.error("Error en putMethod:", error);
        return res
          .status(500)
          .json({ success: false, error: "Error al actualizar registro" });
      }

      res.json({
        success: true,
        message: "Registro actualizado correctamente",
      });
    }
  );
};

// Eliminar registro
const deleteMethod = (req = request, res = response) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({
      success: false,
      message: "ID requerido para eliminar",
    });
  }

  pool.query("CALL pa_DeleteCapacidadAlbergue(?)", [id], (error, results) => {
    if (error) {
      console.error("Error en deleteMethod:", error);
      return res
        .status(500)
        .json({ success: false, error: "Error al eliminar registro" });
    }

    res.json({
      success: true,
      message: `Registro con ID ${id} eliminado correctamente`,
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
