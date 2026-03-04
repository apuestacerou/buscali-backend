import { Router, Request, Response } from 'express';
import { ConductorService } from '../services/conductor-service';
import { CreateConductorDTO, UpdateConductorDTO } from '../dto/conductor-dto';

//TODO: agregar logica de validacion de datos y manejo de errores

const service = new ConductorService();
const router = Router();

// Listar todos los conductores
router.get('/', async (req: Request, res: Response) => {
  try {
    const conductores = await service.list();
    res.status(200).json(conductores);
  } catch (error) {
    console.error('Error fetching conductores:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Obtener conductor por ID
router.get('/:cedula', async (req: Request, res: Response) => {
  try {
    const cedula = BigInt(req.params.cedula);
    const conductor = await service.get(cedula);
    res.status(200).json(conductor);
  } catch (error) {
    console.error('Error fetching conductor:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Crear un nuevo conductor
router.post('/', async (req: Request, res: Response) => {
  try {
    const dto = new CreateConductorDTO(req.body); // Valida y transforma la data
    const newConductor = await service.create(dto);
    res.status(201).json(newConductor);
  } catch (error) {
    console.error('Error creating conductor:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Actualizar un conductor existente
router.put('/:cedula', async (req: Request, res: Response) => {
  try {
    const cedula = BigInt(req.params.cedula);
    const dto = new UpdateConductorDTO({ cedula, ...req.body }); 
    const update = await service.update(dto);
    res.status(200).json(update);
  } catch (error) {
    console.error('Error updating conductor:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Eliminar un conductor
router.delete('/:cedula', async (req: Request, res: Response) => {
  try {
    const cedula = BigInt(req.params.cedula);
    const success = await service.delete(cedula);
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting conductor:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
