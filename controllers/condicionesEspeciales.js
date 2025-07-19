const { request, response } = require("express");
const { pool } = require("../MySQL/basedatos");

const getAllMethod = (req = request, res = response) => {
  pool.query("CALL pa_SelectAllCondicionesEspeciales", (error, results) => {
    if (error) {
      console.error("Error en getAllMethod:", error);
      return res.status(500).json({
        success: false,
        error: "Error al obtener condiciones especiales",
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
  pool.query(
    "CALL pa_SelectCondicionesEspeciales(?)",
    [id],
    (error, results) => {
      if (error) {
        console.error("Error en getMethod:", error);
        return res.status(500).json({
          success: false,
          error: "Error al obtener condiciones especiales",
        });
      }

      if (results[0].length === 0) {
        return res.status(404).json({
          success: false,
          message: "Condiciones especiales no encontrada",
        });
      }

      res.json({
        success: true,
        data: results[0][0],
      });
    }
  );
};

const postMethod = (req = request, res = response) => {
  let{
    idPersona,
    discapacidad,
    tipoDiscapacidad,
    subtipoDiscapacidad,
    tieneCondicionSalud,
    condicionSaludId,
  } = req.body;

  if (!discapacidad || !tieneCondicionSalud) {
    return res.status(400).json({
      success: false,
      message: "Faltan datos: discapacidad, tieneCondicionSalud",
    });
  }
  idPersona = idPersona ?? null;
  tipoDiscapacidad = tipoDiscapacidad ?? null;
  subtipoDiscapacidad = subtipoDiscapacidad ?? null;
  condicionSaludId = condicionSaludId ?? null;

  pool.query(
    "CALL pa_InsertCondicionesEspeciales(?, ?, ?, ?, ?, ?)",
    [
      idPersona,
      discapacidad,
      tipoDiscapacidad,
      subtipoDiscapacidad,
      tieneCondicionSalud,
      condicionSaludId,
    ],
    (error, results) => {
      if (error) {
        console.error("Error al insertar condiciones especiales:", error);
        return res.status(500).json({
          success: false,
          error: "Error al insertar condiciones especiales",
        });
      }

      res.status(201).json({
        success: true,
        message: "Condiciones especiales insertada correctamente",
        data: {
           id: results[0][0].id,
          idPersona,
          discapacidad,
          tipoDiscapacidad,
          subtipoDiscapacidad,
          tieneCondicionSalud,
          condicionSaludId,
        },
      });
    }
  );
};

const putMethod = (req = request, res = response) => {
  const { id } = req.body;
  const {
    discapacidad,
    tipoDiscapacidad,
    subtipoDiscapacidad,
    tieneCondicionSalud,
    condicionSaludId,
    idPersona,
  } = req.body;

  if (
    !id ||
    !discapacidad ||
    tipoDiscapacidad == null ||
    subtipoDiscapacidad == null ||
    tieneCondicionSalud == null ||
    condicionSaludId == null ||
    !idPersona
  ) {
    return res.status(400).json({
      success: false,
      message:
        "Faltan datos: discapacidad, tipoDiscapacidad, subtipoDiscapacidad, tiene_condicion_salud, condicion_salud_id ",
    });
  }

  pool.query(
    "CALL pa_UpdateCondicionesEspeciales(?, ?, ?, ?, ?, ?, ?)",
    [
      id,
      discapacidad,
      tipoDiscapacidad,
      subtipoDiscapacidad,
      tieneCondicionSalud,
      condicionSaludId,
      idPersona,
    ],
    (error, results) => {
      if (error) {
        console.error("Error al actualizar condiciones especiales:", error);
        return res.status(500).json({
          success: false,
          error: "Error al actualizar condiciones especiales",
        });
      }

      res.status(200).json({
        success: true,
        message: "Condiciones especiales actualizada correctamente",
        data: {
          discapacidad,
          tipoDiscapacidad,
          subtipoDiscapacidad,
          tieneCondicionSalud,
          condicionSaludId,
          idPersona,
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
      message: "ID de condiciones especiales no proporcionado en el body",
    });
  }

  pool.query(
    "CALL pa_DeleteCondicionesEspeciales(?)",
    [id],
    (error, results) => {
      if (error) {
        console.error("Error al eliminar condiciones especiales:", error);
        return res.status(500).json({
          success: false,
          error: "Error al eliminar ubicacion",
        });
      }

      res.json({
        success: true,
        message: `Condiciones especiales con ID ${id} eliminada correctamente`,
      });
    }
  );
};

module.exports = {
  getAllMethod,
  getMethod,
  postMethod,
  putMethod,
  deleteMethod,
};
