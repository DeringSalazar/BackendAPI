const { Router } = require('express');
const router = Router();

const {
  getAllMethod,
  getMethod,
  putMethod,
  deleteMethod,
} = require('../controllers/familias');

const { postMethod } = require('../controllers/formularioFamilias');

/**
 * @swagger
 * /api/familias/id/{id}:
 *   get:
 *     tags:
 *       - Familias
 *     summary: Obtener una familia por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la familia
 *     responses:
 *       200:
 *         description: Familia obtenida exitosamente
 *       404:
 *         description: Familia no encontrada
 *       500:
 *         description: Error al obtener familia (Contactar equipo de API)
 */
router.get('/id/:id', getMethod);

/**
 * @swagger
 * /api/familias/all:
 *   get:
 *     tags:
 *       - Familias
 *     summary: Obtener todas las familias
 *     responses:
 *       200:
 *         description: Lista de familias
 *       500:
 *         description: Error al obtener familias (Contactar equipo de API)
 */
router.get('/all', getAllMethod);

/**
 * @swagger
 * /api/familias:
 *   post:
 *     tags:
 *       - Familias
 *     summary: Insertar una nueva familia
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - provincia
 *               - canton
 *               - distrito
 *               - codigoFamilia
 *               - cantidadPersonas
 *               - idAlbergue
 *               - idAmenaza
 *             properties:
 *               provincia:
 *                 type: string
 *                 example: "San José"
 *               canton:
 *                 type: string
 *                 example: "Central"
 *               distrito:
 *                 type: string
 *                 example: "Carmen"
 *               direccion:
 *                 type: string
 *                 nullable: true
 *                 example: "Del parque 200m al sur"
 *               codigoFamilia:
 *                 type: string
 *                 example: "FAM12345"
 *               cantidadPersonas:
 *                 type: integer
 *                 example: 4
 *               idAlbergue:
 *                 type: integer
 *                 example: 2
 *               idAmenaza:
 *                 type: integer
 *                 example: 5
 *               idPersona:
 *                 type: integer
 *                 nullable: true
 *                 example: 10
 *               idUsuarioCreacion:
 *                 type: integer
 *                 nullable: true
 *                 example: 1
 *     responses:
 *       201:
 *         description: Familia insertada correctamente
 *       400:
 *         description: Datos faltantes
 *       500:
 *         description: Error al insertar familia (Contactar equipo de API)
 */
router.post('/', postMethod);


/**
 * @swagger
 * /api/familias:
 *   put:
 *     tags:
 *       - Familias
 *     summary: Actualizar una familia existente
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *               - codigoFamilia
 *               - cantidadPersonas
 *               - idAlbergue
 *               - idUbicacion
 *               - idAmenaza
 *             properties:
 *               id:
 *                 type: string
 *               codigoFamilia:
 *                 type: string
 *               cantidadPersonas:
 *                 type: integer
 *               idAlbergue:
 *                 type: string
 *               idUbicacion:
 *                 type: string
 *               idAmenaza:
 *                 type: string
 *     responses:
 *       200:
 *         description: Familia actualizada correctamente
 *       400:
 *         description: Datos faltantes
 *       500:
 *         description: Error al actualizar familia (Contactar equipo de API)
 */
router.put('/', putMethod);

/**
 * @swagger
 * /api/familias/id/{id}:
 *   delete:
 *     tags:
 *       - Familias
 *     summary: Eliminar una familia por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la familia a eliminar
 *     responses:
 *       200:
 *         description: Familia eliminada correctamente
 *       400:
 *         description: ID no proporcionado
 *       500:
 *         description: Error al eliminar familia (Contactar equipo de API)
 */
router.delete('/id/:id', deleteMethod);

module.exports = router;
