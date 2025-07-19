const { Router } = require("express");

const router = Router();

const {
  getAllMethod,
  getMethod,
  postMethod,
  putMethod,
  deleteMethod,
} = require("../controllers/ubicaciones");

/**
 * @swagger
 * /api/ubicaciones/{id}:
 *   get:
 *     tags:
 *       - Ubicaciones
 *     summary: Obtener una ubicación por su ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: int
 *         description: ID de la ubicación
 *     responses:
 *       200:
 *         description: Ubicación obtenida correctamente
 *       404:
 *         description: Ubicación no encontrada
 *       500:
 *         description: Error al obtener ubicación (Contactar equipo de API)
 */
//Devolver un solo producto por ID
router.get("/id/:id", getMethod);

/**
 * @swagger
 * /api/ubicaciones:
 *   get:
 *     tags:
 *       - Ubicaciones
 *     summary: Obtener todas las ubicaciones
 *     responses:
 *       200:
 *         description: Lista de ubicaciones obtenida correctamente
 *       500:
 *         description: Error al obtener ubicaciones (Contactar equipo de API)
 */
//Devuelve todos los productos
router.get("/all", getAllMethod);

/**
 * @swagger
 * /api/ubicaciones:
 *   post:
 *     tags:
 *       - Ubicaciones
 *     summary: Insertar una nueva ubicación
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
 *               - direccion
 *             properties:
 *               provincia:
 *                 type: string
 *               canton:
 *                 type: string
 *               distrito:
 *                 type: string
 *               direccion:
 *                 type: string
 *               idFamilia:
 *                 type: integer
 *                 nullable: true
 *               idAlbergue:
 *                 type: integer
 *                 nullable: true
 *               idMunicipalidad:
 *                 type: integer
 *                 nullable: true
 *     responses:
 *       201:
 *         description: Ubicación insertada correctamente
 *       400:
 *         description: Datos faltantes
 *       500:
 *         description: Error al insertar ubicación (Contactar equipo de API)
 */
// Registrar o insertar
router.post("/", postMethod);

/**
 * @swagger
 * /api/ubicaciones/{id}:
 *   delete:
 *     tags:
 *       - Ubicaciones
 *     summary: Eliminar una ubicación por su ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: int
 *         description: ID de la ubicación a eliminar
 *     responses:
 *       200:
 *         description: Ubicación eliminada correctamente
 *       400:
 *         description: ID no proporcionado
 *       500:
 *         description: Error al eliminar ubicación (Contactar equipo de API)
 */
// //Eliminar
router.delete("/id/:id", deleteMethod);

/**
 * @swagger
 * /api/ubicaciones:
 *   put:
 *     tags:
 *       - Ubicaciones
 *     summary: Actualizar una ubicación existente
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *               - provincia
 *               - canton
 *               - distrito
 *               - direccion
 *               - idFamilia
 *               - idAlbergue
 *               - idMunicipalidad
 *             properties:
 *               id:
 *                 type: int
 *               provincia:
 *                 type: string
 *               canton:
 *                 type: string
 *               distrito:
 *                 type: string
 *               direccion:
 *                 type: string
 *               idFamilia:
 *                 type: int
 *               idAlbergue:
 *                 type: int
 *               idMunicipalidad:
 *                 type: int
 *     responses:
 *       200:
 *         description: Ubicación actualizada correctamente
 *       400:
 *         description: Datos faltantes en el cuerpo de la solicitud
 *       500:
 *         description: Error al actualizar ubicación (Contactar equipo de API)
 */
// //Actualizar
router.put("/", putMethod);

module.exports = router;
