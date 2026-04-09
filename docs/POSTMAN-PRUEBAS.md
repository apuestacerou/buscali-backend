# Pruebas con Postman – Buscali Backend

Asegúrate de tener el servidor corriendo: `npm run dev` en `buscali-backend`.

Base URL: **http://localhost:3000**

---

## 1. Probar que el servidor responde

**GET** `http://localhost:3000/health`

- **Esperado:** Status 200, body: `{ "ok": true, "service": "buscali-backend" }`

---

## 2. Probar conexión a la base de datos (listar usuarios)

**GET** `http://localhost:3000/api/usuarios`

- **Esperado:** Status 200, body: un **array** (puede ser `[]` si no hay usuarios).
- Si la base de datos está conectada, la respuesta será un array. Si falla la conexión, el servidor habría dado error al arrancar o devolvería 500.

---

## 3. Crear un usuario (escribe en la BD)

**POST** `http://localhost:3000/api/usuarios`  
**Headers:** `Content-Type: application/json`  

Campos obligatorios: `nombre`, `apellido`, `telefono`, `password` (mínimo 6 caracteres). Opcionales: `email`, `rol`.

**Body (raw, JSON):**

```json
{
  "nombre": "Usuario",
  "apellido": "Prueba",
  "email": "prueba@buscali.com",
  "telefono": "3001234567",
  "password": "clave123",
  "rol": "pasajero"
}
```

- **Esperado:** Status 201, body con el usuario creado (sin `passwordHash`), con `id`, `nombre`, `email`, etc.

---

## 4. Iniciar sesión (validar correo/teléfono y contraseña)

**POST** `http://localhost:3000/api/auth/login`  
**Headers:** `Content-Type: application/json`  

**Body (raw, JSON):** `identificador` = correo (con `@`) **o** teléfono guardado al registrarse; `password` = la misma clave usada al crear el usuario.

```json
{
  "identificador": "prueba@buscali.com",
  "password": "clave123"
}
```

O solo con teléfono:

```json
{
  "identificador": "3001234567",
  "password": "clave123"
}
```

- **Esperado:** Status 200, body con el usuario (sin `passwordHash`).
- Credenciales incorrectas: Status **401**, `{ "error": "Credenciales incorrectas" }`.

---

## 5. Listar de nuevo (confirmar que se guardó)

**GET** `http://localhost:3000/api/usuarios`

- **Esperado:** Status 200, array con al menos el usuario que creaste. Así confirmas que la base de datos **lee y escribe** bien.

---

## 6. Otras pruebas opcionales

| Método | URL | Descripción |
|--------|-----|-------------|
| GET | `http://localhost:3000/api/usuarios/1` | Obtener usuario con id 1 |
| PUT | `http://localhost:3000/api/usuarios/1` | Actualizar (body: `{ "nombre": "Nuevo nombre" }`) |
| DELETE | `http://localhost:3000/api/usuarios/1` | Eliminar usuario con id 1 |

---

**Resumen:** Si **GET /api/usuarios** devuelve 200 y un array, y **POST /api/usuarios** devuelve 201 y el usuario creado, la base de datos está conectada y funcionando correctamente.
