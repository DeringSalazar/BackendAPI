const { request, response } = require("express");
const { pool } = require("../MySQL/basedatos");

const getAllMethod = (req = request, res = response) => {
  pool.query("CALL pa_SelectAllReferencia", (error, results) => {
    if (error) {
      console.error("Error en getAllMethod:", error);
      return res.status(500).json({
        success: false,
        error: "Error al obtener referencias",
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
  pool.query("CALL pa_SelectReferencia(?)", [id], (error, results) => {
    if (error) {
      console.error("Error en getMethod:", error);
      return res.status(500).json({
        success: false,
        error: "Error al obtener categoría de referencia",
      });
    }

    if (results[0].length === 0) {
      return res.status(404).json({
        success: false,
        message: "Referencia no encontrado",
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
    idFamilia,
    tipoAyuda,
    descripcion,
    fechaEntrega,
    responsable,
    idUsuarioCreacion,
  } = req.body;

  if (!idFamilia || !tipoAyuda || !fechaEntrega) {
    return res.status(400).json({
      success: false,
      message:
        "Faltan datos: idFamilia, tipoAyuda, descripcion, fechaEntrega, responsable, idUsuarioCreacion",
    });
  }

  responsable = responsable ?? null; // Si no se proporciona, se establece como null
  idUsuarioCreacion = idUsuarioCreacion ?? null; // Si no se proporciona, se establece como null

  pool.query(
    "CALL pa_InsertReferencia(?, ?, ?, ?, ?, ?)",
    [
      idFamilia,
      tipoAyuda,
      descripcion,
      fechaEntrega,
      responsable,
      idUsuarioCreacion,
    ],
    (error, results) => {
      if (error) {
        console.error("Error al insertar categoria:", error);
        return res.status(500).json({
          success: false,
          error: "Error al insertar referencia",
        });
      }

      res.status(201).json({
        success: true,
        message: "Referencia insertado correctamente",
        data: {
          id: results[0][0].p_id, 
          idFamilia,
          tipoAyuda,
          descripcion,
          fechaEntrega,
          responsable,
          idUsuarioCreacion,
          
        },
      });
    }
  );
};

const putMethod = (req = request, res = response) => {
  const { id } = req.body;
  const {
    idFamilia,
    tipoAyuda,
    descripcion,
    fechaEntrega,
    responsable,
    idUsuarioCreacion,
    idUsuarioModificacion,
  } = req.body;

  if (
    !id ||
    idFamilia == null ||
    !tipoAyuda ||
    !descripcion ||
    !fechaEntrega ||
    !responsable ||
    idUsuarioCreacion == null ||
    idUsuarioModificacion == null
  ) {
    return res.status(400).json({
      success: false,
      message:
        "Faltan datos: id, idFamilia, tipoAyuda, descripcion, fechaEntrega, responsable, idUsuarioCreacion, idUsuarioModificacion",
    });
  }

  pool.query(
    "CALL pa_UpdateReferencia(?, ?, ?, ?, ?, ?, ?, ?)",
    [
      idFamilia,
      tipoAyuda,
      descripcion,
      fechaEntrega,
      responsable,
      idUsuarioCreacion,
      idUsuarioModificacion,
    ],
    (error, results) => {
      if (error) {
        console.error("Error al actualizar categoria:", error);
        return res.status(500).json({
          success: false,
          error: "Error al actualizar referencia",
        });
      }

      res.status(200).json({
        success: true,
        message: "Referencia actualizado correctamente",
        data: {
          idFamilia,
          tipoAyuda,
          descripcion,
          fechaEntrega,
          responsable,
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
      message: "ID de referencia no proporcionado en el body",
    });
  }

  pool.query("CALL pa_DeleteReferencia(?)", [id], (error, results) => {
    if (error) {
      console.error("Error al eliminar referencia:", error);
      return res.status(500).json({
        success: false,
        error: "Error al eliminar referencia",
      });
    }

    res.json({
      success: true,
      message: `Referencia con ID ${id} eliminado correctamente`,
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
