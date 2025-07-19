const {Router}=require('express');

const router=Router();


const {
  getMethod,
  postMethod,
  putMethod,
  getAllMethod,
  deleteMethod}=require('../controllers/unidadMedidas');

  /**
 * @swagger
 * /api/unidades/{id}:
 *   get:
 *     tags:
 *       - Unidades de Medida
 *     summary: Obtener una unidad de medida por su ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la unidad de medida
 *     responses:
 *       200:
 *         description: Unidad de medida obtenida correctamente
 *       404:
 *         description: Unidad de medida no encontrada
 *       500:
 *         description: Error al obtener unidad de medida (Contactar equipo de API)
 */
//Devolver datos desde mi API
router.get('/id/:id',   getMethod);

/**
 * @swagger
 * /api/unidades-medida:
 *   post:
 *     tags:
 *       - Unidades de Medida
 *     summary: Insertar una nueva unidad de medida
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre
 *             properties:
 *               nombre:
 *                 type: string
 *               idConsumible:
 *                 type: integer
 *                 nullable: true
 *     responses:
 *       201:
 *         description: Unidad insertada correctamente
 *       400:
 *         description: Datos faltantes
 *       500:
 *         description: Error al insertar unidad de medida (Contactar equipo de API)
 */
//Registrar o insertar
router.post('/',  postMethod);


/**
 * @swagger
 * /api/unidades:
 *   put:
 *     tags:
 *       - Unidades de Medida
 *     summary: Actualizar una unidad de medida existente
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *               - nombre
 *               - idConsumible
 *             properties:
 *               id:
 *                 type: integer
 *               nombre:
 *                 type: string
 *               idConsumible:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Unidad de medida actualizada correctamente
 *       400:
 *         description: Datos faltantes
 *       500:
 *         description: Error al actualizar unidad de medida (Contactar equipo de API)
 */
//Registrar o insertar
router.put('/',  putMethod);

/**
 * @swagger
 * /api/unidades/{id}:
 *   delete:
 *     tags:
 *       - Unidades de Medida
 *     summary: Eliminar una unidad de medida por su ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la unidad de medida a eliminar
 *     responses:
 *       200:
 *         description: Unidad de medida eliminada correctamente
 *       400:
 *         description: ID no proporcionado
 *       500:
 *         description: Error al eliminar unidad de medida (Contactar equipo de API)
 */
//Eliminar
router.delete('/id/:id', deleteMethod);

/**
 * @swagger
 * /api/unidades:
 *   get:
 *     tags:
 *       - Unidades de Medida
 *     summary: Obtener todas las unidades de medida
 *     responses:
 *       200:
 *         description: Lista de unidades de medida obtenida correctamente
 *       500:
 *         description: Error al obtener unidades de medida (Contactar equipo de API)
 */
//Actualizar
router.get('/all',   getAllMethod);


module.exports=router;