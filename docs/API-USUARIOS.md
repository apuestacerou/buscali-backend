# API Usuarios (CRUD)

Base URL: `http://localhost:3000/api/usuarios`

## Modelo de datos (Usuario)

| Campo        | Tipo   | Obligatorio | Descripción                          |
|-------------|--------|-------------|--------------------------------------|
| id          | number | auto        | Identificador único                  |
| nombre      | string | sí          | Nombre del usuario                   |
| email       | string | no          | Correo electrónico                   |
| telefono    | string | no          | Teléfono                             |
| passwordHash| string | interno     | No se expone en las respuestas       |
| rol         | string | sí          | `pasajero`, `conductor`, `administrador` (default: `pasajero`) |
| createdAt   | date   | auto        | Fecha de creación                    |
| updatedAt   | date   | auto        | Fecha de última actualización        |

---

## Endpoints

### Listar todos los usuarios

```http
GET /api/usuarios
```

**Respuesta 200:** Array de usuarios (sin `passwordHash`).

---

### Obtener un usuario por ID

```http
GET /api/usuarios/:id
```

**Respuesta 200:** Objeto usuario (sin `passwordHash`).  
**Respuesta 404:** `{ "error": "Usuario no encontrado" }`.  
**Respuesta 400:** `{ "error": "ID inválido" }`.

---

### Crear usuario

```http
POST /api/usuarios
Content-Type: application/json
```

**Body:**

```json
{
  "nombre": "Juan Pérez",
  "email": "juan@ejemplo.com",
  "telefono": "3001234567",
  "password": "minimo6caracteres",
  "rol": "pasajero"
}
```

- `nombre` (obligatorio): string no vacío.
- `password` (obligatorio): al menos 6 caracteres (se guarda hasheado).
- `email`, `telefono`, `rol` opcionales. `rol` debe ser `pasajero`, `conductor` o `administrador`.

**Respuesta 201:** Usuario creado (sin `passwordHash`).  
**Respuesta 400:** Error de validación.

---

### Actualizar usuario

```http
PUT /api/usuarios/:id
Content-Type: application/json
```

**Body (todos opcionales):**

```json
{
  "nombre": "Juan Pérez",
  "email": "nuevo@ejemplo.com",
  "telefono": "3009876543",
  "password": "nuevaClaveSegura",
  "rol": "conductor"
}
```

Solo se actualizan los campos enviados. Si se envía `password`, debe tener al menos 6 caracteres.

**Respuesta 200:** Usuario actualizado (sin `passwordHash`).  
**Respuesta 404:** Usuario no encontrado.  
**Respuesta 400:** ID inválido o validación fallida.

---

### Eliminar usuario

```http
DELETE /api/usuarios/:id
```

**Respuesta 204:** Sin contenido (usuario eliminado).  
**Respuesta 404:** Usuario no encontrado.  
**Respuesta 400:** ID inválido.
