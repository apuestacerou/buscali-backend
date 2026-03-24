import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import conductorController from './controllers/conductor-controller'
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import { sequelize } from './config/database';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { jwtAuth } from './middlewares/jwtAuth';


async function bootstrap() {
  try {
    await sequelize.authenticate();
    await sequelize.sync(); // opcional, sincroniza modelos con la BD
    console.log('DB connected');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

bootstrap();

const app = express();

// Middleware's
app.use(express.json());

//array de direcciones permitidas
const allowedOrigins = [
  'https://buscali.netlify.app', // producción
  'http://localhost:3000'        // desarrollo local
];

//middleware CORS solo permite peticiones desde produccion, local y peticiones como postman
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('No permitido por CORS'));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

// mmiddleware cookie-parser para usar cookies
app.use(cookieParser())

//middleware para verificar el jwt
app.use(jwtAuth)



// Ruta de la documentación Swagger apuntada al archivo YAML en su ubicacion despues de compilar a dist/docs
const swaggerDocument = YAML.load('./docs/conductores.yaml');

// Health check
app.get('/health', (_req, res) => res.json({ status: 'OK', service: 'conductores-service' }));

app.use('/api/v1/conductores', conductorController);
app.use('/api/v1/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;
app.listen(PORT, () => {
  console.log(`✓ Conductores service running on http://localhost:${PORT}`);
  console.log(`  Endpoints:`);
  console.log(`    GET    /api/v1/conductores`);
  console.log(`    POST   /api/v1/conductores`);
  console.log(`    GET    /api/v1/conductores/:id`);
  console.log(`  Swagger docs: http://localhost:${PORT}/api/v1/docs`);

});

export default app;