const { Router } = require('express');
const router = Router();

const {
  getAllMethod,
  getMethod,
  postMethod,
  putMethod,
  deleteMethod
} = require('../controllers/pedidoConsumibles');

/**
 * @swagger
 * /api/pedidoConsumibles/all:
 *   get:
 *     tags:
 *       - PedidoConsumibles
 *     summary: Obtener todos los pedidos de consumibles
 *     responses:
 *       200:
 *         description: Pedidos obtenidos correctamente
 *       500:
 *         description: Error interno del servidor (Contactar con equipo de API)
 */
router.get('/all', getAllMethod);

/**
 * @swagger
 * /api/pedidoConsumibles/id/{id}:
 *   get:
 *     tags:
 *       - PedidoConsumibles
 *     summary: Obtener pedido consumible por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del pedido consumible
 *     responses:
 *       200:
 *         description: Pedido encontrado correctamente
 *       400:
 *         description: Falta el ID
 *       404:
 *         description: Pedido no encontrado
 *       500:
 *         description: Error interno del servidor (Contactar con equipo de API)
 */
router.get('/id/:id', getMethod);

/**
 * @swagger
 * /api/pedidoConsumibles:
 *   post:
 *     tags:
 *       - PedidoConsumibles
 *     summary: Insertar un nuevo pedido consumible
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - tipoComida
 *               - cantidadPersonas
 *               - idAlbergue
 *             properties:
 *               tipoComida:
 *                 type: string
 *               cantidadPersonas:
 *                 type: integer
 *               idConsumible:
 *                 type: integer
 *                 nullable: true
 *               idAlbergue:
 *                 type: integer
 *               idUsuarioCreacion:
 *                 type: integer
 *                 nullable: true
 *     responses:
 *       201:
 *         description: Pedido consumible insertado correctamente
 *       400:
 *         description: Datos faltantes
 *       500:
 *         description: Error al insertar pedido consumible (Contactar equipo de API)
 */
router.post('/', postMethod);

/**
 * @swagger
 * /api/pedidoConsumibles:
 *   put:
 *     tags:
 *       - PedidoConsumibles
 *     summary: Actualizar un pedido de consumibles
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *               - fechaCreacion
 *               - tipoComida
 *               - cantidadPersonas
 *               - idAlbergue
 *               - idUsuarioCreacion
 *               - fechaCreacionUsuario
 *               - idUsuarioModificacion
 *               - fechaModificacionUsuario
 *             properties:
 *               id:
 *                 type: integer
 *               fechaCreacion:
 *                 type: string
 *                 format: date
 *               tipoComida:
 *                 type: string
 *               cantidadPersonas:
 *                 type: integer
 *               idAlbergue:
 *                 type: integer
 *               idUsuarioCreacion:
 *                 type: integer
 *               fechaCreacionUsuario:
 *                 type: date
 *                 format: date-time
 *                 description: Fecha de creación del usuario (aaaaa-mm-dd)
 *               idUsuarioModificacion:
 *                 type: string
 *               fechaModificacionUsuario:
 *                 type: date
 *                 format: date-time
 *                 description: Fecha de modificación del usuario (aaaaa-mm-dd)
 *     responses:
 *       200:
 *         description: Pedido actualizado correctamente
 *       400:
 *         description: Datos faltantes
 *       500:
 *         description: Error interno del servidor (Contactar con equipo de API)
 */
router.put('/', putMethod);

/**
 * @swagger
 * /api/pedidoConsumibles/id/{id}:
 *   delete:
 *     tags:
 *       - PedidoConsumibles
 *     summary: Eliminar un pedido de consumibles por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del pedido consumible
 *     responses:
 *       200:
 *         description: Pedido eliminado correctamente
 *       400:
 *         description: Falta el ID
 *       500:
 *         description: Error interno del servidor (Contactar con equipo de API)
 */
router.delete('/id/:id', deleteMethod);

module.exports = router;
