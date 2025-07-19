// server.js (renombra tu archivo actual)
const TokenMaintenance = require('../Auth/TokenMaintenance.js');
const express = require("express");
const cors = require("cors");
const path = require('path');
const swaggerUi = require("swagger-ui-express");
const swaggerJSDoc = require("swagger-jsdoc");
require("dotenv").config();

// Importar middleware de verificación de token
const verificarToken = require('../middleware/verificarToken');

// Configuración de swagger-jsdoc
const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Documentación API",
    version: "1.0.0",
    description: "Documentación de las rutas de la API, proyecto integrador (Por 4D)",
  },
  servers: [
    {
      url: "/api/documentacion",
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: ["./routes/*.route.js", "./Auth/*route.js"],
};

const swaggerSpec = swaggerJSDoc(options);

class Servidor {
  constructor() {
    this.app = express();
    this.port = process.env.PORT || 3000;
    this.authPath = "/api/auth";
    this.rutas = require("../src/consts/rutas");
    this.rutasP = require("../src/consts/rutasP");
    
    // Inicializar token maintenance
    this.initializeTokenMaintenance();
    
    this.middlewares();
    this.routes();
  }

  // Método para inicializar el mantenimiento de tokens
  initializeTokenMaintenance() {
    try {
      console.log('🔧 Iniciando mantenimiento de tokens...');
      TokenMaintenance.startCleanupSchedule();
      console.log('✅ Mantenimiento de tokens iniciado correctamente');
    } catch (error) {
      console.error('❌ Error al inicializar el mantenimiento de tokens:', error);
      // Decidir si continuar o detener la aplicación
      // process.exit(1); // Descomenta si quieres que la app no inicie sin el mantenimiento
    }
  }

  // Método que contiene las rutas
  routes() {
    // Ruta de salud/estado del servidor
    this.app.get('/health', (req, res) => {
      res.status(200).json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
      });
    });

    // Ruta de autenticación (pública - NO protegida)
    this.app.use(this.authPath, require("../Auth/auth.route"));

    // Rutas protegidas (aplica el middleware de verificación de token)
    this.rutas.forEach(({ path, route }) => {
      this.app.use(path, verificarToken, route);
    });

    // Rutas públicas (Sin middleware de verificación de token)
    this.rutasP.forEach(({ path, route }) => {
      this.app.use(path, route);
    });

    // Servir archivos estáticos CSS
    this.app.use('/css', express.static(path.join(__dirname, '../src/css')));

    // Servir la documentación en /api/documentacion
    this.app.use(
      "/api/documentacion",
      swaggerUi.serve,
      swaggerUi.setup(swaggerSpec, {
        // customCssUrl: '/css/swagger-dark.css',
        swaggerOptions: {
          docExpansion: "none",
        },
      })
    );

    // Middleware para manejar rutas no encontradas
    this.app.use('*', (req, res) => {
      res.status(404).json({
        error: 'Ruta no encontrada',
        path: req.originalUrl,
        method: req.method
      });
    });

    // Middleware de manejo de errores
    this.app.use((err, req, res, next) => {
      console.error('Error en la aplicación:', err);
      res.status(500).json({
        error: 'Error interno del servidor',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Algo salió mal'
      });
    });
  }

  // Middlewares de Express
  middlewares() {
    // Servir archivos estáticos
    this.app.use(express.static("public"));
    
    // Configurar CORS
    this.app.use(cors({
      origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : '*',
      credentials: true
    }));
    
    // Parsear JSON con límite
    this.app.use(express.json({ limit: '10mb' }));
    
    // Parsear URL encoded
    this.app.use(express.urlencoded({ extended: true }));
    
    // Logging de requests en desarrollo
    if (process.env.NODE_ENV === 'development') {
      this.app.use((req, res, next) => {
        console.log(`${req.method} ${req.path} - ${new Date().toISOString()}`);
        next();
      });
    }
  }

  // Iniciar servidor
  listen() {
    this.app.listen(this.port, () => {
      console.log(`🚀 Servidor corriendo en puerto ${this.port}`);
      console.log(`📚 Documentación disponible en: http://localhost:${this.port}/api/documentacion`);
      console.log(`🏥 Health check en: http://localhost:${this.port}/health`);
    });
  }

  // Método para cerrar el servidor correctamente
  async shutdown() {
    console.log('🔄 Cerrando servidor...');
    try {
      // Detener el mantenimiento de tokens
      await TokenMaintenance.stopCleanupSchedule();
      console.log('✅ Servidor cerrado correctamente');
      process.exit(0);
    } catch (error) {
      console.error('❌ Error al cerrar el servidor:', error);
      process.exit(1);
    }
  }
}

module.exports = Servidor;