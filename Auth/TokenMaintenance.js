// TokenMaintenance.js
const cron = require('node-cron');
const AuthController = require('../Auth/auth.controller');

class TokenMaintenance {
    // Ejecutar limpieza automática cada 24 horas
    static startCleanupSchedule() {
        // Ejecutar todos los días a las 2:00 AM
        cron.schedule('0 2 * * *', async () => {
            console.log('Iniciando limpieza automática de refresh tokens expirados...');
            
            try {
                const result = await AuthController.cleanupExpiredTokens();
                
                if (result) {
                    console.log('Limpieza de refresh tokens completada exitosamente');
                } else {
                    console.error('Error en la limpieza automática de refresh tokens');
                }
            } catch (error) {
                console.error('Error en la limpieza automática de refresh tokens:', error);
            }
        });

        console.log('Programación de limpieza de refresh tokens iniciada (todos los días a las 2:00 AM)');
    }

    // Ejecutar limpieza manual
    static async manualCleanup() {
        console.log('Iniciando limpieza manual de refresh tokens...');
        
        try {
            const result = await AuthController.cleanupExpiredTokens();
            
            if (result) {
                console.log('Limpieza manual completada exitosamente');
                return true;
            } else {
                console.error('Error en la limpieza manual de refresh tokens');
                return false;
            }
        } catch (error) {
            console.error('Error en la limpieza manual de refresh tokens:', error);
            return false;
        }
    }

    // Iniciar limpieza automática usando setInterval (alternativa a cron)
    static startSimpleCleanupSchedule() {
        // Iniciar inmediatamente la programación usando la función del AuthController
        AuthController.scheduleTokenCleanup();
        console.log('Programación simple de limpieza iniciada (cada 24 horas)');
    }
}

module.exports = TokenMaintenance;