const {Router}=require('express');

const router=Router();


const {
  getMethod,
  postMethod,
  putMethod,
  getAllMethod,
  deleteMethod}=require('../controllers/referencias');

  /**
 * @swagger
 * /api/referencias/{id}:
 *   get:
 *     tags:
 *       - Referencias
 *     summary: Obtener una referencia por su ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la referencia
 *     responses:
 *       200:
 *         description: Referencia obtenida correctamente
 *       404:
 *         description: Referencia no encontrada
 *       500:
 *         description: Error al obtener referencia (Contactar equipo de API)
 */
//Devolver datos desde mi API
router.get('/id/:id',   getMethod);

/**
 * @swagger
 * /api/referencias:
 *   post:
 *     tags:
 *       - Referencias
 *     summary: Insertar una nueva referencia de ayuda
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - idFamilia
 *               - tipoAyuda
 *               - fechaEntrega
 *             properties:
 *               idFamilia:
 *                 type: integer
 *               tipoAyuda:
 *                 type: string
 *               descripcion:
 *                 type: string
 *               fechaEntrega:
 *                 type: string
 *                 format: date
 *               responsable:
 *                 type: string
 *               idUsuarioCreacion:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Referencia insertada correctamente
 *       400:
 *         description: Datos faltantes
 *       500:
 *         description: Error al insertar referencia (Contactar equipo de API)
 */
//Registrar o insertar
router.post('/',  postMethod);

/**
 * @swagger
 * /api/referencias:
 *   put:
 *     tags:
 *       - Referencias
 *     summary: Actualizar una referencia existente
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *               - idFamilia
 *               - tipoAyuda
 *               - descripcion
 *               - fechaEntrega
 *               - responsable
 *               - idUsuarioCreacion
 *               - idUsuarioModificacion
 *             properties:
 *               id:
 *                 type: integer
 *               idFamilia:
 *                 type: integer
 *               tipoAyuda:
 *                 type: string
 *               descripcion:
 *                 type: string
 *               fechaEntrega:
 *                 type: string
 *                 format: date
 *               responsable:
 *                 type: string
 *               idUsuarioCreacion:
 *                 type: integer
 *               idUsuarioModificacion:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Referencia actualizada correctamente
 *       400:
 *         description: Datos faltantes
 *       500:
 *         description: Error al actualizar referencia (Contactar equipo de API)
 */
//Registrar o insertar
router.put('/',  putMethod);

/**
 * @swagger
 * /api/referencias/{id}:
 *   delete:
 *     tags:
 *       - Referencias
 *     summary: Eliminar una referencia por su ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la referencia a eliminar
 *     responses:
 *       200:
 *         description: Referencia eliminada correctamente
 *       400:
 *         description: ID no proporcionado
 *       500:
 *         description: Error al eliminar referencia (Contactar equipo de API)
 */
//Eliminar
router.delete('/id/:id', deleteMethod);

/**
 * @swagger
 * /api/referencias:
 *   get:
 *     tags:
 *       - Referencias
 *     summary: Obtener todas las referencias
 *     responses:
 *       200:
 *         description: Lista de referencias obtenida correctamente
 *       500:
 *         description: Error al obtener referencias (Contactar equipo de API)
 */
router.get('/all',   getAllMethod);


module.exports=router;