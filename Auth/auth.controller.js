// Auth/AuthController.js
require('dotenv').config();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { pool } = require('../MySQL/basedatos'); // Ajusta la ruta según tu estructura
console.log('=== DEBUG ENV ===');
console.log('SECRET_KEY:', process.env.SECRET_KEY);
console.log('PORT:', process.env.PORT);
console.log('=================');
const { SECRET_KEY } = process.env;

// Configuración de tokens (tiempos fijos)
const ACCESS_TOKEN_EXPIRES_IN = '15m';
const REFRESH_TOKEN_EXPIRES_IN = '7d';

class AuthController {
    // ==================== FUNCIONES DE UTILIDAD ====================

    // Generar tokens (access y refresh)
    static generateTokens(user) {
        const accessToken = jwt.sign(
            {
                id: user.id,
                correo: user.correo,
                rol: user.rol,
                nombreUsuario: user.nombreUsuario,
                idMunicipalidad: user.idMunicipalidad
            },
            SECRET_KEY,
            { expiresIn: ACCESS_TOKEN_EXPIRES_IN }
        );

        const refreshToken = jwt.sign(
            {
                id: user.id,
                type: 'refresh'
            },
            SECRET_KEY,
            { expiresIn: REFRESH_TOKEN_EXPIRES_IN }
        );

        return { accessToken, refreshToken };
    }

    // Buscar usuario por correo (función de utilidad para login)
    static async findUserByEmail(correo) {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM Usuario WHERE correo = ? AND activo = 1';

            pool.query(query, [correo], (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results.length > 0 ? results[0] : null);
                }
            });
        });
    }

    // Verificar contraseña (función de utilidad para login)
    static async verifyPassword(plainPassword, hashedPassword) {
        return await bcrypt.compare(plainPassword, hashedPassword);
    }

    // Guardar refresh token en BD
    static async saveRefreshToken(userId, refreshToken) {
        return new Promise((resolve, reject) => {
            // Calcular fecha de expiración (7 días desde ahora)
            const expiresAt = new Date();
            expiresAt.setDate(expiresAt.getDate() + 7);

            // Llamar al procedimiento almacenado para insertar refresh token
            const query = 'CALL pa_InsertToken(?, ?, ?)';

            pool.query(query, [userId, refreshToken, expiresAt], (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results);
                }
            });
        });
    }

    // Revocar refresh tokens anteriores del usuario
    static async revokeUserRefreshTokens(userId) {
        return new Promise((resolve, reject) => {
            const query = 'UPDATE Token SET esActivo = 0 WHERE idUsuario = ? AND esActivo = 1';

            pool.query(query, [userId], (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results);
                }
            });
        });
    }

    // Obtener refresh tokens de un usuario
    static async getUserRefreshTokens(userId) {
        return new Promise((resolve, reject) => {
            const query = 'CALL pa_SelectToken(?)';

            pool.query(query, [userId], (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results[0] || []);
                }
            });
        });
    }

    // Limpiar tokens expirados
    static async cleanupExpiredTokens() {
        return new Promise((resolve, reject) => {
            const query = 'DELETE FROM Token WHERE fechaExpiracion < NOW()';

            pool.query(query, [], (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results);
                }
            });
        });
    }

    // Actualizar última sesión del usuario
    static async updateLastSession(userId) {
        return new Promise((resolve, reject) => {
            const query = 'UPDATE Usuario SET ultimaSesion = NOW() WHERE id = ?';

            pool.query(query, [userId], (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results);
                }
            });
        });
    }

    // ==================== MÉTODOS DE AUTENTICACIÓN ====================

    static async login(req, res) {
        const { correo, contrasena } = req.body;

        try {
            // Validar que se envíen los datos requeridos
            if (!correo || !contrasena) {
                return res.status(400).json({
                    success: false,
                    error: 'Correo y contraseña son requeridos'
                });
            }

            // 1. Buscar usuario por correo
            const usuario = await AuthController.findUserByEmail(correo);

            if (!usuario) {
                return res.status(401).json({
                    success: false,
                    error: 'Credenciales inválidas'
                });
            }

            // 2. Verificar contraseña
            const isValidPassword = await AuthController.verifyPassword(contrasena, usuario.contrasenaHash);

            if (!isValidPassword) {
                return res.status(401).json({
                    success: false,
                    error: 'Credenciales inválidas'
                });
            }

            try {
                // 3. Revocar refresh tokens anteriores (opcional - para mayor seguridad)
                await AuthController.revokeUserRefreshTokens(usuario.id);

                // 4. Generar nuevos tokens
                const { accessToken, refreshToken } = AuthController.generateTokens({
                    id: usuario.id,
                    correo: usuario.correo,
                    rol: usuario.rol,
                    nombreUsuario: usuario.nombreUsuario,
                    idMunicipalidad: usuario.idMunicipalidad
                });

                // 5. Guardar refresh token en BD
                await AuthController.saveRefreshToken(usuario.id, refreshToken);

                // 6. Actualizar última sesión
                await AuthController.updateLastSession(usuario.id);

                // 7. Configurar cookie segura con refresh token
                res.cookie('refreshToken', refreshToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'strict',
                    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 días
                });

                // 8. Responder con access token y datos básicos del usuario
                res.json({
                    success: true,
                    accessToken,
                    usuario: {
                        id: usuario.id,
                        nombreUsuario: usuario.nombreUsuario,
                        rol: usuario.rol,
                        correo: usuario.correo,
                        idMunicipalidad: usuario.idMunicipalidad
                    }
                });

            } catch (tokenError) {
                console.error('Error generando tokens:', tokenError);
                return res.status(500).json({
                    success: false,
                    error: 'Error al generar tokens'
                });
            }

        } catch (error) {
            console.error('Error en login:', error);
            res.status(500).json({
                success: false,
                error: 'Error interno del servidor'
            });
        }
    }

    static async register(req, res) {
        const { nombreUsuario, correo, contrasena, rol = 'usuario', idMunicipalidad, identificacion } = req.body;

        try {
            if (!nombreUsuario || !correo || !contrasena) {
                return res.status(400).json({
                    success: false,
                    error: 'Nombre de usuario, correo y contraseña son requeridos'
                });
            }

            // Verificar si el usuario ya existe
            const existingUser = await AuthController.findUserByEmail(correo);

            if (existingUser) {
                return res.status(409).json({
                    success: false,
                    error: 'El usuario ya existe'
                });
            }

            // Hashear la contraseña
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(contrasena, saltRounds);

            // Insertar nuevo usuario
            const insertQuery = `
                INSERT INTO Usuario (nombreUsuario, correo, contrasenaHash, rol, activo, fechaCreacion, idMunicipalidad, identificacion) 
                VALUES (?, ?, ?, ?, 1, NOW(), ?, ?)
            `;

            pool.query(insertQuery, [nombreUsuario, correo, hashedPassword, rol, idMunicipalidad, identificacion], async (insertError, insertResults) => {
                if (insertError) {
                    console.error('Error creando usuario:', insertError);
                    return res.status(500).json({
                        success: false,
                        error: 'Error al crear usuario'
                    });
                }

                // Datos del usuario recién creado
                const nuevoUsuario = {
                    id: insertResults.insertId,
                    nombreUsuario,
                    correo,
                    rol,
                    idMunicipalidad: idMunicipalidad || null
                };

                try {
                    // Generar tokens
                    const { accessToken, refreshToken } = AuthController.generateTokens(nuevoUsuario);

                    // Guardar refresh token en BD
                    await AuthController.saveRefreshToken(nuevoUsuario.id, refreshToken);

                    // Configurar cookie segura con refresh token
                    res.cookie('refreshToken', refreshToken, {
                        httpOnly: true,
                        secure: process.env.NODE_ENV === 'production',
                        sameSite: 'strict',
                        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 días
                    });

                    // Responder con access token y datos del usuario
                    res.status(201).json({
                        success: true,
                        message: 'Usuario creado exitosamente',
                        accessToken,
                        usuario: nuevoUsuario
                    });

                } catch (tokenError) {
                    console.error('Error generando tokens:', tokenError);
                    return res.status(500).json({
                        success: false,
                        error: 'Error al generar tokens'
                    });
                }
            });

        } catch (error) {
            console.error('Error en register:', error);
            res.status(500).json({
                success: false,
                error: 'Error interno del servidor'
            });
        }
    }

    // Renovar Access Token
    static async refreshToken(req, res) {
        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) {
            return res.status(401).json({
                success: false,
                error: 'Refresh token no encontrado'
            });
        }

        try {
            // Verificar el refresh token
            const decoded = jwt.verify(refreshToken, SECRET_KEY);

            // Verificar si el token existe en BD y está activo
            const query = 'CALL pa_SelectToken(?)';

            pool.query(query, [refreshToken], async (error, results) => {
                if (error) {
                    console.error('Error verificando refresh token:', error);
                    return res.status(500).json({
                        success: false,
                        error: 'Error interno del servidor'
                    });
                }

                const tokenResults = results[0];
                if (!tokenResults || tokenResults.length === 0) {
                    return res.status(403).json({
                        success: false,
                        error: 'Refresh token inválido o expirado'
                    });
                }

                const tokenData = tokenResults[0];

                // Verificar que el token esté activo y no haya expirado
                if (!tokenData.activo || new Date() > new Date(tokenData.expires_at)) {
                    return res.status(403).json({
                        success: false,
                        error: 'Refresh token inválido o expirado'
                    });
                }

                // Buscar datos completos del usuario
                const usuario = await AuthController.findUserByEmail(tokenData.correo || '');

                if (!usuario) {
                    return res.status(403).json({
                        success: false,
                        error: 'Usuario no encontrado'
                    });
                }

                try {
                    // Revocar el refresh token actual (rotación)
                    await AuthController.revokeUserRefreshTokens(usuario.id);

                    // Generar nuevos tokens
                    const { accessToken, refreshToken: newRefreshToken } = AuthController.generateTokens({
                        id: usuario.id,
                        correo: usuario.correo,
                        rol: usuario.rol,
                        nombreUsuario: usuario.nombreUsuario,
                        idMunicipalidad: usuario.idMunicipalidad
                    });

                    // Guardar el nuevo refresh token
                    await AuthController.saveRefreshToken(usuario.id, newRefreshToken);

                    // Actualizar cookie con nuevo refresh token
                    res.cookie('refreshToken', newRefreshToken, {
                        httpOnly: true,
                        secure: process.env.NODE_ENV === 'production',
                        sameSite: 'strict',
                        maxAge: 7 * 24 * 60 * 60 * 1000
                    });

                    // Responder con nuevo access token
                    res.json({
                        success: true,
                        accessToken,
                        usuario: {
                            id: usuario.id,
                            nombreUsuario: usuario.nombreUsuario,
                            correo: usuario.correo,
                            rol: usuario.rol,
                            idMunicipalidad: usuario.idMunicipalidad
                        }
                    });

                } catch (tokenError) {
                    console.error('Error rotando tokens:', tokenError);
                    return res.status(500).json({
                        success: false,
                        error: 'Error al renovar tokens'
                    });
                }
            });

        } catch (jwtError) {
            console.error('Error verificando JWT:', jwtError);
            return res.status(403).json({
                success: false,
                error: 'Refresh token inválido'
            });
        }
    }

    // Logout
    static async logout(req, res) {
        const refreshToken = req.cookies.refreshToken;

        if (refreshToken) {
            try {
                // Revocar el refresh token en BD
                const query = 'CALL pa_DeleteToken(?)';

                pool.query(query, [refreshToken], (error, results) => {
                    if (error) {
                        console.error('Error revocando refresh token:', error);
                    }
                });

            } catch (error) {
                console.error('Error en logout:', error);
            }
        }

        // Limpiar cookie
        res.clearCookie('refreshToken');

        res.json({
            success: true,
            message: 'Sesión cerrada exitosamente'
        });
    }

    // ==================== MÉTODOS DE VERIFICACIÓN ====================

    // Método para verificar access token (middleware)
    static async verifyToken(req, res, next) {
        try {
            const token = req.header('Authorization')?.replace('Bearer ', '');

            if (!token) {
                return res.status(401).json({
                    success: false,
                    error: 'Token de acceso requerido'
                });
            }

            const decoded = jwt.verify(token, SECRET_KEY);
            req.usuario = decoded;
            next();
        } catch (error) {
            return res.status(401).json({
                success: false,
                error: 'Token inválido'
            });
        }
    }

    // ==================== MÉTODOS DE GESTIÓN DE SESIONES ====================

    // Obtener sesiones activas del usuario
    static async getUserSessions(req, res) {
        try {
            const userId = req.usuario.id; // Viene del middleware de autenticación

            const sessions = await AuthController.getUserRefreshTokens(userId);

            // Formatear la respuesta para no exponer tokens completos
            const formattedSessions = sessions.map(session => ({
                id: session.id,
                created_at: session.created_at,
                expires_at: session.expires_at,
                activo: session.activo,
                // Solo mostrar primeros y últimos caracteres del token por seguridad
                token_preview: session.token.substring(0, 10) + '...' + session.token.substring(session.token.length - 10)
            }));

            res.json({
                success: true,
                sessions: formattedSessions
            });

        } catch (error) {
            console.error('Error obteniendo sesiones:', error);
            res.status(500).json({
                success: false,
                error: 'Error interno del servidor'
            });
        }
    }

    // Revocar una sesión específica
    static async revokeSession(req, res) {
        try {
            const { sessionId } = req.params;
            const userId = req.usuario.id;

            // Primero verificar que la sesión pertenece al usuario
            const sessions = await AuthController.getUserRefreshTokens(userId);
            const session = sessions.find(s => s.id === parseInt(sessionId));

            if (!session) {
                return res.status(404).json({
                    success: false,
                    error: 'Sesión no encontrada'
                });
            }

            // Revocar la sesión específica
            await new Promise((resolve, reject) => {
                const query = 'CALL pa_DeleteToken(?)';
                pool.query(query, [session.token], (error, results) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(results);
                    }
                });
            });

            res.json({
                success: true,
                message: 'Sesión revocada exitosamente'
            });

        } catch (error) {
            console.error('Error revocando sesión:', error);
            res.status(500).json({
                success: false,
                error: 'Error interno del servidor'
            });
        }
    }

    // Revocar todas las sesiones del usuario excepto la actual
    static async revokeAllOtherSessions(req, res) {
        try {
            const userId = req.usuario.id;
            const currentRefreshToken = req.cookies.refreshToken;

            // Obtener todas las sesiones del usuario
            const sessions = await AuthController.getUserRefreshTokens(userId);

            // Revocar todas excepto la actual
            const promises = sessions
                .filter(session => session.token !== currentRefreshToken && session.activo)
                .map(session => {
                    return new Promise((resolve, reject) => {
                        const query = 'CALL pa_DeleteToken(?)';
                        pool.query(query, [session.token], (error, results) => {
                            if (error) {
                                reject(error);
                            } else {
                                resolve(results);
                            }
                        });
                    });
                });

            await Promise.all(promises);

            res.json({
                success: true,
                message: 'Todas las otras sesiones han sido revocadas'
            });

        } catch (error) {
            console.error('Error revocando sesiones:', error);
            res.status(500).json({
                success: false,
                error: 'Error interno del servidor'
            });
        }
    }

    // ==================== MÉTODOS DE MANTENIMIENTO ====================

    // Programar limpieza de tokens
    static scheduleTokenCleanup() {
        setInterval(async () => {
            try {
                await AuthController.cleanupExpiredTokens();
                console.log('Limpieza de tokens expirados completada');
            } catch (error) {
                console.error('Error en limpieza de tokens:', error);
            }
        }, 24 * 60 * 60 * 1000); // 24 horas
    }
}

module.exports = AuthController;