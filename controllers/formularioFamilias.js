const { request, response } = require("express");
const pool = require("../MySQL/basedatos"); 

const postMethod = (req = request, res = response) => {
  let {
    provincia,
    canton,
    distrito,
    direccion,

    codigoFamilia,
    cantidadPersonas,
    idAlbergue,
    idAmenaza,
    idPersona, // puede ser null
    idUsuarioCreacion,
  } = req.body;

  // Valores opcionales
  idPersona = idPersona ?? null;
  idUsuarioCreacion = idUsuarioCreacion ?? null;
  direccion = direccion ?? null;

  // Validar campos obligatorios
  if (
    !provincia ||
    !canton ||
    !distrito ||
    !codigoFamilia ||
    cantidadPersonas === undefined ||
    idAlbergue === undefined ||
    idAmenaza === undefined
  ) {
    return res.status(400).json({
      success: false,
      message:
        "Faltan datos requeridos: provincia, canton, distrito, codigoFamilia, cantidadPersonas, idAlbergue, idAmenaza",
      datosRecibidos: {
        provincia,
        canton,
        distrito,
        direccion,
        codigoFamilia,
        cantidadPersonas,
        idAlbergue,
        idAmenaza,
        idPersona,
        idUsuarioCreacion,
      },
    });
  }

  // Ejecutar procedimiento almacenado
  pool.query(
    "CALL pa_InsertFamilia(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
    [
      provincia,
      canton,
      distrito,
      direccion,
      codigoFamilia,
      cantidadPersonas,
      idAlbergue,
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
        },
      });
    }
  );
};

module.exports = {
  postMethod,
};
