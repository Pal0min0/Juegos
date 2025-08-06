const express = require('express');
const cors = require('cors');
const db = require('./config/database');

// Importar rutas
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');

const app = express();
const PORT = 5000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware para logging de requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - ${new Date().toISOString()}`);
  next();
});

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

// Ruta de prueba
app.get('/api/test', (req, res) => {
  res.json({ message: ' Backend GameZone funcionando correctamente!' });
});

// Ruta de prueba de BD
app.get('/api/test-db', (req, res) => {
  db.query('SELECT COUNT(*) as count FROM usuario', (err, results) => {
    if (err) {
      console.error(' Error en test de BD:', err);
      return res.status(500).json({ 
        success: false,
        message: 'Error de conexión a la base de datos',
        error: err.message,
        type: 'DATABASE_ERROR'
      });
    }
    
    res.json({ 
      success: true,
      message: '✅ Conexión a BD exitosa',
      userCount: results[0].count
    });
  });
});

// Middleware de manejo de errores
app.use((err, req, res, next) => {
  console.error(' Error en el servidor:', err);
  res.status(500).json({ 
    success: false,
    message: 'Error interno del servidor',
    type: 'SERVER_ERROR'
  });
});

// Ruta 404
app.use('*', (req, res) => {
  res.status(404).json({ 
    success: false,
    message: 'Ruta no encontrada',
    type: 'NOT_FOUND'
  });
});

app.listen(PORT, () => {
  console.log(` Servidor corriendo en http://localhost:${PORT}`);
  console.log(` Base de datos: GameShop (MySQL/XAMPP)`);
  console.log(` Prueba la conexión en: http://localhost:${PORT}/api/test`);
  console.log(` Prueba la BD en: http://localhost:${PORT}/api/test-db`);

});
