const { request, response } = require("express");
const { pool } = require("../MySQL/basedatos");

const getMethod = (req = request, res = response) => {
  const { id } = req.params;
  pool.query("CALL pa_SelectToken(?)", [id], (error, results) => {
    if (error) {
      console.error("Error en getMethod:", error);
      return res.status(500).json({
        success: false,
        error: "Error al obtener token",
      });
    }

    if (results[0].length === 0) {
      return res.status(404).json({
        success: false,
        message: "Token no encontrado",
      });
    }

    res.json({
      success: true,
      data: results[0][0],
    });
  });
};

const postMethod = (req = request, res = response) => {
  let { idUsuario, token, fechaExpiracion } = req.body;

  if (!idUsuario || !token || !fechaExpiracion) {
    return res.status(400).json({
      success: false,
      message: "Faltan datos: idUsuario, token, fechaExpiracion",
    });
  }

  pool.query(
    "CALL pa_InsertToken(?, ?, ?)",
    [idUsuario, token, fechaExpiracion],
    (error, results) => {
      if (error) {
        console.error("Error al insertar token:", error);
        return res.status(500).json({
          success: false,
          error: "Error al insertar token",
        });
      }

      res.status(201).json({
        success: true,
        message: "Ubicacion insertada correctamente",
        data: {
          id: results[0][0].id,
          idUsuario,
          token,
          fechaExpiracion,
        },
      });
    }
  );
};

const putMethod = (req = request, res = response) => {
  const { id } = req.body;
  const { idUsuario, token, esActivo, fechaExpiracion } = req.body;

  if (
    
  ) {
    return res.status(400).json({
      success: false,
      message:
        "Faltan datos: ",
    });
  }

  pool.query(
    "CALL pa_UpdateToken(?, ?, ?, ?)",
    [
      idUsuario, token, esActivo, fechaExpiracion
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
          idUsuario, token, esActivo, fechaExpiracion
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

  pool.query("CALL pa_DeleteToken(?)", [id], (error, results) => {
    if (error) {
      console.error("Error al eliminar Token:", error);
      return res.status(500).json({
        success: false,
        error: "Error al eliminar Token",
      });
    }

    res.json({
      success: true,
      message: `Token con ID ${id} eliminada correctamente`,
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
