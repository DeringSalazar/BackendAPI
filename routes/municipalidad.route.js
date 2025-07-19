const {Router}= require('express');

const router=Router();

const {
  getAllMethod,
  getMethod,
  postMethod,
  putMethod,
  deleteMethod,
  }=require('../controllers/municipalidad');


  /**
 * @swagger
 * /api/municipalidades/{id}:
 *   get:
 *     tags:
 *       - Municipalidades
 *     summary: Obtener una municipalidad por su ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: int
 *         description: ID de la municipalidad
 *     responses:
 *       200:
 *         description: Municipalidad obtenida correctamente
 *       404:
 *         description: Municipalidad no encontrada
 *       500:
 *         description: Error al obtener municipalidad (Contactar equipo de API)
 */
//Devolver un solo producto por ID
router.get('/id/:id', getMethod);   
    

/**
 * @swagger
 * /api/municipalidades:
 *   get:
 *     tags:
 *       - Municipalidades
 *     summary: Obtener todas las municipalidades
 *     responses:
 *       200:
 *         description: Lista de municipalidades obtenida correctamente
 *       500:
 *         description: Error al obtener municipalidades (Contactar equipo de API)
 */
//Devuelve todos los productos
router.get('/all', getAllMethod);             

/**
 * @swagger
 * /api/municipalidades:
 *   post:
 *     tags:
 *       - Municipalidades
 *     summary: Insertar una nueva municipalidad
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre
 *               - idUbicacion
 *             properties:
 *               nombre:
 *                 type: string
 *               idUbicacion:
 *                 type: integer
 *               telefono:
 *                 type: string
 *                 nullable: true
 *               correo:
 *                 type: string
 *                 nullable: true
 *               idAlbergue:
 *                 type: integer
 *                 nullable: true
 *               idUsuario:
 *                 type: integer
 *                 nullable: true
 *               idUsuarioCreacion:
 *                 type: integer
 *                 nullable: true
 *               idUsuarioModificacion:
 *                 type: integer
 *                 nullable: true
 *     responses:
 *       201:
 *         description: Municipalidad insertada correctamente
 *       400:
 *         description: Datos faltantes
 *       500:
 *         description: Error al insertar municipalidad (Contactar equipo de API)
 */
// Registrar o insertar
router.post('/', postMethod);

/**
 * @swagger
 * /api/municipalidades/{id}:
 *   delete:
 *     tags:
 *       - Municipalidades
 *     summary: Eliminar una municipalidad por su ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: int
 *         description: ID de la municipalidad
 *     responses:
 *       200:
 *         description: Municipalidad eliminada correctamente
 *       400:
 *         description: ID no proporcionado
 *       500:
 *         description: Error al eliminar municipalidad (Contactar equipo de API)
 */
// //Eliminar
router.delete('/id/:id', deleteMethod);

/**
 * @swagger
 * /api/municipalidades:
 *   put:
 *     tags:
 *       - Municipalidades
 *     summary: Actualizar una municipalidad existente
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *               - nombre
 *               - idUbicacion
 *               - telefono
 *               - correo
 *               - idAlbergue
 *               - idUsuario
 *               - idUsuarioCreacion
 *               - idUsuarioModificacion
 *             properties:
 *               id:
 *                 type: string
 *               nombre:
 *                 type: string
 *               idUbicacion:
 *                 type: string
 *               telefono:
 *                 type: string
 *               correo:
 *                 type: string
 *               idAlbergue:
 *                 type: int
 *               idUsuario:
 *                 type: int
 *               idUsuarioCreacion:
 *                 type: int
 *               idUsuarioModificacion:
 *                 type: int
 *     responses:
 *       200:
 *         description: Municipalidad actualizada correctamente
 *       400:
 *         description: Datos faltantes en el cuerpo de la solicitud
 *       500:
 *         description: Error al actualizar municipalidad (Contactar equipo de API)
 */
// //Actualizar
router.put('/',   putMethod);

module.exports=router;