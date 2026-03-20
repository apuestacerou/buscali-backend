import { Router, Request, Response } from 'express';
import { ConductorService } from '../services/conductor-service';
import { CreateConductorDTO, UpdateConductorDTO, ConductorLogin} from '../dto/conductor-dto';
import { plainToInstance } from 'class-transformer';
import { ConflictError, ValidationError, checkDto } from '../shared/error.class';

//DONE: agregar logica de validacion de datos y manejo de errores
// solucionar validacion para telefono, sustituirstring para que no hayan errores de tipo en class-validator

const service = new ConductorService();
const router = Router();

// Listar todos los conductores
router.get('/', async (req: Request, res: Response) => {
  try {
    const conductores = await service.list();
    res.status(200).json(conductores);
  } catch (error) {
    if (error instanceof ConflictError) 
      { return res.status(409).json({ error: error.messages }); } 
      if (error instanceof ValidationError) 
      { return res.status(400).json({ error: error.messages }); } 
      console.error("Error creando conductor:", error); 
      res.status(500).json({ error: "Error interno del servidor" });
  }
});

// Obtener conductor por ID
router.get('/:cedula', async (req: Request, res: Response) => {
  try {
    const cedula = req.params.cedula;
    const conductor = await service.get(cedula);
    res.status(200).json(conductor);
  } catch (error) {
    if (error instanceof ValidationError) 
      { return res.status(400).json({ error: error.messages }); } 
    console.error('Error fetching conductor:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Crear un nuevo conductor
router.post('/', async (req: Request, res: Response) => {
  try {
    // transforma y valida en un solo paso utilizando el helper
    const dto: CreateConductorDTO = plainToInstance(CreateConductorDTO, req.body as Record<string, unknown>);
    await checkDto(dto);

    const newConductor = await service.create(dto);
    res.status(201).json(newConductor);
  } catch (error) {
    if (error instanceof ConflictError) 
    { return res.status(409).json({ error: error.messages }); } 
    if (error instanceof ValidationError) 
    { return res.status(400).json({ error: error.messages }); } 
    console.error("Error creando conductor:", error); 
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// Actualizar un conductor existente
router.put('/:cedula', async (req: Request, res: Response) => {
  try {
    // transforma  req.body(JSON) a UpdateConductorDTO y valida los datos usando class-validator
    const cedula = req.params.cedula;
    const datos = {
      ...req.body
    };
    const dto = plainToInstance(UpdateConductorDTO, datos as Record<string, unknown>);
    await checkDto(dto);

    const update = await service.update(cedula, dto);
    res.status(200).json(update);
  } catch (error) {
    if (error instanceof ConflictError) 
      { return res.status(409).json({ error: error.messages }); } 
    if (error instanceof ValidationError) 
      { return res.status(400).json({ error: error.messages }); }
    console.error('Error actualizando conductor:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Eliminar un conductor
router.delete('/:cedula', async (req: Request, res: Response) => {
  try {
    const cedula = req.params.cedula;
    const success = await service.delete(cedula);
    res.status(204).json({ success: "Conductor eliminado exitosamente" });
  } catch (error) {
    if (error instanceof ValidationError) 
      { return res.status(404).json({ error: error.messages }); } 
    console.error('Error eliminando conductor:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});


// Login 
router.post('/login', async (req: Request,res: Response)=>{
  try {
    const dto: ConductorLogin = plainToInstance(ConductorLogin, req.body as Record<string, unknown>);
    await checkDto(dto)
    const conductor = await service.login(dto);
    res.status(200).json({'Sesión':'Iniciada', conductor});
  } catch (error) {
    if (error instanceof ConflictError) 
      { return res.status(409).json({ error: error.messages }); } 
      if (error instanceof ValidationError) 
      { return res.status(400).json({ error: error.messages }); } 
      console.error("Error creando conductor:", error); 
      res.status(500).json({ error: "Error interno del servidor" });
  }
})

export default router;
