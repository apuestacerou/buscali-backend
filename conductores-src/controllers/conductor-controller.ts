import { Router, Request, Response, NextFunction } from 'express';
import { ConductorService } from '../services/conductor-service';
import { CreateConductorDTO, UpdateConductorDTO, ConductorLoginDTO} from '../dto/conductor-dto';
import { plainToInstance } from 'class-transformer';
import { checkDto } from '../shared/error.class';
import { requireAuth } from '../middlewares/requireAuth';

const service = new ConductorService();
const router = Router();

// Listar todos los conductores
router.get('/', requireAuth, async (req: Request, res: Response, next: NextFunction) => {

  try {
    const conductores = await service.list();
    return res.status(200).json({
      status: "success",
      code: 200,
      message: "Conductores listados correctamente",
      data: conductores
    });
  } catch (error) {
    return next(error);
  }
});

// Obtener conductor por ID
router.get('/:cedula', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cedula = req.params.cedula;
    const conductor = await service.get(cedula);
    return res.status(200).json({
      status: "success",
      code: 200,
      message: "Conductor encontrado",
      data: conductor
    });
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
    return res.status(201).json({
      status: "success",
      code: 201,
      message: "Conductor creado correctamente",
      data: newConductor
    });
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
    return res.status(200).json({
      status: "success",
      code: 201,
      message: "Conductor actualizado correctamente",
      data: update
    });
  } catch (error) {
    return next(error)
  }
});

// Eliminar un conductor
router.delete('/:cedula', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cedula = req.params.cedula;
    await service.delete(cedula);
    return res.status(204)
    // .json({
    //   status: "success",
    //   code: 204,
    //   message: "Conductor eliminado correctamente"
    // });
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
    return res
    .cookie('access_token', //nombre
      login.token, //contenido
      //config
      {httpOnly: true, // solo se accede en el servidor
      secure: process.env.NODE_ENV === 'production', //solo se accede por https
      sameSite: 'strict'}  // la cookie solo se accede desde el mismo dominio
      //maxAge: 1000 * 60 * 60} // la cookie solo es valida 1 hora
    )
    .status(200).json({
      status: "success",
      code: 200,
      message: "Sesión iniciada correctamente"
    });
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
  
    return res.status(200).json({
      status: "success",
      code: 200,
      message: "Sesión cerrada correctamente"
    });
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
