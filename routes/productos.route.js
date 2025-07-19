const {Router}= require('express');

const router=Router();

const {
  getAllMethod,
  getMethod,
  postMethod,
  putMethod,
  deleteMethod,
  }=require('../controllers/productos');


  /**
 * @swagger
 * /api/productos/id/{id}:
 *   get:
 *     tags:
 *       - Productos
 *     summary: Obtener un producto por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: int
 *         required: true
 *         description: ID del producto
 *     responses:
 *       200:
 *         description: producto obtenido exitosamente
 *       404:
 *         description: producto no encontrado
 *       500:
 *         description: Error interno del servidor (Contactar con equipo de API)
 */
//Devolver un solo producto por ID
router.get('/id/:id', getMethod);   
    

/**
 * @swagger
 * /api/productos/all:
 *   get:
 *     tags:
 *       - Productos
 *     summary: Obtener todos los productos
 *     responses:
 *       200:
 *         description: Lista de todos los productos
 *       500:
 *         description: Error al obtener los productos (Contactar equipo de API)
 */
//Devuelve todos los productos
router.get('/all', getAllMethod);             


/**
 * @swagger
 * /api/productos:
 *   post:
 *     tags:
 *       - Productos
 *     summary: Insertar un nuevo producto
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - codigoProducto
 *               - nombre
 *               - cantidad
 *             properties:
 *               codigoProducto:
 *                 type: string
 *               nombre:
 *                 type: string
 *               descripcion:
 *                 type: string
 *               cantidad:
 *                 type: number
 *               categoria:
 *                 type: integer
 *               unidadMedida:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Producto insertado correctamente
 *       400:
 *         description: Datos faltantes
 *       500:
 *         description: Error al insertar producto (Contactar equipo de API)
 */
router.post('/', postMethod);

/**
 * @swagger
 * /api/productos:
 *   put:
 *     tags:
 *       - Productos
 *     summary: Actualizar un producto existente
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *               - codigoProducto
 *               - nombre
 *               - descripcion
 *               - cantidad
 *               - categoria
 *               - unidadMedida
 *             properties:
 *               id:
 *                 type: int
 *               codigoProducto:
 *                 type: string
 *               nombre:
 *                 type: string
 *               descripcion:
 *                 type: string
 *               cantidad:
 *                 type: int
 *               categoria:
 *                 type: string
 *               unidadMedida:
 *                 type: string
 *     responses:
 *       200:
 *         description: Producto actualizado correctamente
 *       400:
 *         description: Datos faltantes en el cuerpo de la solicitud
 *       500:
 *         description: Error al actualizar producto (Contactar equipo de API)
 */
// //Actualizar
router.put('/',   putMethod);


/**
 * @swagger
 * /api/productos/id/{id}:
 *   delete:
 *     tags:
 *       - Productos
 *     summary: Eliminar un producto por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: int
 *         required: true
 *         description: ID del producto a eliminar
 *     responses:
 *       200:
 *         description: Producto eliminado correctamente
 *       400:
 *         description: ID no proporcionado
 *       500:
 *         description: Error al eliminar el producto (Contactar equipo de API)
 */
// //Eliminar
router.delete('/id/:id', deleteMethod);

module.exports=router;