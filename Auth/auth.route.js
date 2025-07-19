// Auth/auth.route.js
const { Router } = require('express');
const AuthController = require('./auth.controller');
const contrasenaController = require('./ContrasenaOlvidada'); // Actualizado el nombre del archivo
const router = Router();

/**
 * @swagger
 * tags:
 *   - name: Autenticación
 *     description: Operaciones relacionadas con el login y registro de usuarios
 *   - name: Recuperación de Contraseña
 *     description: Operaciones para recuperar contraseña sin autenticación
 */

// ==================== RUTAS PÚBLICAS (SIN TOKEN) ====================

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     tags:
 *       - Autenticación
 *     summary: Iniciar sesión y obtener token JWT
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - correo
 *               - contrasena
 *             properties:
 *               correo:
 *                 type: string
 *                 example: usuario@email.com
 *               contrasena:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: Autenticación exitosa
 *       400:
 *         description: Correo o contraseña faltante
 *       401:
 *         description: Usuario no encontrado o contraseña incorrecta
 *       403:
 *         description: Cuenta inactiva
 *       500:
 *         description: Error interno del servidor
 */
router.post('/login', AuthController.login);

/**
 * @swagger
 * /api/auth/refresh-token:
 *   post:
 *     tags:
 *       - Autenticación
 *     summary: Renovar token de acceso usando refresh token
 *     description: Renueva el access token usando el refresh token almacenado en cookies
 *     responses:
 *       200:
 *         description: Token renovado exitosamente
 *       401:
 *         description: Refresh token no encontrado
 *       403:
 *         description: Refresh token inválido o expirado
 *       500:
 *         description: Error interno del servidor
 */
router.post('/refresh-token', AuthController.refreshToken);

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     tags:
 *       - Autenticación
 *     summary: Cerrar sesión y revocar tokens
 *     description: Cierra la sesión del usuario y revoca el refresh token
 *     responses:
 *       200:
 *         description: Sesión cerrada exitosamente
 *       500:
 *         description: Error interno del servidor
 */
router.post('/logout', AuthController.logout);

// ==================== RUTAS DE RECUPERACIÓN DE CONTRASEÑA (SIN TOKEN) ====================

/**
 * @swagger
 * /api/auth/validate-email:
 *   post:
 *     tags:
 *       - Recuperación de Contraseña
 *     summary: Validar si un correo existe en el sistema
 *     description: Valida si el correo existe en el sistema (el envío de correo se hace desde frontend)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - correo
 *             properties:
 *               correo:
 *                 type: string
 *                 format: email
 *                 example: usuario@email.com
 *     responses:
 *       200:
 *         description: Resultado de la validación del correo
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 emailExists:
 *                   type: boolean
 *                 userId:
 *                   type: integer
 *                 nombreUsuario:
 *                   type: string
 *       400:
 *         description: Correo electrónico es requerido o formato inválido
 *       500:
 *         description: Error interno del servidor
 */
router.post('/validate-email', contrasenaController.validateEmail);

/**
 * @swagger
 * /api/auth/change-password:
 *   post:
 *     tags:
 *       - Recuperación de Contraseña
 *     summary: Cambiar contraseña con código de verificación
 *     description: Cambia la contraseña del usuario después de validar el código (validación del código en frontend)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - correo
 *               - codigo
 *               - nuevaContrasena
 *             properties:
 *               correo:
 *                 type: string
 *                 format: email
 *                 example: usuario@email.com
 *               codigo:
 *                 type: string
 *                 example: "123456"
 *               nuevaContrasena:
 *                 type: string
 *                 minLength: 6
 *                 example: "nuevaContrasena123"
 *     responses:
 *       200:
 *         description: Contraseña actualizada exitosamente
 *       400:
 *         description: Datos faltantes, usuario no encontrado o contraseña muy corta
 *       500:
 *         description: Error interno del servidor
 */
router.post('/change-password', contrasenaController.changePasswordWithCode);

/**
 * @swagger
 * /api/auth/validate:
 *   get:
 *     tags:
 *       - Autenticación
 *     summary: Verificar validez de token JWT
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Token válido
 *       401:
 *         description: Token inválido o no proporcionado
 */
router.get('/validate', AuthController.verifyToken, (req, res) => {
    res.json({
        success: true,
        message: 'Token válido',
        usuario: req.usuario
    });
});

// ==================== RUTAS PROTEGIDAS (REQUIEREN TOKEN) ====================
// Aplicar middleware de autenticación a todas las rutas siguientes
router.use(AuthController.verifyToken);

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     tags:
 *       - Autenticación
 *     summary: Registrar un nuevo usuario (Solo administradores)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombreUsuario
 *               - correo
 *               - contrasena
 *             properties:
 *               nombreUsuario:
 *                 type: string
 *                 example: admin123
 *               correo:
 *                 type: string
 *                 format: email
 *                 example: admin@example.com
 *               contrasena:
 *                 type: string
 *                 example: "123456"
 *               rol:
 *                 type: string
 *                 enum: [usuario, admin]
 *                 example: usuario
 *               idMunicipalidad:
 *                 type: integer
 *                 nullable: true
 *                 example: 1
 *               identificacion:
 *                 type: string
 *                 nullable: true
 *                 example: "506290123"
 *     responses:
 *       201:
 *         description: Usuario creado exitosamente
 *       400:
 *         description: Faltan campos obligatorios
 *       401:
 *         description: Token no válido
 *       403:
 *         description: Acceso denegado - Se requiere rol de administrador
 *       409:
 *         description: El usuario ya existe
 *       500:
 *         description: Error interno del servidor
 */
router.post('/register', (req, res, next) => {
    if (req.usuario.rol !== 'admin') {
        return res.status(403).json({
            success: false,
            error: 'Acceso denegado. Se requiere rol de administrador'
        });
    }
    next();
}, AuthController.register);

/**
 * @swagger
 * /api/auth/sessions:
 *   get:
 *     tags:
 *       - Autenticación
 *     summary: Obtener sesiones activas del usuario
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de sesiones activas
 *       401:
 *         description: Token no válido
 *       500:
 *         description: Error interno del servidor
 */
router.get('/sessions', AuthController.getUserSessions);

/**
 * @swagger
 * /api/auth/sessions/{sessionId}:
 *   delete:
 *     tags:
 *       - Autenticación
 *     summary: Revocar una sesión específica
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: sessionId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la sesión a revocar
 *     responses:
 *       200:
 *         description: Sesión revocada exitosamente
 *       401:
 *         description: Token no válido
 *       404:
 *         description: Sesión no encontrada
 *       500:
 *         description: Error interno del servidor
 */
router.delete('/sessions/:sessionId', AuthController.revokeSession);

/**
 * @swagger
 * /api/auth/revoke-all-sessions:
 *   post:
 *     tags:
 *       - Autenticación
 *     summary: Revocar todas las otras sesiones del usuario
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Todas las otras sesiones han sido revocadas
 *       401:
 *         description: Token no válido
 *       500:
 *         description: Error interno del servidor
 */
router.post('/revoke-all-sessions', AuthController.revokeAllOtherSessions);

/**
 * @swagger
 * /api/auth/cleanup-tokens:
 *   post:
 *     tags:
 *       - Autenticación
 *     summary: Limpiar tokens expirados (Solo administradores)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Tokens expirados limpiados exitosamente
 *       401:
 *         description: Token no válido
 *       403:
 *         description: Acceso denegado - Se requiere rol de administrador
 *       500:
 *         description: Error interno del servidor
 */
router.post('/cleanup-tokens', (req, res, next) => {
    if (req.usuario.rol !== 'admin') {
        return res.status(403).json({
            success: false,
            error: 'Acceso denegado. Se requiere rol de administrador'
        });
    }
    next();
}, async (req, res) => {
    try {
        const result = await AuthController.cleanupExpiredTokens();
        
        if (result) {
            res.json({
                success: true,
                message: 'Tokens expirados limpiados exitosamente'
            });
        } else {
            res.status(500).json({
                success: false,
                error: 'Error al limpiar tokens expirados'
            });
        }
    } catch (error) {
        console.error('Error en cleanup-tokens:', error);
        res.status(500).json({
            success: false,
            error: 'Error interno del servidor'
        });
    }
});

module.exports = router;