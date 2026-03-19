import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import conductorController from './controllers/conductor-controller'
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import { sequelize } from './config/database';
import cors from 'cors';


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

app.use(cors({
  origin: "*", 
  methods: ["GET", "POST", "PUT", "DELETE"],
}))



app.use(express.json());
// ruta de la documentación Swagger apuntada al archivo YAML en su ubicacion despues de compilar a dist/docs
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