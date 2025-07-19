const { Router } = require('express');
const router = Router();

const {
  getAllMethod,
  getMethod,
  putMethod,
  deleteMethod
} = require('../controllers/personas');

const {postMethod} = require('../controllers/formularioPersonas');

/**
 * @swagger
 * /api/personas/all:
 *   get:
 *     tags:
 *       - Personas
 *     summary: Obtener todas las personas
 *     responses:
 *       200:
 *         description: Personas obtenidas correctamente
 *       500:
 *         description: Error interno del servidor (Contactar con equipo de API)
 */
router.get('/all', getAllMethod);

/**
 * @swagger
 * /api/personas/id/{id}:
 *   get:
 *     tags:
 *       - Personas
 *     summary: Obtener persona por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la persona
 *     responses:
 *       200:
 *         description: Persona encontrada
 *       404:
 *         description: Persona no encontrada
 *       500:
 *         description: Error interno del servidor (Contactar con equipo de API)
 */
router.get('/id/:id', getMethod);

/**
 * @swagger
 * /api/personas:
 *   post:
 *     tags:
 *       - Personas
 *     summary: Insertar una nueva persona
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - tieneCondicionSalud
 *               - discapacidad
 *               - firma
 *               - idFamilia
 *               - nombre
 *               - primerApellido
 *               - segundoApellido
 *               - tipoIdentificacion
 *               - numeroIdentificacion
 *               - nacionalidad
 *               - parentesco
 *               - esJefeFamilia
 *               - fechaNacimiento
 *               - genero
 *               - sexo
 *               - telefono
 *               - estaACargoMenor
 *             properties:
 *               tieneCondicionSalud:
 *                 type: boolean
 *               descripcionCondicionSalud:
 *                 type: string
 *                 nullable: true
 *               discapacidad:
 *                 type: boolean
 *               tipoDiscapacidad:
 *                 type: string
 *                 nullable: true
 *               subtipoDiscapacidad:
 *                 type: string
 *                 nullable: true
 *               paisOrigen:
 *                 type: string
 *                 nullable: true
 *               autoidentificacionCultural:
 *                 type: string
 *                 nullable: true
 *               puebloIndigena:
 *                 type: string
 *                 nullable: true
 *               firma:
 *                 type: string
 *               idFamilia:
 *                 type: integer
 *               nombre:
 *                 type: string
 *               primerApellido:
 *                 type: string
 *               segundoApellido:
 *                 type: string
 *               tipoIdentificacion:
 *                 type: string
 *               numeroIdentificacion:
 *                 type: string
 *               nacionalidad:
 *                 type: string
 *               parentesco:
 *                 type: string
 *               esJefeFamilia:
 *                 type: boolean
 *               fechaNacimiento:
 *                 type: string
 *                 format: date
 *               genero:
 *                 type: string
 *               sexo:
 *                 type: string
 *               telefono:
 *                 type: string
 *               contactoEmergencia:
 *                 type: string
 *                 nullable: true
 *               observaciones:
 *                 type: string
 *                 nullable: true
 *               estaACargoMenor:
 *                 type: boolean
 *               idUsuarioCreacion:
 *                 type: integer
 *                 nullable: true
 *     responses:
 *       201:
 *         description: Persona registrada correctamente
 *       400:
 *         description: Faltan datos requeridos
 *       500:
 *         description: Error al insertar persona
 */
router.post('/', postMethod);

/**
 * @swagger
 * /api/personas:
 *   put:
 *     tags:
 *       - Personas
 *     summary: Actualizar información de una persona
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *               - idFamilia
 *               - nombre
 *               - primerApellido
 *               - segundoApellido
 *               - tipoIdentificacion
 *               - numIdentificacion
 *               - nacionalidad
 *               - parentesco
 *               - fechaNacimiento
 *               - genero
 *               - sexo
 *               - telefono
 *               - idCondicionesEspeciales
 *               - idCondicionesPoblacionales
 *               - idFirma
 *               - contactoEmergencia
 *               - observaciones
 *               - idUsuarioCreacion
 *               - fechaCreacion
 *               - idUsuarioModificacion
 *               - fechaMofificacion
 *             properties:
 *               id: { type: integer }
 *               idFamilia: { type: string }
 *               nombre: { type: string }
 *               primerApellido: { type: string }
 *               segundoApellido: { type: string }
 *               tipoIdentificacion: { type: string }
 *               numIdentificacion: { type: string }
 *               nacionalidad: { type: string }
 *               parentesco: { type: string }
 *               fechaNacimiento: { type: string, format: date }
 *               genero: { type: string }
 *               sexo: { type: string }
 *               telefono: { type: string }
 *               idCondicionesEspeciales: { type: integer }
 *               idCondicionesPoblacionales: { type: integer }
 *               idFirma: { type: integer }
 *               contactoEmergencia: { type: string }
 *               observaciones: { type: string }
 *               idUsuarioCreacion: { type: integer }
 *               fechaCreacion: { type: string, format: date-time }
 *               idUsuarioModificacion: { type: integer }
 *               fechaMofificacion: { type: string, format: date-time }
 *     responses:
 *       200:
 *         description: Persona actualizada correctamente
 *       400:
 *         description: Datos faltantes
 *       500:
 *         description: Error interno del servidor (Contactar con equipo de API)
 */
router.put('/', putMethod);

/**
 * @swagger
 * /api/personas/id/{id}:
 *   delete:
 *     tags:
 *       - Personas
 *     summary: Eliminar persona por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la persona
 *     responses:
 *       200:
 *         description: Persona eliminada correctamente
 *       500:
 *         description: Error al eliminar persona (Contactar equipo de API)
 */
router.delete('/id/:id', deleteMethod);

module.exports = router;
