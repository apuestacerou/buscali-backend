import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import conductorRouter from './domains/conductores/routers/conductor-router';
import rutasRouter from './domains/rutas/routers/ruta-router';
import usuarioRouter from './domains/usuarios/routers/usuario-router';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import { sequelize } from './shared/db/database';
import cors from 'cors';
import cookieParser from 'cookie-parser';
//middleware's
import { jwtAuth } from './shared/middlewares/jwtAuth';
import { errorHandler } from './shared/middlewares/errorHandler';

async function bootstrap() {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: process.env.NODE_ENV !== 'production' }); // sincroniza modelos con la BD en entorno de desarrollo
    console.log('DB connected');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

bootstrap();

const app = express();

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

// Health check
app.get('/health', (_req, res) =>
  res.json({ status: 'OK', service: 'conductores-service' }),
);

app.use('/api/v1/conductores', conductorRouter);
app.use('/api/v1/usuarios', usuarioRouter);
app.use('/api/v1/rutas', rutasRouter);
app.use('/api/v1/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;
app.listen(PORT, () => {
  console.log(`\n✅ Buscali Backend Service running on http://localhost:${PORT}\n`);
  console.log(`📍 Available Endpoints:\n`);
  console.log(`   🚗 POST   /api/v1/conductores          - Conductores Management`);
  console.log(`   👤 POST   /api/v1/usuarios             - User Registration & Login`);
  console.log(`   🛣️  GET   /api/v1/rutas                - Routes Management`);
  console.log(`   📚 GET   /api/v1/docs                  - Swagger Documentation\n`);
  console.log(`✨ Ready to accept requests!\n`);
});

//middleware para manejar errores
app.use(errorHandler);
export default app;
