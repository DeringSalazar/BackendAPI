const { request, response } = require("express");
const pool = require("../MySQL/basedatos"); // ajusta según la ruta real

// Insertar nueva persona
const postMethod = (req = request, res = response) => {
  let {
    tieneCondicionSalud,
    descripcionCondicionSalud,

    discapacidad,
    tipoDiscapacidad,
    subtipoDiscapacidad,

    paisOrigen,
    autoidentificacionCultural,
    puebloIndigena,

    firma,

    idFamilia,
    nombre,
    primerApellido,
    segundoApellido,
    tipoIdentificacion,
    numeroIdentificacion,
    nacionalidad,
    parentesco,
    esJefeFamilia,
    fechaNacimiento,
    genero,
    sexo,
    telefono,
    contactoEmergencia,
    observaciones,
    estaACargoMenor,
    idUsuarioCreacion,
  } = req.body;

  // Valores opcionales con default
  contactoEmergencia = contactoEmergencia ?? null;
  observaciones = observaciones ?? null;
  descripcionCondicionSalud = descripcionCondicionSalud ?? null;
  tipoDiscapacidad = tipoDiscapacidad ?? null;
  subtipoDiscapacidad = subtipoDiscapacidad ?? null;
  paisOrigen = paisOrigen ?? null;
  autoidentificacionCultural = autoidentificacionCultural ?? null;
  puebloIndigena = puebloIndigena ?? null;
  idUsuarioCreacion = idUsuarioCreacion ?? null;

  // Validación de campos obligatorios
  if (
    tieneCondicionSalud === undefined ||
    discapacidad === undefined ||
    firma === undefined ||
    idFamilia === undefined ||
    nombre === undefined ||
    primerApellido === undefined ||
    segundoApellido === undefined ||
    tipoIdentificacion === undefined ||
    numeroIdentificacion === undefined ||
    nacionalidad === undefined ||
    parentesco === undefined ||
    esJefeFamilia === undefined ||
    fechaNacimiento === undefined ||
    genero === undefined ||
    sexo === undefined ||
    telefono === undefined ||
    estaACargoMenor === undefined
    // || idUsuarioCreacion === undefined
  ) {
    return res.status(400).json({
      success: false,
      message: "Faltan datos requeridos",
      datosValidados: {
        tieneCondicionSalud,
        discapacidad,
        firma,
        idFamilia,
        nombre,
        primerApellido,
        segundoApellido,
        tipoIdentificacion,
        numeroIdentificacion,
        nacionalidad,
        parentesco,
        esJefeFamilia,
        fechaNacimiento,
        genero,
        sexo,
        telefono,
        estaACargoMenor,
        idUsuarioCreacion,
      },
    });
  }

  // Ejecutar el procedimiento almacenado
  pool.query(
    "CALL pa_InsertPersona(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
    [
      tieneCondicionSalud,
      descripcionCondicionSalud,
      discapacidad,
      tipoDiscapacidad,
      subtipoDiscapacidad,
      paisOrigen,
      autoidentificacionCultural,
      puebloIndigena,
      firma,
      idFamilia,
      nombre,
      primerApellido,
      segundoApellido,
      tipoIdentificacion,
      numeroIdentificacion,
      nacionalidad,
      parentesco,
      esJefeFamilia,
      fechaNacimiento,
      genero,
      sexo,
      telefono,
      contactoEmergencia,
      observaciones,
      estaACargoMenor,
      idUsuarioCreacion,
    ],
    (error, results) => {
      if (error) {
        console.error("Error en postPersona:", error);
        return res
          .status(500)
          .json({ success: false, error: "Error al insertar persona" });
      }

      res.status(201).json({
        success: true,
        message: "Persona registrada correctamente",
        data: { id: results[0][0].id },
      });
    }
  );
};

module.exports = {
  postMethod,
};
