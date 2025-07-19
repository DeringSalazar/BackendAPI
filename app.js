// app.js (archivo principal)
const Servidor = require('./models/servidor.js'); // Importar la clase desde server.js

// Crear instancia del servidor
const servidor = new Servidor();

// Iniciar el servidor
servidor.listen();

// Manejar señales de terminación
process.on('SIGTERM', async () => {
  console.log('📡 Recibida señal SIGTERM');
  await servidor.shutdown();
});

process.on('SIGINT', async () => {
  console.log('📡 Recibida señal SIGINT');
  await servidor.shutdown();
});

// Manejar errores no capturados
process.on('uncaughtException', (error) => {
  console.error('❌ Error no capturado:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Promise rechazada no manejada:', reason);
  process.exit(1);
});

// Mensaje de inicio
console.log('🔄 Iniciando aplicación...');
console.log(`🌍 Entorno: ${process.env.NODE_ENV || 'development'}`);
console.log(`📅 Fecha de inicio: ${new Date().toISOString()}`);