import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import conductorRouter from './domains/conductores/routers/conductor-router';
import rutasRouter from './domains/rutas/routers/ruta-router';
import usuariosRoutes from './domains/usuarios/routers/usuario-router';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import { sequelize } from './shared/db/database';
import cors from 'cors';
import cookieParser from 'cookie-parser';
//middleware's
import { errorHandler } from './shared/middlewares/errorHandler';

async function bootstrap() {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: process.env.NODE_ENV !== 'production' }); // sincroniza modelos con la BD en entorno de desarrollo
    console.log('DB connected');
    console.log(
      `\n✅ Buscali Backend Service running on http://localhost:${PORT}\n`,
    );
    console.log(`📍 Available Endpoints:\n`);
    console.log(
      `   🚗 POST   /api/v1/conductores          - Conductores Management`,
    );
    console.log(
      `   👤 POST   /api/v1/usuarios             - User Registration & Login`,
    );
    console.log(
      `   🛣️  GET   /api/v1/rutas                - Routes Management`,
    );
    console.log(
      `   📚 GET   /api/v1/docs                  - Swagger Documentation\n`,
    );
    console.log(`✨ Ready to accept requests!\n`);
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    throw error; // Throw to prevent app from starting
  }
}

const app = express();
app.set('trust proxy', true);

// Configurar Express para devolver JSON formateado (pretty print)
// 2 espacios de indentación para mejor legibilidad
app.set('json spaces', 2);

// Middleware's
app.use(express.json());

//middleware CORS solo permite peticiones desde produccion, local y peticiones como postman
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || process.env.ALLOWED_ORIGINS?.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('No permitido por CORS'));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  }),
);

// mmiddleware cookie-parser para usar cookies
app.use(cookieParser());

// Ruta de la documentación Swagger apuntada al archivo YAML en su ubicacion despues de compilar a dist/docs
const swaggerDocument = YAML.load('./src/apis/apis.yaml');

// Raíz: info del API (evita 404 al abrir http://localhost:PUERTO/ en el navegador)
app.get('/', (_req, res) => {
  res.json({
    service: 'BusCali Backend',
    message: 'API activa. Usa rutas bajo /api/v1/…',
    endpoints: {
      health: 'GET /health',
      docs: 'GET /api/v1/docs',
      conductores: 'POST /api/v1/conductores/login',
      rutas: 'GET /api/v1/rutas',
      usuarios: 'POST /api/v1/usuarios/login',
    },
  });
});

// Health check
app.get('/health', (_req, res) =>
  res.json({ status: 'OK', service: 'conductores-service' }),
);

app.use('/api/v1/conductores', conductorRouter);
app.use('/api/v1/rutas', rutasRouter);
app.use('/api/v1/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/api/v1/usuarios', usuariosRoutes);

app.use((_req, res) => {
  // Cualquier ruta no definida arriba devuelve 404 con mensaje útil
  res.status(404).json({
    error: 'No encontrado',
    message:
      'La ruta no existe. Prueba: GET / , GET /health , GET /api/v1/docs',
    path: _req.path,
  });
});

const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('Starting up... Connecting to database...');
});
bootstrap();

//middleware para manejar errores
app.use(errorHandler);
export default app;
