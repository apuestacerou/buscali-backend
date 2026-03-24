import { Router, Request, Response, NextFunction } from 'express';
import { ConductorService } from '../services/conductor-service';
import { CreateConductorDTO, UpdateConductorDTO, ConductorLoginDTO} from '../dto/conductor-dto';
import { plainToInstance } from 'class-transformer';
import { checkDto } from '../errors/error.class';
import { requireAuth } from '../middlewares/requireAuth';
import { sendSuccess } from '../utils/sendSuccess';

const service = new ConductorService();
const router = Router();

// Listar todos los conductores
router.get('/', requireAuth, async (req: Request, res: Response, next: NextFunction) => {

  try {
    const conductores = await service.list();
    return sendSuccess(res, 200, "Conductores listados correctamente" , conductores)
  } catch (error) {
    return next(error);
  }
});

// Obtener conductor por ID
router.get('/:cedula', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cedula = req.params.cedula;
    const conductor = await service.get(cedula);
    return sendSuccess(res, 200 , "Conductor encontrado" ,conductor)
  } catch (error) {
    return next(error)
  }
});

// Crear un nuevo conductor
router.post('/', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    // transforma y valida en un solo paso utilizando el helper
    const dto: CreateConductorDTO = plainToInstance(CreateConductorDTO, req.body as Record<string, unknown>);
    await checkDto(dto);
    const newConductor = await service.create(dto);
    return sendSuccess(res, 201 , "Conductor creado correctamente" , newConductor)
  } catch (error) {
    return next(error)
  }
});

// Actualizar un conductor existente
router.put('/:cedula', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    // transforma  req.body(JSON) a UpdateConductorDTO y valida los datos usando class-validator
    const cedula = req.params.cedula;
    const datos = {
      ...req.body
    };
    const dto = plainToInstance(UpdateConductorDTO, datos as Record<string, unknown>);
    await checkDto(dto);

    const update = await service.update(cedula, dto);
    return sendSuccess(res, 200, "Conductor actualizado correctamente", update)
  } catch (error) {
    return next(error)
  }
});

// Eliminar un conductor
router.delete('/:cedula', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cedula = req.params.cedula;
    await service.delete(cedula);
    return res.status(204);
  } catch (error) {
  return next(error)
  }
});


// Login 
router.post('/login', async (req: Request,res: Response, next: NextFunction)=>{
  try {
    //inicio de sesion
    const dto: ConductorLoginDTO = plainToInstance(ConductorLoginDTO, req.body as Record<string, unknown>);
    await checkDto(dto)
    const login = await service.login(dto);
    res.cookie('access_token', //nombre
      login.token, //contenido
      //config
      {httpOnly: true, // solo se accede en el servidor
      secure: process.env.NODE_ENV === 'production', //solo se accede por https
      sameSite: 'strict'}  // la cookie solo se accede desde el mismo dominio
      //maxAge: 1000 * 60 * 60} // la cookie solo es valida 1 hora
    )
    return sendSuccess(res, 200, "Sesión iniciada correctamente")
  } catch (error) {
    return next(error)
  }
})

//logout
router.post("/logout", requireAuth, (req: Request, res: Response, next: NextFunction) => {
  try {
    // Borra la cookie que guarda el JWT
    res.clearCookie("access_token", {
      httpOnly: true,
      secure: true, // usa true si estás en HTTPS
      sameSite: "strict",
    });
    // Limpia el estado de autenticación en el request
    req.auth = null;
    return sendSuccess(res, 200, "Sesión cerrada correctamente")
  } catch (error) {
    return next(error)
  }
});

// //Recuperar Contraseña
// router.put('/recuperar_contraseña', async (req:Request, res:Response) =>{
// try {
//   const dto: ConductorLoginDTO = plainToInstance(ConductorLoginDTO, req.body as Record<string, unknown>);
//   await checkDto(dto)
//   const conductor = await service.login(dto);
//     res.status(200).json({'Contraseña':'Cambiada', conductor});
  

// } catch (error) {
//   if (error instanceof ConflictError) 
//     { return res.status(409).json({ error: error.messages }); } 
//     if (error instanceof ValidationError) 
//     { return res.status(400).json({ error: error.messages }); } 
//     console.error("Error creando conductor:", error); 
//     res.status(500).json({ error: "Error interno del servidor" });
// }

// })

export default router;
