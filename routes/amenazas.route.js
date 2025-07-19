const { Router } = require('express');
const router = Router();

const {
  getAllMethod,
  getMethod,
  postMethod,
  putMethod,
  deleteMethod,
} = require('../controllers/amenazas');

/**
 * @swagger
 * /api/amenazas/id/{id}:
 *   get:
 *     tags:
 *       - Amenazas
 *     summary: Obtener una amenaza por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la amenaza
 *     responses:
 *       200:
 *         description: Amenaza obtenida exitosamente
 *       404:
 *         description: Amenaza no encontrada
 *       500:
 *         description: Error interno del servidor (Contactar con equipo de API)
 */
router.get('/id/:id', getMethod);

/**
 * @swagger
 * /api/amenazas/all:
 *   get:
 *     tags:
 *       - Amenazas
 *     summary: Obtener todas las amenazas
 *     responses:
 *       200:
 *         description: Lista de todas las amenazas
 *       500:
 *         description: Error al obtener las amenazas (Contactar equipo de API)
 */
router.get('/all', getAllMethod);

/**
 * @swagger
 * /api/amenazas:
 *   post:
 *     tags:
 *       - Amenazas
 *     summary: Insertar una nueva amenaza
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - familiaEvento
 *               - evento
 *               - peligro
 *             properties:
 *               familiaEvento:
 *                 type: string
 *               evento:
 *                 type: string
 *               peligro:
 *                 type: string
 *     responses:
 *       201:
 *         description: Amenaza insertada correctamente
 *       400:
 *         description: Datos faltantes u obligatorios no proporcionados
 *       500:
 *         description: Error interno del servidor (Contactar con equipo de API)
 */
router.post('/', postMethod);

/**
 * @swagger
 * /api/amenazas:
 *   post:
 *     tags:
 *       - Amenazas
 *     summary: Insertar una nueva amenaza
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - familiaEvento
 *               - evento
 *             properties:
 *               familiaEvento:
 *                 type: string
 *               evento:
 *                 type: string
 *               peligro:
 *                 type: string
 *                 nullable: true
 *               idFamilia:
 *                 type: integer
 *                 nullable: true
 *               idUsuarioCreacion:
 *                 type: integer
 *                 nullable: true
 *     responses:
 *       201:
 *         description: Amenaza insertada correctamente
 *       400:
 *         description: "Faltan datos: familiaEvento, evento"
 *       500:
 *         description: Error al insertar amenaza (Contactar equipo de API)
 */
router.put('/', putMethod);

/**
 * @swagger
 * /api/amenazas/id/{id}:
 *   delete:
 *     tags:
 *       - Amenazas
 *     summary: Eliminar una amenaza por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la amenaza a eliminar
 *     responses:
 *       200:
 *         description: Amenaza eliminada correctamente
 *       400:
 *         description: ID no proporcionado
 *       500:
 *         description: Error al eliminar la amenaza (Contactar equipo de API)
 */
router.delete('/id/:id', deleteMethod);

module.exports = router;
