const { request, response } = require("express");
const { pool } = require("../MySQL/basedatos");

const getAllMethod = (req = request, res = response) => {
  pool.query("CALL pa_SelectAllPedidoConsumible", (error, results) => {
    if (error) {
      console.error("Error en getAllMethod:", error);
      return res.status(500).json({
        success: false,
        error: "Error al obtener pedidos consumibles",
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
  pool.query("CALL pa_SelectPedidoConsumible(?)", [id], (error, results) => {
    if (error) {
      console.error("Error en getMethod:", error);
      return res.status(500).json({
        success: false,
        error: "Error al obtener pedido consumible",
      });
    }

    if (results[0].length === 0) {
      return res.status(404).json({
        success: false,
        message: "Pedido consumible no encontrado",
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
    tipoComida,
    cantidadPersonas,
    idConsumible,
    idAlbergue,
    idUsuarioCreacion,
  } = req.body;

  if (!tipoComida || !cantidadPersonas || !idAlbergue) {
    return res.status(400).json({
      success: false,
      message: "Faltan datos: tipoComida, cantidadPersonas, idAlbergue",
    });
  }
  idConsumible = idConsumible ?? null;
  idUsuarioCreacion = idUsuarioCreacion ?? null;

  pool.query(
    "CALL pa_InsertPedidoConsumible(?, ?, ?, ?, ?)",
    [tipoComida, cantidadPersonas, idConsumible, idAlbergue, idUsuarioCreacion],
    (error, results) => {
      if (error) {
        console.error("Error al insertar usuario:", error);
        return res.status(500).json({
          success: false,
          error: "Error al insertar pedido consumible",
        });
      }

      res.status(201).json({
        success: true,
        message: "Pedido consumible insertado correctamente",
        data: {
          id: results[0][0].p_id,
          tipoComida,
          cantidadPersonas,
          idConsumible,
          idAlbergue,
          idUsuarioCreacion,
        },
      });
    }
  );
};

const putMethod = (req = request, res = response) => {
  const { id } = req.body;
  const {
    fechaCreacion,
    tipoComida,
    cantidadPersonas,
    idAlbergue,
    idUsuarioCreacion,
    fechaCreacionUsuario,
    idUsuarioModificacion,
    fechaModificacionUsuario,
  } = req.body;

  if (
    !id ||
    !fechaCreacion ||
    tipoComida == null ||
    cantidadPersonas == null ||
    idAlbergue == null ||
    idUsuarioCreacion == null ||
    fechaCreacionUsuario == null ||
    idUsuarioModificacion == null ||
    fechaModificacionUsuario == null
  ) {
    return res.status(400).json({
      success: false,
      message:
        "Faltan datos: id, fechaCreacion, tipoComida, cantidadPersonas, idAlbergue, idUsuarioCreacion, fechaCreacionUsuario, idUsuarioModificacion, fechaModificacionUsuario",
    });
  }

  pool.query(
    "CALL pa_UpdatePedidoConsumible(?, ?, ?, ?, ?, ?, ?, ?, ?)",
    [
      id,
      fechaCreacion,
      tipoComida,
      cantidadPersonas,
      idAlbergue,
      idUsuarioCreacion,
      fechaCreacionUsuario,
      idUsuarioModificacion,
      fechaModificacionUsuario,
    ],
    (error, results) => {
      if (error) {
        console.error("Error al actualizar pedido consumible:", error);
        return res.status(500).json({
          success: false,
          error: "Error al actualizar pedido consumible",
        });
      }

      res.status(200).json({
        success: true,
        message: "Pedido consumible actualizado correctamente",
        data: {
          id,
          fechaCreacion,
          tipoComida,
          cantidadPersonas,
          idAlbergue,
          idUsuarioCreacion,
          fechaCreacionUsuario,
          idUsuarioModificacion,
          fechaModificacionUsuario,
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
      message: "ID de pedido consumible no proporcionado en el body",
    });
  }

  pool.query("CALL pa_DeletePedidoConsumible(?)", [id], (error, results) => {
    if (error) {
      console.error("Error al eliminar pedido consumible:", error);
      return res.status(500).json({
        success: false,
        error: "Error al eliminar pedido consumible",
      });
    }

    res.json({
      success: true,
      message: `Pedido consumible con ID ${id} eliminado correctamente`,
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
