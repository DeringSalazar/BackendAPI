// middleware/verificarToken.js
const jwt = require('jsonwebtoken');
const { SECRET_KEY } = process.env;

if (!SECRET_KEY) {
    throw new Error('SECRET_KEY no está definida en las variables de entorno');
}

const verificarToken = (req, res, next) => {
    try {
        // 1. Obtener el token del header Authorization
        const authHeader = req.headers.authorization || req.headers.Authorization;
        
        if (!authHeader?.startsWith('Bearer ')) {
            return res.status(401).json({ 
                success: false,
                error: 'Formato de token inválido. Use: Bearer <token>' 
            });
        }

        const token = authHeader.split(' ')[1];

        // 2. Verificar token
        const decoded = jwt.verify(token, SECRET_KEY);
        
        // 3. Adjuntar datos de usuario al request
        req.usuario = {
            id: decoded.id,
            correo: decoded.correo,
            rol: decoded.rol,
            idMunicipalidad: decoded.idMunicipalidad
        };

        next();
    } catch (error) {
        console.error('Error en verificarToken:', error.message);
        
        let mensaje = 'Error de autenticación';
        
        if (error instanceof jwt.JsonWebTokenError) {
            mensaje = 'Token inválido';
        } else if (error instanceof jwt.TokenExpiredError) {
            mensaje = 'Token expirado';
        }

        return res.status(402).json({ 
            success: false,
            error: mensaje 
        });
    }
};

module.exports = verificarToken;