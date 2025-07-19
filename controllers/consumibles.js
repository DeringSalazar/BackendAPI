const { request, response } = require("express");
const { pool } = require("../MySQL/basedatos");

const getAllMethod = (req = request, res = response) => {
  pool.query("CALL pa_SelectAllConsumible", (error, results) => {
    if (error) {
      console.error("Error en getAllMethod:", error);
      return res.status(500).json({
        success: false,
        error: "Error al obtener consumibles",
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
  pool.query("CALL pa_SelectConsumible(?)", [id], (error, results) => {
    if (error) {
      console.error("Error en getMethod:", error);
      return res.status(500).json({
        success: false,
        error: "Error al obtener consumible",
      });
    }

    if (results[0].length === 0) {
      return res.status(404).json({
        success: false,
        message: "Consumible no encontrado",
      });
    }

    res.json({
      success: true,
      data: results[0][0],
    });
  });
};

const postMethod = (req = request, res = response) => {
  let{ nombre, idUnidadMedida, idCategoria, idCantidadPorPersona } =
    req.body;

  if (!nombre || idUnidadMedida || idCategoria) {
    return res.status(400).json({
      success: false,
      message: "Faltan datos: nombre, idUnidadMedida, idCategoria",
    });
  }
  idCantidadPorPersona = idCantidadPorPersona ?? null;

  pool.query(
    "CALL pa_InsertConsumible(?, ?, ?, ?)",
    [nombre, idUnidadMedida, idCategoria, idCantidadPorPersona],
    (error, results) => {
      if (error) {
        console.error("Error al insertar consumible:", error);
        return res.status(500).json({
          success: false,
          error: "Error al insertar consumible",
        });
      }

      res.status(201).json({
        success: true,
        message: "Consumible insertado correctamente",
        data: {
          id: results[0][0].id,
          nombre,
          idUnidadMedida,
          idCategoria,
          idCantidadPorPersona,
        },
      });
    }
  );
};

const putMethod = (req = request, res = response) => {
  const { id } = req.body;
  const { nombre, idUnidadMedida, idCategoria } = req.body;

  if (!id || !nombre || idUnidadMedida == null || idCategoria == null) {
    return res.status(400).json({
      success: false,
      message: "Faltan datos: id, nombre, idUnidadMedida, idCategoria",
    });
  }

  pool.query(
    "CALL pa_UpdateConsumible(?, ?, ?, ?)",
    [id, nombre, idUnidadMedida, idCategoria],
    (error, results) => {
      if (error) {
        console.error("Error al actualizar consumible:", error);
        return res.status(500).json({
          success: false,
          error: "Error al actualizar consumible",
        });
      }

      res.status(200).json({
        success: true,
        message: "Consumible actualizado correctamente",
        data: {
          id,
          nombre,
          idUnidadMedida,
          idCategoria,
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
      message: "ID de consumible no proporcionado en el body",
    });
  }

  pool.query("CALL pa_DeleteConsumible(?)", [id], (error, results) => {
    if (error) {
      console.error("Error al eliminar consumible:", error);
      return res.status(500).json({
        success: false,
        error: "Error al eliminar consumible",
      });
    }

    res.json({
      success: true,
      message: `Consumible con ID ${id} eliminado correctamente`,
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
