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
    res.json(conductores);
  } catch (error) {
    console.error('Error fetching conductores:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Obtener conductor por ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    const conductor = await service.get(id);
    if (!conductor) {
      return res.status(404).json({ message: 'Conductor not found' });
    }
    res.json(conductor);
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
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    const dto = new UpdateConductorDTO({ id, ...req.body }); 
    const update = await service.update(dto);
    if (!update) {
      return res.status(404).json({ message: 'Conductor not found' });
    }
    res.json(update);
  } catch (error) {
    console.error('Error updating conductor:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Eliminar un conductor
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    const success = await service.delete(id);
    if (!success) {
      return res.status(404).json({ message: 'Conductor not found' });
    }
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting conductor:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
