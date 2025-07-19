// Auth/PasswordRecoveryController.js
require('dotenv').config();
const bcrypt = require('bcryptjs');
const { pool } = require('../MySQL/basedatos');
const AuthController = require('./auth.controller');

class contrasenaController {

    // ==================== ENDPOINTS PÚBLICOS (SIN TOKEN) ====================

    // Validar correo 
    static async validateEmail(req, res) {
        const { correo } = req.body;

        try {
            // Validar que se envíe el correo
            if (!correo) {
                return res.status(400).json({
                    success: false,
                    error: 'Correo electrónico es requerido'
                });
            }

            // Validar formato de correo básico
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(correo)) {
                return res.status(400).json({
                    success: false,
                    error: 'Formato de correo electrónico inválido'
                });
            }

            // Verificar si el usuario existe y está activo
            const usuario = await AuthController.findUserByEmail(correo);

            if (!usuario) {
                // Por seguridad, no revelamos si el correo existe o no
                return res.json({
                    success: true,
                    message: 'Si el correo está registrado, deberías recibir un código de verificación',
                    emailExists: false // Para uso interno del frontend
                });
            }

            // Si existe, devolver éxito
            res.json({
                success: true,
                message: 'Correo válido, puedes proceder con el código de verificación',
                emailExists: true,
                userId: usuario.id, // Para usar en el siguiente paso
                nombreUsuario: usuario.nombreUsuario // Para personalizar el mensaje
            });

        } catch (error) {
            console.error('Error en validateEmail:', error);
            res.status(500).json({
                success: false,
                error: 'Error interno del servidor'
            });
        }
    }

    // Cambiar contraseña con código de verificación 
    static async changePasswordWithCode(req, res) {
        const { correo, codigo, nuevaContrasena } = req.body;

        try {
            // Validar que se envíen todos los datos
            if (!correo || !codigo || !nuevaContrasena) {
                return res.status(400).json({
                    success: false,
                    error: 'Correo, código y nueva contraseña son requeridos'
                });
            }

            // Validar longitud mínima de contraseña
            if (nuevaContrasena.length < 6) {
                return res.status(400).json({
                    success: false,
                    error: 'La nueva contraseña debe tener al menos 6 caracteres'
                });
            }

            // Validar formato de correo básico
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(correo)) {
                return res.status(400).json({
                    success: false,
                    error: 'Formato de correo electrónico inválido'
                });
            }

            // Verificar que el usuario existe y está activo - CORREGIDO
            const usuario = await AuthController.findUserByEmail(correo);
            if (!usuario) {
                return res.status(400).json({
                    success: false,
                    error: 'Usuario no encontrado o inactivo'
                });
            }

            // Hashear la nueva contraseña
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(nuevaContrasena, saltRounds);

            // Actualizar la contraseña en la base de datos
            await new Promise((resolve, reject) => {
                const query = 'UPDATE Usuario SET contrasenaHash = ?, ultimaActualizacion = NOW() WHERE id = ?';
                
                pool.query(query, [hashedPassword, usuario.id], (error, results) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(results);
                    }
                });
            });

            // Revocar todos los refresh tokens del usuario por seguridad
            try {
                await AuthController.revokeUserRefreshTokens(usuario.id);
            } catch (tokenError) {
                console.error('Error revocando tokens:', tokenError);
                // No fallar la operación si hay error con los tokens
            }

            res.json({
                success: true,
                message: 'Contraseña actualizada exitosamente'
            });

        } catch (error) {
            console.error('Error en changePasswordWithCode:', error);
            res.status(500).json({
                success: false,
                error: 'Error interno del servidor'
            });
        }
    }
}

module.exports = contrasenaController;